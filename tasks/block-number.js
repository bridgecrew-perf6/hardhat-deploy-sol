const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
    async (_taskArgs, _hre) => {
        const blockNumber = await _hre.ethers.provider.getBlockNumber();
        console.log(`Current block number: ${blockNumber}`);
    }
);
