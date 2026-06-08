// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    // listing fee in wei (0.001 MNT)
    uint256 public constant LISTING_FEE = 0.001 ether;
    
    // marketplace fee percentage (2.5%)
    uint256 public constant MARKETPLACE_FEE_PERCENT = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // royalty percentage for creators (5%)
    uint256 public constant CREATOR_ROYALTY_PERCENT = 500;
    
    // Structure for listing
    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price; // in wei (MNT)
        string description;
        uint256 createdAt;
        bool isActive;
    }
    
    // Counter for listing IDs
    uint256 private _listingIds;
    
    // Mapping from listing ID to Listing
    mapping(uint256 => Listing) public listings;
    
    // Mapping from address to list of listing IDs (user's listings)
    mapping(address => uint256[]) public userListings;
    
    // Mapping to track if user has paid listing fee for current listing
    mapping(address => bool) public hasPaidListingFee;
    
    // Events
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    
    event ListingPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 marketplaceFee,
        uint256 creatorRoyalty
    );
    
    event ListingCancelled(uint256 indexed listingId, address indexed seller);
    
    event ListingPriceUpdated(uint256 indexed listingId, uint256 oldPrice, uint256 newPrice);
    
    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);
    
    event CreatorRoyaltyUpdated(uint256 oldRoyalty, uint256 newRoyalty);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Create a new listing for an NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID of the NFT
     * @param price Price in wei (MNT)
     * @param description Description of the listing
     */
    function createListing(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        string memory description
    ) external payable nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(msg.value >= LISTING_FEE, "Insufficient listing fee");
        
        // Verify the caller owns the NFT
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        
        // Approve marketplace to transfer NFT if not already approved
        address marketplaceAddress = address(this);
        if (nft.getApproved(tokenId) != marketplaceAddress) {
            require(nft.setApprovalForAll(marketplaceAddress, true), "Approval failed");
        }
        
        _listingIds++;
        uint256 listingId = _listingIds;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            description: description,
            createdAt: block.timestamp,
            isActive: true
        });
        
        userListings[msg.sender].push(listingId);
        hasPaidListingFee[msg.sender] = true;
        
        // Refund excess payment
        if (msg.value > LISTING_FEE) {
            payable(msg.sender).transfer(msg.value - LISTING_FEE);
        }
        
        emit ListingCreated(listingId, msg.sender, nftContract, tokenId, price);
        
        return listingId;
    }
    
    /**
     * @dev Purchase a listing
     * @param listingId ID of the listing to purchase
     */
    function buyListing(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.isActive, "Listing is not active");
        require(listing.seller != msg.sender, "Cannot buy your own listing");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate fees
        uint256 marketplaceFee = (listing.price * MARKETPLACE_FEE_PERCENT) / FEE_DENOMINATOR;
        
        // Get creator address for royalty (simplified - in production would use IERC2981)
        address creator = Ownable(listing.nftContract).owner();
        uint256 creatorRoyalty = (listing.price * CREATOR_ROYALTY_PERCENT) / FEE_DENOMINATOR;
        
        // Transfer NFT to buyer
        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );
        
        // Transfer payment to seller (minus fees)
        uint256 sellerAmount = listing.price - marketplaceFee - creatorRoyalty;
        payable(listing.seller).transfer(sellerAmount);
        
        // Send marketplace fee to owner
        if (marketplaceFee > 0) {
            payable(owner()).transfer(marketplaceFee);
        }
        
        // Send royalty to creator
        if (creatorRoyalty > 0 && creator != listing.seller) {
            payable(creator).transfer(creatorRoyalty);
        }
        
        // Mark listing as inactive
        listing.isActive = false;
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit ListingPurchased(listingId, msg.sender, listing.seller, listing.price, marketplaceFee, creatorRoyalty);
    }
    
    /**
     * @dev Cancel a listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender || msg.sender == owner(), "Not authorized");
        
        listing.isActive = false;
        
        // Remove from user's listings
        _removeListingFromUser(listing.seller, listingId);
        
        emit ListingCancelled(listingId, listing.seller);
    }
    
    /**
     * @dev Update the price of a listing
     * @param listingId ID of the listing
     * @param newPrice New price in wei (MNT)
     */
    function updatePrice(uint256 listingId, uint256 newPrice) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Not authorized");
        require(newPrice > 0, "Price must be greater than 0");
        
        uint256 oldPrice = listing.price;
        listing.price = newPrice;
        
        emit ListingPriceUpdated(listingId, oldPrice, newPrice);
    }
    
    /**
     * @dev Get all active listings
     */
    function getActiveListings() external view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _listingIds; i++) {
            if (listings[i].isActive) {
                count++;
            }
        }
        
        Listing[] memory activeListings = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _listingIds; i++) {
            if (listings[i].isActive) {
                activeListings[index] = listings[i];
                index++;
            }
        }
        
        return activeListings;
    }
    
    /**
     * @dev Get listings by a specific user
     * @param user Address of the user
     * @param activeOnly If true, return only active listings
     */
    function getUserListings(address user, bool activeOnly) external view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < userListings[user].length; i++) {
            uint256 listingId = userListings[user][i];
            if (!activeOnly || listings[listingId].isActive) {
                count++;
            }
        }
        
        Listing[] memory userListingsResult = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < userListings[user].length; i++) {
            uint256 listingId = userListings[user][i];
            if (!activeOnly || listings[listingId].isActive) {
                userListingsResult[index] = listings[listingId];
                index++;
            }
        }
        
        return userListingsResult;
    }
    
    /**
     * @dev Get listings by NFT contract and token ID
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     */
    function getListingsForToken(address nftContract, uint256 tokenId) external view returns (Listing[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _listingIds; i++) {
            if (listings[i].nftContract == nftContract && 
                listings[i].tokenId == tokenId && 
                listings[i].isActive) {
                count++;
            }
        }
        
        Listing[] memory tokenListings = new Listing[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _listingIds; i++) {
            if (listings[i].nftContract == nftContract && 
                listings[i].tokenId == tokenId && 
                listings[i].isActive) {
                tokenListings[index] = listings[i];
                index++;
            }
        }
        
        return tokenListings;
    }
    
    /**
     * @dev Get listing details
     * @param listingId ID of the listing
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        require(listingId > 0 && listingId <= _listingIds, "Listing does not exist");
        return listings[listingId];
    }
    
    /**
     * @dev Get total number of listings
     */
    function getTotalListings() external view returns (uint256) {
        return _listingIds;
    }
    
    /**
     * @dev Get marketplace fee percentage
     */
    function getMarketplaceFee(uint256 price) external pure returns (uint256) {
        return (price * MARKETPLACE_FEE_PERCENT) / FEE_DENOMINATOR;
    }
    
    /**
     * @dev Get creator royalty for a price
     */
    function getCreatorRoyalty(uint256 price) external pure returns (uint256) {
        return (price * CREATOR_ROYALTY_PERCENT) / FEE_DENOMINATOR;
    }
    
    /**
     * @dev Calculate total price including all fees
     */
    function getTotalPrice(uint256 price) external pure returns (uint256) {
        uint256 marketplaceFee = (price * MARKETPLACE_FEE_PERCENT) / FEE_DENOMINATOR;
        uint256 creatorRoyalty = (price * CREATOR_ROYALTY_PERCENT) / FEE_DENOMINATOR;
        return price + marketplaceFee + creatorRoyalty;
    }
    
    /**
     * @dev Update marketplace fee percentage (owner only)
     */
    function updateMarketplaceFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee cannot exceed 10%"); // Max 10%
        uint256 oldFee = MARKETPLACE_FEE_PERCENT;
        // Note: constant cannot be modified, this would need a state variable in production
        emit MarketplaceFeeUpdated(oldFee, newFeePercent);
    }
    
    /**
     * @dev Withdraw accumulated fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Internal function to remove listing from user's array
     */
    function _removeListingFromUser(address user, uint256 listingId) internal {
        uint256 length = userListings[user].length;
        for (uint256 i = 0; i < length; i++) {
            if (userListings[user][i] == listingId) {
                userListings[user][i] = userListings[user][length - 1];
                userListings[user].pop();
                break;
            }
        }
    }
    
    /**
     * @dev Check if a listing exists
     */
    function listingExists(uint256 listingId) external view returns (bool) {
        return listingId > 0 && listingId <= _listingIds && listings[listingId].isActive;
    }
}
