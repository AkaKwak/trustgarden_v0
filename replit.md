# Overview

TrustGarden PixelWar is a competitive pixel gardening dapp built on EVM-compatible blockchains. Users stake TRUST tokens to control pixel states on a shared 64x64 grid, where the highest-staked state wins control of each pixel. The system supports 14 predefined pixel states including garden elements like soil, seeds, flowers, trees, and environmental features like water and stone.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Smart Contract Architecture

**Core Contract Design**: The `PixelGarden` contract implements a competitive staking mechanism where users can influence pixel states by staking TRUST tokens. Each pixel maintains a mapping of states to stakes, with the highest-staked state becoming the current pixel state.

**State Management**: Pixel states are represented as bytes32 hashes derived from canonical string names (e.g., "soil", "flower:red"). This approach optimizes gas usage while maintaining human-readable state identification. The contract supports 14 predefined states covering garden progression from empty soil to mature trees.

**Staking Mechanism**: Users stake ERC20 TRUST tokens to influence pixel states. Stakes are cumulative per state per pixel, with the highest total stake determining the winning state. Tie-breaking favors the current state to maintain stability.

**Grid System**: Implements a configurable grid system (default 64x64) with bounds checking and coordinate validation. The grid size is set at deployment time and cannot be changed afterward.

## Development Infrastructure

**Build System**: Uses Hardhat with TypeScript for smart contract development, compilation, and deployment. The configuration includes optimization settings and comprehensive tooling for testing and interaction.

**Network Configuration**: Configured for INTUITION_TESTNET with environment-based RPC URL and private key management. The setup supports easy deployment to EVM-compatible testnets.

**Task Automation**: Custom Hardhat tasks provide CLI interfaces for pixel manipulation and contract interaction, simplifying testing and demonstration workflows.

## Token Integration

**TRUST Token**: Integrates with an external ERC20 TRUST token contract for staking. Includes a mock implementation for testing environments when no existing token address is provided.

**Approval System**: Implements standard ERC20 approval patterns for secure token transfers from users to the contract during staking operations.

## Event System

**State Change Tracking**: Comprehensive event emission tracks all pixel state changes including coordinates, old/new states, stake amounts, and actor addresses. This enables off-chain indexing and real-time UI updates.

**Gas Optimization**: Simple contract design prioritizes gas efficiency over complex features, making frequent pixel updates economically viable for users.

## Utility Layer

**State Management Utils**: TypeScript utilities provide consistent state key generation and validation between contract and client code. Ensures type safety and prevents invalid state submissions.

**Contract Interaction**: Helper functions abstract complex contract interactions into simple TypeScript APIs, improving developer experience for frontend integration.

# External Dependencies

## Blockchain Infrastructure
- **INTUITION_TESTNET**: EVM-compatible testnet for contract deployment and testing
- **TRUST Token**: External ERC20 token contract used for staking mechanism
- **Ethereum JSON-RPC**: Standard blockchain interaction protocol

## Development Tools
- **OpenZeppelin Contracts**: Provides secure, audited implementations of ERC20 interfaces and other standard contract patterns
- **Hardhat Framework**: Ethereum development environment for compilation, testing, and deployment
- **TypeScript**: Type-safe development with comprehensive type definitions for contract interactions

## Libraries and SDKs
- **Viem**: Low-level Ethereum library for type-safe contract interactions and blockchain communication
- **Ethers.js**: High-level Ethereum library integrated through Hardhat toolbox for contract deployment and interaction
- **dotenv**: Environment variable management for secure configuration of private keys and RPC endpoints