// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdsale is Ownable {

    event TokensPurchased(address who, uint amount);

    ERC20 immutable internal _ERC20token;
    address payable immutable public recipient;
    uint public immutable rate; // tokens for 1 eth

    constructor(ERC20 _token, address payable _recipient, uint _rate) {
        require(_token.balanceOf(owner()) > 0, "Crowdsale: Deployer has no tokens to sell.");
        require(_recipient != address(0), "Crowdsale: Receipient cannot be address 0.");
        _ERC20token = _token;
        recipient = _recipient;
        rate = _rate;
    }

    function buyTokens() public payable {
        uint tokenAmount = (msg.value * rate) / 10 ** _ERC20token.decimals();
        require(getLeftAllowance() >= tokenAmount, "Crowdsale: Amount exceeds left allowance.");
        (bool success, /* data */) = recipient.call{ value: msg.value }("");
        require(success, "Crowdsale: ETH transfer failed.");
        _ERC20token.transferFrom(owner(), msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, tokenAmount);
    }

    function getLeftAllowance() public view returns(uint) {
        return _ERC20token.allowance(owner(), address(this));
    }
}