# Smart-Contracts-Oracle-Server
**Summary:** This is a smart contracts oracle (in the form of an express.js server) that listens for a weather event and triggers a function contained in a smart contract deployed to an Ethereum testnet. This oracle makes use of the [ethers.js](https://docs.ethers.io/ethers.js/html/index.html) library. No Truffle/TruffleSuite or even web3.js is required. This repo contains the oracle functionality that the author has contributed to a larger project, AmberContracts, which you can find [here](https://github.com/KristinJoy/contracts_amber).

**Instructions for use/testing the oracle:** Deploy an instance of `RainyDayContract-for-remix.sol`. As the filename indicates, [Remix](https://remix.ethereum.org) is the suggested and most straightforward way to do this. If you deploy the contract on a network other than Rinkeby, you'll need to go into `oracle.js` and change the corresponding parameter under the "NETWORK CONNECTION AND WALLET" section. Also, make sure that you've whitelisted an account that your oracle will use to sign its transactions -- this means that you'll need the corresponding private key. You will whitelist your oracle's public address by plugging it in as the variable for: `address public oracleAddress` and keep the private key private by plugging it into the environment variable.

Once deployed, you will need to replace some values in `oracle.js`. Replace the values for `const abi` and `const deployedContractAddress` in the "RAINY DAY CONTRACT DETAILS" section of `oracle.js`. Also, set your environment variable with your API key from OpenWeatherMap and, as mentioned above, the private key of the oracle address that you had whitelisted in your deployed contract. If you want to have the oracle scan for rain in a city other than Missoula, replace the corresponding parameter in the "THE ORACLE WILL SEE YOU NOW" section.

If it's not currently raining in your chosen city, but you want to see the refund in action, change the following conditional from this:

    if (helper.getCurrentWeatherByCityName("Missoula") == "rain")

to this:

    if (helper.getCurrentWeatherByCityName("Missoula") !== "rain")

Then, in the terminal, run: `nodemon server.js`. Check your log. If succesful, then check your deployed contract details on Etherscan. You should see that the contract balance was refunded to the owner, with a small amount going to the oracle for the transaction (gas) cost.
