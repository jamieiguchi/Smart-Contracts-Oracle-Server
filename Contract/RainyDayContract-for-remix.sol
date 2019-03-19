/*
This "Rainy Day Contract" accepts deposits from anyone, but only the contract owner gets the refund. When the oracle detects rain in the designated city, it triggers the issueRefund() method to transfer the contract balance to the owner, minus a small amount that gets transferred to the weather oracle account for the cost of the gas required to make that transaction.

It is suggested that all of the comments in this file be deleted prior to deploying an instance of the contract, to save on transaction (gas) costs. See the README for further details.
*/



pragma solidity >=0.4.21 <0.6.0;

contract RainyDayContract {

    mapping (address => uint) private balances;
    address payable owner;
    address public oracleAddress = <YOUR PUBLIC ORACLE ADDRESS GOES HERE>;

    // Log event about deposit being mde by a client and its amount
    event LogDepositMade(address accountAddress, uint amount);

    // Constructor is "payable" so it can receive the initial funding of 1
    // Set owner to be the creator of this contract (i.e., the client)
    constructor() public payable {
        require(msg.value >= 1 ether, "1 or more ether initial funding required");
        owner = msg.sender;
    }

    // Deposit ether into RainyDayContract, requires method to be "payable"
    // Display balance of individual owner after the deposit is made
    function deposit() public payable returns (uint) {
        balances[msg.sender] += msg.value;
        emit LogDepositMade(msg.sender, msg.value);
        return balances[msg.sender];
    }

    // Shows balance of whichever account is requesting to see this info
    function balance() public view returns (uint) {
        return balances[msg.sender];
    }

    // Shows balance of the RainyDayFund contract
    function depositsBalance() public view returns (uint) {
        return address(this).balance;
    }

    /*
    This is our refund function that can be called ONLY from the oracle server's address (whitelisted address).

    The oracle is only going to call this function ONLY when it gets a weather API response on its server of "rain". By putting that logic on the server side rather than in this contract, we save on gas by avoiding potentially numerous non-refund-triggering transactions with this contract.

    Also of note is that this function transfers the entire contract balance to the contract owner, 0.000037700 ether. This represents the gas cost for the oracle's transaction with this contract (i.e., the cost to trigger issueRefund()). During testing, this gas cost was actually observed to be 0.000037657 ether, but we are rounding up a tad just to be safe.

    The 0.000037700 ether gets transferred to the oracle's address when it calls this function,so that the oracle can maintain a positive balance. In this way, our oracle also functions as a trust account of sorts.
    */
    function issueRefund() public payable {

        require(msg.sender == oracleAddress);

        uint refundToOracle = (0.000037700 ether);

        uint refundToOwner = (address(this).balance) - refundToOracle;

        oracleAddress.transfer(refundToOracle);

        owner.transfer(refundToOwner);

    }

}
