const { TransactionDescription } = require("ethers/lib/utils");
const { ethers, run, network } = require("hardhat");

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );

    console.log("Deploying contract...");

    const SimpleStorage = await SimpleStorageFactory.deploy();
    await SimpleStorage.deployed();

    console.log(`Deployed contract to: ${SimpleStorage.address}`);

    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...");
        await SimpleStorage.deployTransaction.wait(6);
        await verify(SimpleStorage.address, []);
    }

    // Get the current value
    var currentValue = await SimpleStorage.retrieve();
    console.log(`Current value is: ${currentValue}`);

    // Set the current value
    var transactionResponse = await SimpleStorage.store(7);
    await transactionResponse.wait(1);
    var updatedValue = await SimpleStorage.retrieve();
    console.log(`Updated value is: ${updatedValue}`);
}

async function verify(_contractAddress, _args) {
    console.log("Verifying contract...");
    console.log("---------------------");

    try {
        await run("verify:verify", {
            address: _contractAddress,
            constructorArgsParams: _args,
        });

        console.log("-----------------------");
        console.log("Verification Completed!");
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("-----------------");
            console.log("Already Verified!");
        } else {
            console.log(`Error Occured: ${e.message}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
