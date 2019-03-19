# Smart-Contracts-Oracle-Server
An oracle (Node.js server) that listens for a weather event and triggers a function contained in a smart contract deployed to an Ethereum testnet. This oracle makes use of the [ethers.js](https://docs.ethers.io/ethers.js/html/index.html) library. No Truffle or even web3.js required.

**Instructions for use/testing the oracle:** Deploy an instance of `RainyDayContract-for-remix.sol`. As the filename indicates, Remix is the suggested way to do this, as it's the most straightforward. If you deploy the contract on a network other than Rinkeby, you'll need to change the corresponding parameter under the "NETWORK CONNECTION AND WALLET" section of `oracle.js`. Also, make sure your deployed contract has whitelisted an account that your oracle will sign with and whose private key that you know. You will whitelist your oracle's public address by plugging it in as the variable for: `address public oracleAddress`.

Once deployed, you will need to replace some values in `oracle.js`. Replace the values for `const abi` and `const deployedContractAddress` in the "RAINY DAY CONTRACT DETAILS" section of `oracle.js`. Also, set your environment variable with your API key from OpenWeatherMap and the private key of the oracle address that you had whitelisted in your deployed contract. If you want to have the oracle scan for rain in a city other than Missoula, replace the corresponding parameter in the "THE ORACLE WILL SEE YOU NOW" section of `oracle.js`.

If it's not currently raining in your chosen city, but you want to see the refund in action, change the following conditional from this:

    if (helper.getCurrentWeatherByCityName("Missoula") == "rain")

to this:

    if (helper.getCurrentWeatherByCityName("Missoula") !== "rain")

Then, in the terminal, run: `nodemon server.js`. Check your log. If succesful, then check your deployed contract details on Etherscan. You should see that the contract balance was refunded to the owner, with a small amount going to the oracle for the transaction (gas) cost.
