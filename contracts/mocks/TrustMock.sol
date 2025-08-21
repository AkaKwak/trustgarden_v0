// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TrustMock
 * @dev Mock TRUST token for testing purposes
 */
contract TrustMock is ERC20 {
    constructor() ERC20("TRUST", "TRUST") {
        // Mint 1e24 tokens (1 million tokens with 18 decimals) to deployer
        _mint(msg.sender, 1e24);
    }
    
    /**
     * @dev Allow anyone to mint tokens for testing
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
