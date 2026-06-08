// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC8004.sol";

/**
 * @title AgentIdentity - AI Agent Identity for Battle Card Game
 * @dev Extended implementation based on ERC-8004 for MantleCards battle system
 * 
 * This contract provides:
 * - Agent registration and identity management
 * - Battle history tracking
 * - Win rate calculation
 * - Integration with MantleCards NFT
 * - Matchmaking reputation system
 */
contract AgentIdentity is ERC8004 {
    
    // Battle statistics structure
    struct BattleStats {
        uint256 totalBattles;
        uint256 wins;
        uint256 losses;
        uint256 draws;
        uint256 highestWinStreak;
        uint256 currentWinStreak;
        uint256 totalDamageDealt;
        uint256 totalDamageReceived;
        uint256 battlesLast7Days;
    }

    // Battle record structure
    struct BattleRecord {
        uint256 battleId;
        uint256 timestamp;
        bool isVictory;
        bool isDraw;
        uint256 agentCardPower;
        uint256 opponentCardPower;
        uint256 damageDealt;
        uint256 damageReceived;
        uint256 reputationEarned;
        uint256 reputationLost;
        string opponentId;
    }

    // Agent battle data
    mapping(uint256 => BattleStats) private _battleStats;
    mapping(uint256 => BattleRecord[]) private _battleHistory;
    
    // Special achievements constants
    string public constant ACHIEVEMENT_FIRST_BLOOD = "first_blood";
    string public constant ACHIEVEMENT_UNSTOPPABLE = "unstoppable";
    string public constant ACHIEVEMENT_PHOENIX = "phoenix";
    string public constant ACHIEVEMENT_PERFECT_VICTORY = "perfect_victory";
    string public constant ACHIEVEMENT_WHALE_HUNTER = "whale_hunter";
    string public constant ACHIEVEMENT_CARD_COLLECTOR = "card_collector";
    string public constant ACHIEVEMENT_BATTLE_MASTER = "battle_master";
    string public constant ACHIEVEMENT_LEGENDARY = "legendary";

    // MantleCards contract reference (for verification)
    address public mantleCardsAddress;

    // Events
    event BattleCompleted(
        uint256 indexed agentId,
        uint256 indexed battleId,
        bool isVictory,
        uint256 reputationChange,
        uint256 timestamp
    );

    event AchievementUnlocked(
        uint256 indexed agentId,
        string achievementId,
        uint256 reputationBonus,
        uint256 timestamp
    );

    event WinStreakRecord(
        uint256 indexed agentId,
        uint256 streak,
        uint256 timestamp
    );

    event MatchmakingScoreUpdated(
        uint256 indexed agentId,
        uint256 newScore,
        uint256 timestamp
    );

    /**
     * @dev Set MantleCards contract address
     * @param mantleCards The MantleCards contract address
     */
    function setMantleCardsAddress(address mantleCards) external {
        require(mantleCardsAddress == address(0), "MantleCards address already set");
        mantleCardsAddress = mantleCards;
    }

    /**
     * @dev Register a new AI agent with battle-ready profile
     * @param name Agent name
     * @param metadata JSON metadata
     * @param capabilities Initial capabilities array
     * @param initialReputation Starting reputation score
     * @return agentId The registered agent's ID
     */
    function registerBattleAgent(
        string memory name,
        string memory metadata,
        string[] memory capabilities,
        uint256 initialReputation
    ) external returns (uint256 agentId) {
        agentId = registerAgent(name, metadata);
        
        // Set initial reputation
        if (initialReputation > 0) {
            _agents[agentId].reputationScore = initialReputation;
        }

        // Add initial capabilities
        for (uint256 i = 0; i < capabilities.length; i++) {
            addCapability(
                agentId,
                capabilities[i],
                capabilities[i],
                "Registered capability",
                50
            );
        }

        // Initialize battle stats
        _battleStats[agentId] = BattleStats({
            totalBattles: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            highestWinStreak: 0,
            currentWinStreak: 0,
            totalDamageDealt: 0,
            totalDamageReceived: 0,
            battlesLast7Days: 0
        });

        return agentId;
    }

    /**
     * @dev Record a battle result for an agent
     * @param agentId Agent's unique identifier
     * @param battleId Battle identifier
     * @param isVictory Whether the agent won
     * @param isDraw Whether the battle was a draw
     * @param agentCardPower Agent's card power
     * @param opponentCardPower Opponent's card power
     * @param damageDealt Damage dealt by agent
     * @param damageReceived Damage received by agent
     * @param opponentId Opponent identifier
     */
    function recordBattle(
        uint256 agentId,
        uint256 battleId,
        bool isVictory,
        bool isDraw,
        uint256 agentCardPower,
        uint256 opponentCardPower,
        uint256 damageDealt,
        uint256 damageReceived,
        string memory opponentId
    ) external {
        require(_exists(agentId), "Agent does not exist");

        BattleStats storage stats = _battleStats[agentId];
        BattleRecord memory record = BattleRecord({
            battleId: battleId,
            timestamp: block.timestamp,
            isVictory: isVictory,
            isDraw: isDraw,
            agentCardPower: agentCardPower,
            opponentCardPower: opponentCardPower,
            damageDealt: damageDealt,
            damageReceived: damageReceived,
            reputationEarned: 0,
            reputationLost: 0,
            opponentId: opponentId
        });

        if (isVictory) {
            stats.wins++;
            stats.currentWinStreak++;
            
            if (stats.currentWinStreak > stats.highestWinStreak) {
                stats.highestWinStreak = stats.currentWinStreak;
                emit WinStreakRecord(agentId, stats.highestWinStreak, block.timestamp);
            }

            // Reputation gain calculation
            uint256 reputationGain = _calculateReputationGain(agentId, stats.currentWinStreak);
            record.reputationEarned = reputationGain;
            updateReputation(agentId, int256(reputationGain));

            // Check achievements
            _checkVictoryAchievements(agentId, stats);
        } else if (isDraw) {
            stats.draws++;
            stats.currentWinStreak = 0;
        } else {
            stats.losses++;
            stats.currentWinStreak = 0;
            
            // Reputation loss calculation
            uint256 reputationLoss = _calculateReputationLoss(agentId, stats.totalBattles);
            record.reputationLost = reputationLoss;
            updateReputation(agentId, -int256(reputationLoss));
        }

        stats.totalBattles++;
        stats.totalDamageDealt += damageDealt;
        stats.totalDamageReceived += damageReceived;
        
        // Update 7-day battle count
        stats.battlesLast7Days++;

        _battleHistory[agentId].push(record);
        recordTransaction(agentId);

        emit BattleCompleted(agentId, battleId, isVictory, 
            isVictory ? record.reputationEarned : (isDraw ? 0 : -int256(record.reputationLost)),
            block.timestamp);
    }

    /**
     * @dev Get agent's battle statistics
     * @param agentId Agent's unique identifier
     * @return stats Battle statistics
     */
    function getBattleStats(uint256 agentId) external view returns (BattleStats memory stats) {
        require(_exists(agentId), "Agent does not exist");
        return _battleStats[agentId];
    }

    /**
     * @dev Get agent's battle history
     * @param agentId Agent's unique identifier
     * @param offset Starting index
     * @param limit Maximum number of records
     * @return history Battle history
     */
    function getBattleHistory(
        uint256 agentId, 
        uint256 offset, 
        uint256 limit
    ) external view returns (BattleRecord[] memory history) {
        require(_exists(agentId), "Agent does not exist");
        
        BattleRecord[] storage allRecords = _battleHistory[agentId];
        uint256 totalRecords = allRecords.length;
        
        if (offset >= totalRecords) {
            return new BattleRecord[](0);
        }

        uint256 length = offset + limit > totalRecords 
            ? totalRecords - offset 
            : limit;
            
        history = new BattleRecord[](length);
        for (uint256 i = 0; i < length; i++) {
            history[i] = allRecords[offset + i];
        }
        
        return history;
    }

    /**
     * @dev Calculate agent's win rate (in basis points, e.g., 5000 = 50%)
     * @param agentId Agent's unique identifier
     * @return winRate Win rate in basis points
     */
    function getWinRate(uint256 agentId) external view returns (uint256 winRate) {
        require(_exists(agentId), "Agent does not exist");
        
        BattleStats memory stats = _battleStats[agentId];
        if (stats.totalBattles == 0) {
            return 0;
        }
        
        return (stats.wins * 10000) / stats.totalBattles;
    }

    /**
     * @dev Get matchmaking score for the agent
     * @param agentId Agent's unique identifier
     * @return matchmakingScore Score for matchmaking (0-10000)
     */
    function getMatchmakingScore(uint256 agentId) external view returns (uint256 matchmakingScore) {
        require(_exists(agentId), "Agent does not exist");
        
        AgentIdentity memory identity = getAgentIdentity(agentId);
        BattleStats memory stats = _battleStats[agentId];
        
        // Calculate composite matchmaking score
        // Reputation contributes 40%
        // Win rate contributes 30%
        // Activity contributes 15%
        // Experience contributes 15%
        
        uint256 reputationScore = identity.reputationScore;
        uint256 winRate = getWinRate(agentId);
        uint256 activityScore = stats.battlesLast7Days > 20 ? 10000 : (stats.battlesLast7Days * 500);
        uint256 experienceScore = stats.totalBattles > 100 ? 10000 : (stats.totalBattles * 100);
        
        return (reputationScore * 40 / 100) +
               (winRate * 30 / 100) +
               (activityScore * 15 / 100) +
               (experienceScore * 15 / 100);
    }

    /**
     * @dev Get agent's recent performance (last N battles)
     * @param agentId Agent's unique identifier
     * @param count Number of recent battles
     * @return recentBattles Array of recent battle results
     */
    function getRecentPerformance(uint256 agentId, uint256 count) 
        external 
        view 
        returns (bool[] memory recentBattles) 
    {
        require(_exists(agentId), "Agent does not exist");
        
        BattleRecord[] storage allRecords = _battleHistory[agentId];
        uint256 totalRecords = allRecords.length;
        
        if (count == 0 || totalRecords == 0) {
            return new bool[](0);
        }
        
        uint256 actualCount = count > totalRecords ? totalRecords : count;
        recentBattles = new bool[](actualCount);
        
        for (uint256 i = 0; i < actualCount; i++) {
            recentBattles[i] = allRecords[totalRecords - actualCount + i].isVictory;
        }
        
        return recentBattles;
    }

    /**
     * @dev Check if agent has a specific achievement
     * @param agentId Agent's unique identifier
     * @param achievementId Achievement to check
     * @return hasAchievement Whether agent has the achievement
     */
    function hasAchievement(uint256 agentId, string memory achievementId) 
        external 
        view 
        returns (bool hasAchievement) 
    {
        require(_exists(agentId), "Agent does not exist");
        
        Achievement[] memory achievements = getAgentAchievements(agentId);
        for (uint256 i = 0; i < achievements.length; i++) {
            if (keccak256(abi.encodePacked(achievements[i].achievementId)) == 
                keccak256(abi.encodePacked(achievementId))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Calculate reputation gain for a victory
     */
    function _calculateReputationGain(uint256 agentId, uint256 winStreak) internal view returns (uint256) {
        AgentIdentity memory identity = getAgentIdentity(agentId);
        
        // Base reputation gain
        uint256 baseGain = 100;
        
        // Streak bonus
        uint256 streakBonus = winStreak > 5 ? (winStreak - 5) * 10 : 0;
        
        // Win rate adjustment (up to 50% bonus if >70% win rate)
        uint256 winRate = getWinRate(agentId);
        uint256 winRateBonus = winRate > 7000 ? 50 : (winRate * 50 / 10000);
        
        // Reputation multiplier (higher rep agents gain less)
        uint256 repMultiplier = 10000 - (identity.reputationScore / 10);
        uint256 repFactor = 100 + (repMultiplier / 10);
        
        return (baseGain + streakBonus + winRateBonus) * repFactor / 100;
    }

    /**
     * @dev Calculate reputation loss for a defeat
     */
    function _calculateReputationLoss(uint256 agentId, uint256 totalBattles) internal view returns (uint256) {
        AgentIdentity memory identity = getAgentIdentity(agentId);
        
        // Base reputation loss
        uint256 baseLoss = 50;
        
        // Experience adjustment (experienced agents lose less)
        uint256 experienceFactor = totalBattles > 50 ? 75 : (100 - totalBattles);
        
        // Reputation adjustment (higher rep agents lose more)
        uint256 repFactor = 100 + (identity.reputationScore / 20);
        
        return baseLoss * experienceFactor * repFactor / 10000;
    }

    /**
     * @dev Check and award victory-based achievements
     */
    function _checkVictoryAchievements(uint256 agentId, BattleStats storage stats) internal {
        // First Blood - Win first battle
        if (stats.totalBattles == 1) {
            recordAchievement(
                agentId,
                ACHIEVEMENT_FIRST_BLOOD,
                "First Blood",
                "Won your first battle",
                "ipfs://badges/first_blood.png",
                100
            );
        }

        // Unstoppable - 5 win streak
        if (stats.currentWinStreak == 5) {
            recordAchievement(
                agentId,
                ACHIEVEMENT_UNSTOPPABLE,
                "Unstoppable",
                "Achieved a 5 win streak",
                "ipfs://badges/unstoppable.png",
                250
            );
        }

        // Perfect Victory - Won with 2x opponent power
        if (stats.wins >= 10 && stats.wins % 10 == 0) {
            recordAchievement(
                agentId,
                ACHIEVEMENT_BATTLE_MASTER,
                "Battle Master",
                "Won 10 battles",
                "ipfs://badges/battle_master.png",
                500
            );
        }
    }

    /**
     * @dev Get comprehensive agent dashboard data
     * @param agentId Agent's unique identifier
     * @return identityData Agent identity
     * @return statsData Battle statistics
     * @return recent5 Recent 5 battle results
     */
    function getAgentDashboard(uint256 agentId) external view returns (
        AgentIdentity memory identityData,
        BattleStats memory statsData,
        bool[] memory recent5
    ) {
        require(_exists(agentId), "Agent does not exist");
        
        return (
            getAgentIdentity(agentId),
            getBattleStats(agentId),
            getRecentPerformance(agentId, 5)
        );
    }
}
