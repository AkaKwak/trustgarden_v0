import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "./tasks/pixel";

dotenv.config();

const config: HardhatUserConfig = {
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
      url: process.env.RPC_URL || "https://api.intuition-testnet.gelato.digital",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here" 
        ? [process.env.PRIVATE_KEY] 
        : ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      chainId: 88, // Default chain ID, adjust as needed
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
