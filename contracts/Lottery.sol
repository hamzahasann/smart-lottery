pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable winner;
    bool public isComplete;
    bool public claimed;

    constructor() {
        manager = msg.sender;
        isComplete = false;
        claimed = false;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function status() public view returns (bool) {
        return isComplete;
    }
    function getManager() public view returns (address) {
        return manager;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function enter() public payable {
        require(msg.value >= 0.1 ether, "Not enough ETH");
        require(!isComplete, "Lottery already completed");
        players.push(payable(msg.sender));
    }

    function pickWinner() public onlyManager {
        require(players.length > 0, "No players");
        require(!isComplete, "Lottery already completed");
        winner = players[randomNumber() % players.length];
        isComplete = true;
    }

    function randomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players.length)));
    }

    function claimPrize() public {
        require(msg.sender == winner, "Not winner");
        require(isComplete, "Lottery not completed");
        winner.transfer(address(this).balance);
        claimed = true;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}