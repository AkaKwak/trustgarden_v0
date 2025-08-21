// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Signal Garden
 * @dev A token-curated knowledge grid where users stake TTRUST tokens to create signals, atoms, and triples
 * Aligned with Intuition's vision of token-curated knowledge
 */
contract PixelGarden is ReentrancyGuard, Ownable {
    // Grid dimensions
    uint32 public immutable width;
    uint32 public immutable height;
    
    // TTRUST token contract
    IERC20 public immutable trustToken;
    
    // Pixel types aligned with Intuition concepts
    enum PixelType {
        EMPTY,    // 0 - Blanc - Pixel vide
        SIGNAL,   // 1 - Rouge - Assertion simple
        ATOM,     // 2 - Jaune - Donnée structurée
        TRIPLE    // 3 - Vert - Relation complexe
    }
    
    // Pixel information
    struct Pixel {
        uint256 signalStake;  // Stake pour Signal (rouge)
        uint256 atomStake;    // Stake pour Atom (jaune)
        uint256 tripleStake;  // Stake pour Triple (vert)
        uint256 totalStake;   // Total des stakes
        PixelType dominantType; // Type dominant
        uint64 lastUpdate;    // Dernière mise à jour
    }
    
    // Grid storage: x => y => Pixel
    mapping(uint32 => mapping(uint32 => Pixel)) private grid;
    
    // Events
    event PixelStaked(
        uint32 indexed x,
        uint32 indexed y,
        PixelType indexed pixelType,
        uint256 amount,
        address actor
    );
    
    event SignalCreated(uint32 indexed x, uint32 indexed y, uint256 amount, address indexed actor);
    event AtomCreated(uint32 indexed x, uint32 indexed y, uint256 amount, address indexed actor);
    event TripleCreated(uint32 indexed x, uint32 indexed y, uint256 amount, address indexed actor);
    
    /**
     * @dev Constructor
     * @param _width Grid width (64)
     * @param _height Grid height (64)
     * @param _trustToken TTRUST token contract address
     */
    constructor(uint32 _width, uint32 _height, address _trustToken) Ownable(msg.sender) {
        require(_width > 0 && _height > 0, "Invalid grid dimensions");
        require(_trustToken != address(0), "Invalid trust token address");
        
        width = _width;
        height = _height;
        trustToken = IERC20(_trustToken);
    }
    
    /**
     * @dev Set pixel type by staking TTRUST tokens
     * @param x X coordinate
     * @param y Y coordinate
     * @param pixelType Type de pixel (SIGNAL, ATOM, TRIPLE)
     * @param amount Amount of TTRUST tokens to stake
     */
    function setPixel(uint32 x, uint32 y, uint8 pixelType, uint256 amount) external nonReentrant {
        // Bounds check
        require(x < width && y < height, "Coordinates out of bounds");
        require(amount > 0, "Amount must be greater than 0");
        require(pixelType > 0 && pixelType <= 3, "Invalid pixel type");
        
        // Transfer TTRUST tokens from user to contract
        require(trustToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        Pixel storage pixel = grid[x][y];
        PixelType newPixelType = PixelType(pixelType);
        
        // Update stakes based on pixel type
        if (newPixelType == PixelType.SIGNAL) {
            pixel.signalStake += amount;
            emit SignalCreated(x, y, amount, msg.sender);
        } else if (newPixelType == PixelType.ATOM) {
            pixel.atomStake += amount;
            emit AtomCreated(x, y, amount, msg.sender);
        } else if (newPixelType == PixelType.TRIPLE) {
            pixel.tripleStake += amount;
            emit TripleCreated(x, y, amount, msg.sender);
        }
        
        // Update total stake
        pixel.totalStake = pixel.signalStake + pixel.atomStake + pixel.tripleStake;
        
        // Calculate dominant type
        pixel.dominantType = _calculateDominantType(pixel.signalStake, pixel.atomStake, pixel.tripleStake);
        
        // Update timestamp
        pixel.lastUpdate = uint64(block.timestamp);
        
        emit PixelStaked(x, y, newPixelType, amount, msg.sender);
    }
    
    /**
     * @dev Get pixel data
     * @param x X coordinate
     * @param y Y coordinate
     * @return pixelType Current dominant pixel type
     * @return signalStake Signal stake amount
     * @return atomStake Atom stake amount
     * @return tripleStake Triple stake amount
     * @return totalStake Total stake amount
     * @return lastUpdate Last update timestamp
     */
    function getPixel(uint32 x, uint32 y) external view returns (
        uint8 pixelType,
        uint256 signalStake,
        uint256 atomStake,
        uint256 tripleStake,
        uint256 totalStake,
        uint64 lastUpdate
    ) {
        require(x < width && y < height, "Coordinates out of bounds");
        
        Pixel storage pixel = grid[x][y];
        return (
            uint8(pixel.dominantType),
            pixel.signalStake,
            pixel.atomStake,
            pixel.tripleStake,
            pixel.totalStake,
            pixel.lastUpdate
        );
    }
    
    /**
     * @dev Get grid statistics
     * @return totalPixels Total number of pixels
     * @return signalPixels Number of signal pixels
     * @return atomPixels Number of atom pixels
     * @return triplePixels Number of triple pixels
     * @return totalStaked Total amount staked across all pixels
     * @return signalStaked Total signal stakes
     * @return atomStaked Total atom stakes
     * @return tripleStaked Total triple stakes
     */
    function getGridStats() external view returns (
        uint256 totalPixels,
        uint256 signalPixels,
        uint256 atomPixels,
        uint256 triplePixels,
        uint256 totalStaked,
        uint256 signalStaked,
        uint256 atomStaked,
        uint256 tripleStaked
    ) {
        totalPixels = uint256(width) * uint256(height);
        
        for (uint32 x = 0; x < width; x++) {
            for (uint32 y = 0; y < height; y++) {
                Pixel storage pixel = grid[x][y];
                
                if (pixel.dominantType == PixelType.SIGNAL) {
                    signalPixels++;
                } else if (pixel.dominantType == PixelType.ATOM) {
                    atomPixels++;
                } else if (pixel.dominantType == PixelType.TRIPLE) {
                    triplePixels++;
                }
                
                signalStaked += pixel.signalStake;
                atomStaked += pixel.atomStake;
                tripleStaked += pixel.tripleStake;
                totalStaked += pixel.totalStake;
            }
        }
    }
    
    /**
     * @dev Calculate dominant pixel type based on stakes
     * @param signalStake Signal stake amount
     * @param atomStake Atom stake amount
     * @param tripleStake Triple stake amount
     * @return Dominant pixel type
     */
    function _calculateDominantType(
        uint256 signalStake,
        uint256 atomStake,
        uint256 tripleStake
    ) private pure returns (PixelType) {
        if (signalStake > atomStake && signalStake > tripleStake) {
            return PixelType.SIGNAL;
        } else if (atomStake > signalStake && atomStake > tripleStake) {
            return PixelType.ATOM;
        } else if (tripleStake > signalStake && tripleStake > atomStake) {
            return PixelType.TRIPLE;
        } else if (signalStake == atomStake && signalStake > tripleStake) {
            return PixelType.SIGNAL; // Tie-breaker: Signal > Atom
        } else if (signalStake == tripleStake && signalStake > atomStake) {
            return PixelType.SIGNAL; // Tie-breaker: Signal > Triple
        } else if (atomStake == tripleStake && atomStake > signalStake) {
            return PixelType.ATOM; // Tie-breaker: Atom > Triple
        } else {
            return PixelType.EMPTY; // All equal or zero
        }
    }
    
    /**
     * @dev Emergency function to withdraw stuck tokens (owner only)
     * @param token Token address to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
