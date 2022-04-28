// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Pausable.sol";
import "./KYCCheck.sol";

contract Crowdsale is Pausable {

    event TokensPurchased(address who, uint amount);

    ERC20 immutable private _ERC20token;
    KYCCheck immutable private _KYCCheck;
    
    address payable immutable public recipient;
    uint public immutable rate; // tokens for 1 eth

    constructor(ERC20 _token, KYCCheck _KYCContract,  address payable _recipient, uint _rate) Pausable() {
        require(_token.balanceOf(owner()) > 0, "Crowdsale: Deployer has no tokens to sell.");
        require(_recipient != address(0), "Crowdsale: Receipient cannot be address 0.");
        _ERC20token = _token;
        _KYCCheck = KYCCheck(_KYCContract);
        recipient = _recipient;
        rate = _rate;
    }

    function buyTokens() public payable notPaused {
        require(_KYCCheck.isAllowed(msg.sender), "Crowdsale: Caller KYC is not completed yet.");

        uint tokenAmount = (msg.value * rate) / 10 ** _ERC20token.decimals();
        require(tokenAmount != 0, "Crowdsale: Token amount cannot be 0.");
        require(getLeftAllowance() >= tokenAmount, "Crowdsale: Amount exceeds left allowance.");

        _ERC20token.transferFrom(owner(), msg.sender, tokenAmount);
        (bool success, /* data */) = recipient.call{ value: msg.value }("");
        require(success, "Crowdsale: ETH transfer failed.");
        
        emit TokensPurchased(msg.sender, tokenAmount);
    }

    function getLeftAllowance() public view returns(uint) {
        return _ERC20token.allowance(owner(), address(this));
    }
}