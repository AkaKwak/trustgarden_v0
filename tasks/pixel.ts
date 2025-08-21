import { task } from "hardhat/config";
import { stateKey, isValidState } from "../src/utils/states";

// Task to set a pixel state
task("set:pixel", "Set a pixel state by staking TRUST tokens")
    .addParam("contract", "PixelGarden contract address")
    .addParam("x", "X coordinate")
    .addParam("y", "Y coordinate") 
    .addParam("state", "State name (e.g., 'soil', 'flower:red')")
    .addParam("amount", "Amount of TRUST tokens to stake (in ether units)")
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre;
        const [signer] = await ethers.getSigners();
        
        // Validate parameters
        const x = parseInt(taskArgs.x);
        const y = parseInt(taskArgs.y);
        const stateName = taskArgs.state;
        const amount = ethers.parseEther(taskArgs.amount);
        
        if (!isValidState(stateName)) {
            throw new Error(`Invalid state name: ${stateName}`);
        }
        
        console.log(`Setting pixel (${x}, ${y}) to state '${stateName}' with ${taskArgs.amount} TRUST`);
        console.log(`Using account: ${signer.address}`);
        
        // Get contract instances
        const pixelGarden = await ethers.getContractAt("PixelGarden", taskArgs.contract);
        const trustTokenAddress = await pixelGarden.trustToken();
        const trustToken = await ethers.getContractAt("IERC20", trustTokenAddress);
        
        // Check allowance
        const allowance = await trustToken.allowance(signer.address, taskArgs.contract);
        if (allowance < amount) {
            console.log(`Insufficient allowance. Current: ${ethers.formatEther(allowance)}, Required: ${taskArgs.amount}`);
            console.log("Please approve the contract first:");
            console.log(`npx hardhat approve:trust --contract ${taskArgs.contract} --amount ${taskArgs.amount} --network INTUITION_TESTNET`);
            return;
        }
        
        // Set pixel
        const stateHash = stateKey(stateName);
        const tx = await pixelGarden.setPixel(x, y, stateHash, amount);
        console.log(`Transaction submitted: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt?.blockNumber}`);
        
        // Show result
        const [current, currentStake] = await pixelGarden.getPixel(x, y);
        console.log(`Pixel (${x}, ${y}) current state: ${current}`);
        console.log(`Current stake: ${ethers.formatEther(currentStake)} TRUST`);
    });

// Task to get pixel information
task("pixel:get", "Get pixel state and top stakes")
    .addParam("contract", "PixelGarden contract address")
    .addParam("x", "X coordinate")
    .addParam("y", "Y coordinate")
    .addOptionalParam("top", "Number of top states to show", "3")
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre;
        
        const x = parseInt(taskArgs.x);
        const y = parseInt(taskArgs.y);
        const topCount = Math.min(parseInt(taskArgs.top), 14);
        
        console.log(`Getting information for pixel (${x}, ${y})`);
        
        const pixelGarden = await ethers.getContractAt("PixelGarden", taskArgs.contract);
        
        // Get current state
        const [current, currentStake] = await pixelGarden.getPixel(x, y);
        console.log(`Current state: ${current}`);
        console.log(`Current stake: ${ethers.formatEther(currentStake)} TRUST`);
        
        // Get top states
        const [topStates, topStakes] = await pixelGarden.getTopStates(x, y, topCount);
        
        console.log(`\nTop ${topCount} states by stake:`);
        for (let i = 0; i < topStates.length; i++) {
            const stakeAmount = ethers.formatEther(topStakes[i]);
            if (topStakes[i] > 0) {
                console.log(`  ${i + 1}. ${topStates[i]}: ${stakeAmount} TRUST`);
            }
        }
        
        // Get allowed states for reference
        const allowedStates = await pixelGarden.getAllowedStates();
        console.log(`\nAllowed states: ${allowedStates.join(", ")}`);
    });

// Task to approve TRUST tokens
task("approve:trust", "Approve TRUST tokens for PixelGarden contract")
    .addParam("contract", "PixelGarden contract address")
    .addParam("amount", "Amount to approve (in ether units)")
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre;
        const [signer] = await ethers.getSigners();
        
        const amount = ethers.parseEther(taskArgs.amount);
        
        console.log(`Approving ${taskArgs.amount} TRUST tokens for contract ${taskArgs.contract}`);
        console.log(`Using account: ${signer.address}`);
        
        // Get contracts
        const pixelGarden = await ethers.getContractAt("PixelGarden", taskArgs.contract);
        const trustTokenAddress = await pixelGarden.trustToken();
        const trustToken = await ethers.getContractAt("IERC20", trustTokenAddress);
        
        // Check current balance
        const balance = await trustToken.balanceOf(signer.address);
        console.log(`Current TRUST balance: ${ethers.formatEther(balance)}`);
        
        if (balance < amount) {
            throw new Error(`Insufficient balance. Have: ${ethers.formatEther(balance)}, Need: ${taskArgs.amount}`);
        }
        
        // Approve
        const tx = await trustToken.approve(taskArgs.contract, amount);
        console.log(`Approval transaction submitted: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Approval confirmed in block ${receipt?.blockNumber}`);
        
        // Verify allowance
        const allowance = await trustToken.allowance(signer.address, taskArgs.contract);
        console.log(`New allowance: ${ethers.formatEther(allowance)} TRUST`);
    });

// Task to get contract info
task("pixel:info", "Get PixelGarden contract information")
    .addParam("contract", "PixelGarden contract address")
    .setAction(async (taskArgs, hre) => {
        const { ethers } = hre;
        
        console.log(`Getting information for PixelGarden at ${taskArgs.contract}`);
        
        const pixelGarden = await ethers.getContractAt("PixelGarden", taskArgs.contract);
        
        const width = await pixelGarden.width();
        const height = await pixelGarden.height();
        const trustTokenAddress = await pixelGarden.trustToken();
        const allowedStates = await pixelGarden.getAllowedStates();
        
        console.log(`\nContract Information:`);
        console.log(`Grid size: ${width} x ${height}`);
        console.log(`TRUST token: ${trustTokenAddress}`);
        console.log(`Allowed states (${allowedStates.length}):`);
        
        allowedStates.forEach((state: string, index: number) => {
            const hash = stateKey(state);
            console.log(`  ${index + 1}. "${state}" -> ${hash}`);
        });
    });
