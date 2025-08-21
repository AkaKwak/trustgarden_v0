const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const deployerPrivateKey = process.env.PRIVATE_KEY;

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
  defaultNetwork: "intuition",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    intuition: {
      url: "https://testnet.rpc.intuition.systems",
      accounts: deployerPrivateKey && deployerPrivateKey !== "your_private_key_here" ? [deployerPrivateKey] : [],
      chainId: 13579,
      gasPrice: "auto",
      gas: "auto",
    },
    // Autres réseaux pour référence (seulement si clé privée disponible)
    ...(deployerPrivateKey && deployerPrivateKey !== "your_private_key_here" ? {
      sepolia: {
        url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
        accounts: [deployerPrivateKey],
      },
      celo: {
        url: "https://alfajores-forno.celo-testnet.org",
        accounts: [deployerPrivateKey],
      },
    } : {}),
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: {
      intuition: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "intuition",
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
