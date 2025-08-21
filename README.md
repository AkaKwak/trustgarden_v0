# TrustGarden PixelWar

A competitive pixel gardening dapp where users stake TRUST tokens to control pixel states on a shared grid.

## Overview

PixelGarden is an EVM-compatible smart contract that implements a competitive pixel grid system. Users can stake TRUST tokens to influence the state of individual pixels, with the highest-staked state becoming the current state for each pixel.

## Features

- **Configurable Grid**: Default 64x64 pixel grid (configurable at deployment)
- **Multiple States**: 14 predefined pixel states including empty, soil, seed, sprout, leaf, various flowers, shrub, tree, water, stone, and path
- **Token Staking**: Uses TRUST token (ERC20) for staking mechanism
- **Competition System**: Highest stake wins (current state as tie-breaker)
- **Gas Optimized**: Simple, efficient contract design
- **Event Tracking**: Comprehensive event emission for state changes

## Prerequisites

- Node.js 20+
- npm or yarn
- An EVM-compatible wallet with private key
- Access to INTUITION_TESTNET RPC

## Setup

1. **Install dependencies**:
```bash
npm install
