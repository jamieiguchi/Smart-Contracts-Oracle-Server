require("dotenv").config();
const ethers = require ("ethers");

// ------------------------------------------------------------------
//      NETWORK CONNECTION AND WALLET
// ------------------------------------------------------------------
let provider = ethers.getDefaultProvider('rinkeby');
let privateKey = process.env.ORACLE_PRIVATE_KEY;
let wallet = new ethers.Wallet(privateKey, provider);
let providerWallet = wallet.provider;
console.log(providerWallet);

// ------------------------------------------------------------------
//      WEATHER API DETAILS
// ------------------------------------------------------------------
const OpenWeatherMapHelper = require("../node_modules/openweathermap-node");
const helper = new OpenWeatherMapHelper({
  APPID: process.env.WEATHER_APP_ID,
  units: "imperial"
});

// ------------------------------------------------------------------
//      RAINY DAY CONTRACT DETAILS
// ------------------------------------------------------------------

const abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "deposit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "issueRefund",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "accountAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LogDepositMade",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "balance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "depositsBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

// TO DO: Need to turn this into a variable that takes in address from factory component:
const deployedContractAddress = <YOUR DEPLOYED CONTRACT ADDRESS GOES HERE>;

let contract = new ethers.Contract(deployedContractAddress, abi, wallet);

// ------------------------------------------------------------------
//      THE ORACLE WILL SEE YOU NOW
// ------------------------------------------------------------------

// Oracle process loop: If it's raining, create a transaction that triggers the deployed Rainy Day Contract's issueRefund() method, then terminate the whole loop. Else (if it's not raining), wait 10 seconds and restart.
const oracleProcess = setInterval(function rainCheck() {

  if (helper.getCurrentWeatherByCityName("Missoula") == "rain") {

    console.log(".......... It's raining! The oracle will attempt to make a transaction with the deployed contract right now.");

    contract.issueRefund().then((tx, err) => {
      console.log(".......... About to issue refund... ");
      if (tx) {
        console.log(".......... Success! Rainy day refund issued to owner. Transaction details: ", tx)
      }
      if (err) {
        console.log(".......... Whoops! Something isn't right. Details: ", err)
      }
    })

    .then(clearInterval(oracleProcess));

  }

  else {
    console.log(".......... It's not raining! The oracle will not trigger a contract refund at this time and will check the weather again in 10 seconds.");
  }

}, 10000);
