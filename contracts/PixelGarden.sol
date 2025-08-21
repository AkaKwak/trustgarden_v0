// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PixelGarden
 * @dev A competitive pixel grid where users stake TRUST tokens to control pixel states
 */
contract PixelGarden is ReentrancyGuard, Ownable {
    // Grid dimensions
    uint32 public immutable width;
    uint32 public immutable height;
    
    // TRUST token contract
    IERC20 public immutable trustToken;
    
    // Canonical state names (order matters for consistency)
    string[] public allowedStates = [
        "empty",
        "soil", 
        "seed",
        "sprout",
        "leaf",
        "flower:red",
        "flower:yellow", 
        "flower:blue",
        "flower:white",
        "shrub",
        "tree",
        "water",
        "stone",
        "path"
    ];
    
    // State information for a specific pixel state
    struct PixelState {
        uint256 stake;
    }
    
    // Pixel information
    struct Pixel {
        mapping(bytes32 => PixelState) states;
        bytes32 current;
        uint64 lastUpdate;
    }
    
    // Grid storage: x => y => Pixel
    mapping(uint32 => mapping(uint32 => Pixel)) private grid;
    
    // Events
    event PixelChanged(
        uint32 indexed x,
        uint32 indexed y, 
        bytes32 oldState,
        bytes32 newState,
        bytes32 actedState,
        uint256 amount,
        address indexed actor
    );
    
    /**
     * @dev Constructor
     * @param _width Grid width
     * @param _height Grid height  
     * @param _trustToken TRUST token contract address
     */
    constructor(uint32 _width, uint32 _height, address _trustToken) Ownable(msg.sender) {
        require(_width > 0 && _height > 0, "Invalid grid dimensions");
        require(_trustToken != address(0), "Invalid trust token address");
        
        width = _width;
        height = _height;
        trustToken = IERC20(_trustToken);
    }
    
    /**
     * @dev Set pixel state by staking TRUST tokens
     * @param x X coordinate
     * @param y Y coordinate
     * @param state State to stake for
     * @param amount Amount of TRUST tokens to stake
     */
    function setPixel(uint32 x, uint32 y, bytes32 state, uint256 amount) external nonReentrant {
        // Bounds check
        require(x < width && y < height, "Coordinates out of bounds");
        require(amount > 0, "Amount must be greater than 0");
        require(isValidState(state), "Invalid state");
        
        // Transfer TRUST tokens from user to contract
        require(trustToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        Pixel storage pixel = grid[x][y];
        bytes32 oldState = pixel.current;
        
        // Increment stake for the specified state
        pixel.states[state].stake += amount;
        
        // Recompute winner: state with highest stake (tie-breaker: keep current)
        bytes32 newWinner = _computeWinnerState(x, y);
        
        // Update pixel state
        pixel.current = newWinner;
        pixel.lastUpdate = uint64(block.timestamp);
        
        emit PixelChanged(x, y, oldState, newWinner, state, amount, msg.sender);
    }
    
    /**
     * @dev Get current pixel state and stake
     * @param x X coordinate
     * @param y Y coordinate
     * @return current Current winning state
     * @return currentStake Stake of current winning state
     */
    function getPixel(uint32 x, uint32 y) external view returns (bytes32 current, uint256 currentStake) {
        require(x < width && y < height, "Coordinates out of bounds");
        
        Pixel storage pixel = grid[x][y];
        current = pixel.current;
        currentStake = pixel.states[current].stake;
    }
    
    /**
     * @dev Get top k states for a pixel by stake
     * @param x X coordinate
     * @param y Y coordinate
     * @param k Number of top states to return (max 14)
     * @return states Array of top states
     * @return stakes Array of corresponding stakes
     */
    function getTopStates(uint32 x, uint32 y, uint8 k) external view returns (bytes32[] memory states, uint256[] memory stakes) {
        require(x < width && y < height, "Coordinates out of bounds");
        require(k > 0 && k <= allowedStates.length, "Invalid k value");
        
        Pixel storage pixel = grid[x][y];
        
        // Create arrays for all states and stakes
        bytes32[] memory allStates = new bytes32[](allowedStates.length);
        uint256[] memory allStakes = new uint256[](allowedStates.length);
        
        // Populate arrays with state hashes and stakes
        for (uint256 i = 0; i < allowedStates.length; i++) {
            bytes32 stateHash = stateKey(allowedStates[i]);
            allStates[i] = stateHash;
            allStakes[i] = pixel.states[stateHash].stake;
        }
        
        // Simple bubble sort to get top k (gas-inefficient but simple for small arrays)
        for (uint256 i = 0; i < k; i++) {
            for (uint256 j = i + 1; j < allowedStates.length; j++) {
                if (allStakes[j] > allStakes[i]) {
                    // Swap stakes
                    (allStakes[i], allStakes[j]) = (allStakes[j], allStakes[i]);
                    // Swap states
                    (allStates[i], allStates[j]) = (allStates[j], allStates[i]);
                }
            }
        }
        
        // Return top k
        states = new bytes32[](k);
        stakes = new uint256[](k);
        for (uint256 i = 0; i < k; i++) {
            states[i] = allStates[i];
            stakes[i] = allStakes[i];
        }
    }
    
    /**
     * @dev Get state key (hash) from name
     * @param name State name
     * @return State hash
     */
    function stateKey(string memory name) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(name));
    }
    
    /**
     * @dev Get all allowed states
     * @return Array of allowed state names
     */
    function getAllowedStates() external view returns (string[] memory) {
        return allowedStates;
    }
    
    /**
     * @dev Check if a state hash is valid
     * @param state State hash to check
     * @return True if valid, false otherwise
     */
    function isValidState(bytes32 state) public view returns (bool) {
        for (uint256 i = 0; i < allowedStates.length; i++) {
            if (stateKey(allowedStates[i]) == state) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Compute winning state for a pixel based on stakes
     * @param x X coordinate
     * @param y Y coordinate
     * @return Winning state hash
     */
    function _computeWinnerState(uint32 x, uint32 y) private view returns (bytes32) {
        Pixel storage pixel = grid[x][y];
        
        bytes32 winner = pixel.current; // Current state as tie-breaker
        uint256 maxStake = pixel.states[winner].stake;
        
        // Check all allowed states for higher stakes
        for (uint256 i = 0; i < allowedStates.length; i++) {
            bytes32 stateHash = stateKey(allowedStates[i]);
            uint256 stake = pixel.states[stateHash].stake;
            
            if (stake > maxStake) {
                winner = stateHash;
                maxStake = stake;
            }
        }
        
        return winner;
    }
}
