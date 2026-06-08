// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MantleCards is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Rarity levels: 0 = common, 1 = rare, 2 = epic, 3 = legendary
    enum Rarity { Common, Rare, Epic, Legendary }

    // Card attributes structure
    struct CardAttributes {
        string name;
        uint8 rarity; // 0-3 mapping to Rarity enum
        uint256 attack;
        uint256 defense;
        string specialAbility;
        string imageURI;
        string baseToken;
        uint256 tokenBalance;
        uint256 transactionCount;
    }

    // Mapping from token ID to card attributes
    mapping(uint256 => CardAttributes) public cardAttributes;

    // Mapping from address to list of token IDs owned
    mapping(address => uint256[]) public userCards;

    // Mapping for card image URIs
    mapping(uint256 => string) private _cardImages;

    // Events
    event CardMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        uint8 rarity,
        uint256 attack,
        uint256 defense,
        string specialAbility
    );

    event CardImageUpdated(uint256 indexed tokenId, string imageURI);

    event CardTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    constructor(address initialOwner) 
        ERC721("MantleCards", "MC") 
        Ownable(initialOwner)
    {}

    /**
     * @dev Mint a new card with specified attributes
     * @param to Address to receive the card
     * @param name Name of the card
     * @param rarity Rarity level (0=Common, 1=Rare, 2=Epic, 3=Legendary)
     * @param attack Attack power
     * @param defense Defense power
     * @param specialAbility Description of special ability
     */
    function mintCard(
        address to,
        string memory name,
        uint8 rarity,
        uint256 attack,
        uint256 defense,
        string memory specialAbility,
        string memory imageURI,
        string memory baseToken,
        uint256 tokenBalance,
        uint256 transactionCount
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(rarity <= 3, "Invalid rarity level");
        require(bytes(name).length > 0, "Card name cannot be empty");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);

        cardAttributes[newTokenId] = CardAttributes({
            name: name,
            rarity: rarity,
            attack: attack,
            defense: defense,
            specialAbility: specialAbility,
            imageURI: imageURI,
            baseToken: baseToken,
            tokenBalance: tokenBalance,
            transactionCount: transactionCount
        });

        userCards[to].push(newTokenId);

        emit CardMinted(
            newTokenId,
            to,
            name,
            rarity,
            attack,
            defense,
            specialAbility
        );

        return newTokenId;
    }

    /**
     * @dev Get card attributes by token ID
     * @param tokenId Token ID of the card
     */
    function getCardAttributes(uint256 tokenId) 
        external 
        view 
        returns (
            string memory name,
            uint8 rarity,
            uint256 attack,
            uint256 defense,
            string memory specialAbility,
            string memory imageURI,
            string memory baseToken,
            uint256 tokenBalance,
            uint256 transactionCount
        ) 
    {
        require(_exists(tokenId), "Card does not exist");
        CardAttributes memory attrs = cardAttributes[tokenId];
        return (
            attrs.name,
            attrs.rarity,
            attrs.attack,
            attrs.defense,
            attrs.specialAbility,
            attrs.imageURI,
            attrs.baseToken,
            attrs.tokenBalance,
            attrs.transactionCount
        );
    }

    /**
     * @dev Get all card IDs owned by a user
     * @param user Address of the user
     */
    function getUserCards(address user) external view returns (uint256[] memory) {
        return userCards[user];
    }

    /**
     * @dev Get total number of cards minted
     */
    function getTotalMinted() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Set card image URI (only owner can update)
     * @param tokenId Token ID of the card
     * @param imageURI New image URI
     */
    function setCardImage(uint256 tokenId, string memory imageURI) 
        external 
        onlyOwner 
    {
        require(_exists(tokenId), "Card does not exist");
        require(bytes(imageURI).length > 0, "Image URI cannot be empty");
        
        _cardImages[tokenId] = imageURI;
        cardAttributes[tokenId].imageURI = imageURI;
        
        emit CardImageUpdated(tokenId, imageURI);
    }

    /**
     * @dev Get card image URI
     * @param tokenId Token ID of the card
     */
    function getCardImage(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Card does not exist");
        return _cardImages[tokenId];
    }

    /**
     * @dev Get rarity as string
     * @param rarity Rarity level (0-3)
     */
    function getRarityString(uint8 rarity) external pure returns (string memory) {
        if (rarity == 0) return "common";
        if (rarity == 1) return "rare";
        if (rarity == 2) return "epic";
        if (rarity == 3) return "legendary";
        revert "Invalid rarity";
    }

    /**
     * @dev Update card attributes (only owner)
     */
    function updateCardAttributes(
        uint256 tokenId,
        uint256 attack,
        uint256 defense,
        string memory specialAbility
    ) external onlyOwner {
        require(_exists(tokenId), "Card does not exist");
        
        cardAttributes[tokenId].attack = attack;
        cardAttributes[tokenId].defense = defense;
        cardAttributes[tokenId].specialAbility = specialAbility;
    }

    /**
     * @dev Override transfer to track userCards
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        super.transferFrom(from, to, tokenId);
        _updateUserCards(from, to, tokenId);
        emit CardTransferred(tokenId, from, to);
    }

    /**
     * @dev Override safeTransferFrom to track userCards
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        super.safeTransferFrom(from, to, tokenId, data);
        _updateUserCards(from, to, tokenId);
        emit CardTransferred(tokenId, from, to);
    }

    /**
     * @dev Internal function to update userCards mapping
     */
    function _updateUserCards(address from, address to, uint256 tokenId) internal {
        // Remove from sender's array
        uint256 length = userCards[from].length;
        for (uint256 i = 0; i < length; i++) {
            if (userCards[from][i] == tokenId) {
                // Replace with last element
                userCards[from][i] = userCards[from][length - 1];
                userCards[from].pop();
                break;
            }
        }
        
        // Add to receiver's array
        userCards[to].push(tokenId);
    }

    /**
     * @dev Check if token exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
}
