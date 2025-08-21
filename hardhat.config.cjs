const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    INTUITION_TESTNET: {
      url: process.env.RPC_URL || "https://testnet.rpc.intuition.systems",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here" 
        ? [process.env.PRIVATE_KEY] 
        : [],
      chainId: 13579,
      gasPrice: "auto",
      gas: "auto",
    },
    // Local development network
    hardhat: {
      chainId: 31337,
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: {
      INTUITION_TESTNET: process.env.ETHERSCAN_API_KEY || "",
    },
            customChains: [
          {
            network: "INTUITION_TESTNET",
            chainId: 13579,
            urls: {
              apiURL: "https://testnet.explorer.intuition.systems/api",
              browserURL: "https://testnet.explorer.intuition.systems/",
            },
          },
        ],
  },
};

module.exports = config;
