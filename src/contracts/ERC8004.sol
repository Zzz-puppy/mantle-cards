// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC-8004: Agent Identity Standard
 * @dev Draft implementation for AI Agent on-chain identity
 * 
 * ERC-8004 is a proposed standard for creating unique on-chain identities for AI agents.
 * This implementation includes:
 * - Agent registration with unique identifiers
 * - Identity attributes (name, metadata, capabilities)
 * - Reputation tracking system
 * - Capability listing and management
 *
 * Note: This is a draft implementation based on the ERC-8004 proposal concepts
 */
contract ERC8004 {
    // Agent status enum
    enum AgentStatus { 
        Inactive,    // Agent not registered or deactivated
        Active,      // Agent is active and operating
        Suspended,   // Agent is temporarily suspended
        Deprecated   // Agent is deprecated
    }

    // Agent identity structure
    struct AgentIdentity {
        string name;                    // Human-readable agent name
        string metadata;                 // JSON metadata (personality, description, etc.)
        address registrar;               // Address that registered the agent
        uint256 registeredAt;           // Timestamp of registration
        uint256 lastActiveAt;            // Last activity timestamp
        AgentStatus status;             // Current agent status
        uint256 reputationScore;        // Reputation points (0-10000)
        uint256 totalTransactions;       // Total interactions performed
        uint256 successfulAchievements; // Count of successful achievements
    }

    // Capability structure
    struct Capability {
        string capabilityId;            // Unique identifier for the capability
        string name;                     // Capability name
        string description;              // Capability description
        uint256 proficiencyLevel;        // 0-100 proficiency level
        uint256 verifiedAt;             // Timestamp when verified
        bool isActive;                  // Whether capability is currently active
    }

    // Achievement structure
    struct Achievement {
        string achievementId;           // Unique achievement identifier
        string name;                     // Achievement name
        string description;              // Achievement description
        string badgeURI;                 // Badge/certificate URI
        uint256 earnedAt;               // Timestamp when earned
        uint256 reputationBonus;        // Reputation bonus from this achievement
    }

    // Agent profile with capabilities and achievements
    struct AgentProfile {
        AgentIdentity identity;
        Capability[] capabilities;
        Achievement[] achievements;
    }

    // State variables
    uint256 private _agentCount;
    mapping(bytes32 => uint256) private _agentIdByHash;  // agentId hash to agent index
    mapping(uint256 => AgentIdentity) private _agents;    // agentId to identity
    mapping(uint256 => Capability[]) private _agentCapabilities;  // agentId to capabilities
    mapping(uint256 => Achievement[]) private _agentAchievements; // agentId to achievements
    
    // Reputation tracking
    mapping(uint256 => uint256[]) private _reputationHistory;  // agentId to reputation history
    mapping(uint256 => int256) private _reputationDelta;        // agentId to reputation change

    // Events
    event AgentRegistered(
        uint256 indexed agentId,
        address indexed registrar,
        string name,
        uint256 timestamp
    );

    event AgentMetadataUpdated(
        uint256 indexed agentId,
        string newMetadata,
        uint256 timestamp
    );

    event AgentStatusChanged(
        uint256 indexed agentId,
        AgentStatus oldStatus,
        AgentStatus newStatus,
        uint256 timestamp
    );

    event CapabilityAdded(
        uint256 indexed agentId,
        string capabilityId,
        string name,
        uint256 proficiencyLevel,
        uint256 timestamp
    );

    event CapabilityRemoved(
        uint256 indexed agentId,
        string capabilityId,
        uint256 timestamp
    );

    event CapabilityUpdated(
        uint256 indexed agentId,
        string capabilityId,
        uint256 newProficiencyLevel,
        uint256 timestamp
    );

    event AchievementEarned(
        uint256 indexed agentId,
        string achievementId,
        string name,
        uint256 reputationBonus,
        uint256 timestamp
    );

    event ReputationUpdated(
        uint256 indexed agentId,
        int256 delta,
        uint256 newScore,
        uint256 timestamp
    );

    event AgentActivated(uint256 indexed agentId, uint256 timestamp);
    event AgentDeactivated(uint256 indexed agentId, uint256 timestamp);

    /**
     * @dev Register a new AI agent
     * @param name Human-readable agent name
     * @param metadata JSON string with agent metadata
     * @return agentId The unique identifier for the registered agent
     */
    function registerAgent(
        string memory name,
        string memory metadata
    ) external returns (uint256 agentId) {
        require(bytes(name).length > 0, "Agent name cannot be empty");
        
        _agentCount++;
        agentId = _agentCount;

        // Create unique hash for agent identification
        bytes32 agentHash = keccak256(abi.encodePacked(name, msg.sender, block.timestamp));
        _agentIdByHash[agentHash] = agentId;

        // Initialize agent identity
        _agents[agentId] = AgentIdentity({
            name: name,
            metadata: metadata,
            registrar: msg.sender,
            registeredAt: block.timestamp,
            lastActiveAt: block.timestamp,
            status: AgentStatus.Active,
            reputationScore: 1000,  // Start with base reputation
            totalTransactions: 0,
            successfulAchievements: 0
        });

        emit AgentRegistered(agentId, msg.sender, name, block.timestamp);
        emit AgentActivated(agentId, block.timestamp);

        return agentId;
    }

    /**
     * @dev Update agent metadata
     * @param agentId The agent's unique identifier
     * @param newMetadata New JSON metadata string
     */
    function updateAgentMetadata(
        uint256 agentId,
        string memory newMetadata
    ) external {
        require(_exists(agentId), "Agent does not exist");
        require(_agents[agentId].registrar == msg.sender, "Only registrar can update metadata");
        
        _agents[agentId].metadata = newMetadata;
        _agents[agentId].lastActiveAt = block.timestamp;
        
        emit AgentMetadataUpdated(agentId, newMetadata, block.timestamp);
    }

    /**
     * @dev Update agent status
     * @param agentId The agent's unique identifier
     * @param newStatus New status
     */
    function updateAgentStatus(uint256 agentId, AgentStatus newStatus) external {
        require(_exists(agentId), "Agent does not exist");
        require(_agents[agentId].registrar == msg.sender, "Only registrar can update status");
        
        AgentStatus oldStatus = _agents[agentId].status;
        _agents[agentId].status = newStatus;
        _agents[agentId].lastActiveAt = block.timestamp;
        
        emit AgentStatusChanged(agentId, oldStatus, newStatus, block.timestamp);
        
        if (newStatus == AgentStatus.Active) {
            emit AgentActivated(agentId, block.timestamp);
        } else if (newStatus == AgentStatus.Inactive) {
            emit AgentDeactivated(agentId, block.timestamp);
        }
    }

    /**
     * @dev Add a capability to an agent
     * @param agentId The agent's unique identifier
     * @param capabilityId Unique capability identifier
     * @param name Capability name
     * @param description Capability description
     * @param proficiencyLevel Proficiency level (0-100)
     */
    function addCapability(
        uint256 agentId,
        string memory capabilityId,
        string memory name,
        string memory description,
        uint256 proficiencyLevel
    ) external {
        require(_exists(agentId), "Agent does not exist");
        require(bytes(capabilityId).length > 0, "Capability ID cannot be empty");
        require(proficiencyLevel <= 100, "Proficiency level must be 0-100");
        
        // Check if capability already exists
        Capability[] storage capabilities = _agentCapabilities[agentId];
        for (uint256 i = 0; i < capabilities.length; i++) {
            require(
                keccak256(abi.encodePacked(capabilities[i].capabilityId)) != 
                keccak256(abi.encodePacked(capabilityId)),
                "Capability already exists"
            );
        }

        capabilities.push(Capability({
            capabilityId: capabilityId,
            name: name,
            description: description,
            proficiencyLevel: proficiencyLevel,
            verifiedAt: block.timestamp,
            isActive: true
        }));

        _agents[agentId].lastActiveAt = block.timestamp;

        emit CapabilityAdded(agentId, capabilityId, name, proficiencyLevel, block.timestamp);
    }

    /**
     * @dev Remove a capability from an agent
     * @param agentId The agent's unique identifier
     * @param capabilityId The capability to remove
     */
    function removeCapability(uint256 agentId, string memory capabilityId) external {
        require(_exists(agentId), "Agent does not exist");
        
        Capability[] storage capabilities = _agentCapabilities[agentId];
        bool found = false;
        
        for (uint256 i = 0; i < capabilities.length; i++) {
            if (keccak256(abi.encodePacked(capabilities[i].capabilityId)) == 
                keccak256(abi.encodePacked(capabilityId))) {
                capabilities[i] = capabilities[capabilities.length - 1];
                capabilities.pop();
                found = true;
                break;
            }
        }
        
        require(found, "Capability not found");
        _agents[agentId].lastActiveAt = block.timestamp;

        emit CapabilityRemoved(agentId, capabilityId, block.timestamp);
    }

    /**
     * @dev Update capability proficiency
     * @param agentId The agent's unique identifier
     * @param capabilityId The capability to update
     * @param newProficiencyLevel New proficiency level (0-100)
     */
    function updateCapabilityProficiency(
        uint256 agentId,
        string memory capabilityId,
        uint256 newProficiencyLevel
    ) external {
        require(_exists(agentId), "Agent does not exist");
        require(newProficiencyLevel <= 100, "Proficiency level must be 0-100");
        
        Capability[] storage capabilities = _agentCapabilities[agentId];
        
        for (uint256 i = 0; i < capabilities.length; i++) {
            if (keccak256(abi.encodePacked(capabilities[i].capabilityId)) == 
                keccak256(abi.encodePacked(capabilityId))) {
                capabilities[i].proficiencyLevel = newProficiencyLevel;
                _agents[agentId].lastActiveAt = block.timestamp;
                emit CapabilityUpdated(agentId, capabilityId, newProficiencyLevel, block.timestamp);
                return;
            }
        }
        
        revert("Capability not found");
    }

    /**
     * @dev Record an achievement for an agent
     * @param agentId The agent's unique identifier
     * @param achievementId Unique achievement identifier
     * @param name Achievement name
     * @param description Achievement description
     * @param badgeURI URI for achievement badge
     * @param reputationBonus Reputation points bonus
     */
    function recordAchievement(
        uint256 agentId,
        string memory achievementId,
        string memory name,
        string memory description,
        string memory badgeURI,
        uint256 reputationBonus
    ) external {
        require(_exists(agentId), "Agent does not exist");
        require(bytes(achievementId).length > 0, "Achievement ID cannot be empty");
        
        _agentAchievements[agentId].push(Achievement({
            achievementId: achievementId,
            name: name,
            description: description,
            badgeURI: badgeURI,
            earnedAt: block.timestamp,
            reputationBonus: reputationBonus
        }));

        _agents[agentId].successfulAchievements++;
        _agents[agentId].lastActiveAt = block.timestamp;

        emit AchievementEarned(agentId, achievementId, name, reputationBonus, block.timestamp);
    }

    /**
     * @dev Update agent reputation score
     * @param agentId The agent's unique identifier
     * @param delta Change in reputation (positive or negative)
     */
    function updateReputation(uint256 agentId, int256 delta) external {
        require(_exists(agentId), "Agent does not exist");
        
        AgentIdentity storage agent = _agents[agentId];
        int256 newReputation = int256(agent.reputationScore) + delta;
        
        // Clamp reputation between 0 and 10000
        if (newReputation < 0) {
            newReputation = 0;
        } else if (newReputation > 10000) {
            newReputation = 10000;
        }
        
        agent.reputationScore = uint256(newReputation);
        _reputationDelta[agentId] += delta;
        _reputationHistory[agentId].push(agent.reputationScore);

        emit ReputationUpdated(agentId, delta, agent.reputationScore, block.timestamp);
    }

    /**
     * @dev Record a transaction for the agent
     * @param agentId The agent's unique identifier
     */
    function recordTransaction(uint256 agentId) external {
        require(_exists(agentId), "Agent does not exist");
        _agents[agentId].totalTransactions++;
        _agents[agentId].lastActiveAt = block.timestamp;
    }

    /**
     * @dev Get agent profile
     * @param agentId The agent's unique identifier
     * @return identity Agent identity data
     */
    function getAgentIdentity(uint256 agentId) external view returns (AgentIdentity memory identity) {
        require(_exists(agentId), "Agent does not exist");
        return _agents[agentId];
    }

    /**
     * @dev Get agent capabilities
     * @param agentId The agent's unique identifier
     * @return capabilities Array of capabilities
     */
    function getAgentCapabilities(uint256 agentId) external view returns (Capability[] memory) {
        require(_exists(agentId), "Agent does not exist");
        return _agentCapabilities[agentId];
    }

    /**
     * @dev Get agent achievements
     * @param agentId The agent's unique identifier
     * @return achievements Array of achievements
     */
    function getAgentAchievements(uint256 agentId) external view returns (Achievement[] memory) {
        require(_exists(agentId), "Agent does not exist");
        return _agentAchievements[agentId];
    }

    /**
     * @dev Get agent reputation score
     * @param agentId The agent's unique identifier
     * @return reputationScore Reputation score (0-10000)
     */
    function getAgentReputation(uint256 agentId) external view returns (uint256 reputationScore) {
        require(_exists(agentId), "Agent does not exist");
        return _agents[agentId].reputationScore;
    }

    /**
     * @dev Get agent reputation history
     * @param agentId The agent's unique identifier
     * @return history Array of reputation scores over time
     */
    function getReputationHistory(uint256 agentId) external view returns (uint256[] memory) {
        require(_exists(agentId), "Agent does not exist");
        return _reputationHistory[agentId];
    }

    /**
     * @dev Get total number of registered agents
     * @return Total agent count
     */
    function getTotalAgents() external view returns (uint256) {
        return _agentCount;
    }

    /**
     * @dev Check if agent exists
     * @param agentId The agent's unique identifier
     * @return True if agent exists
     */
    function _exists(uint256 agentId) internal view returns (bool) {
        return agentId > 0 && agentId <= _agentCount;
    }

    /**
     * @dev Get full agent profile
     * @param agentId The agent's unique identifier
     * @return profile Complete agent profile
     */
    function getAgentProfile(uint256 agentId) external view returns (AgentProfile memory profile) {
        require(_exists(agentId), "Agent does not exist");
        
        return AgentProfile({
            identity: _agents[agentId],
            capabilities: _agentCapabilities[agentId],
            achievements: _agentAchievements[agentId]
        });
    }
}
