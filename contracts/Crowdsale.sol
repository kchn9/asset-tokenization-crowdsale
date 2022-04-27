// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdsale is Ownable {

    ERC20 immutable internal _ERC20token;
    address payable immutable public recipient;

    constructor(ERC20 _token, address payable _recipient) {
        require(_token.balanceOf(owner()) > 0, "Crowdsale: Deployer has no tokens to sell.");
        require(_recipient != address(0), "Crowdsale: Receipient cannot be address 0.");
        _ERC20token = _token;
        recipient = _recipient;
    }

    function buyTokens(uint _amount) external {
        require(_ERC20token.allowance(owner(), address(this)) > 0, "Crowdsale: Contract has no rights to sell tokens on owners behalf");
        require(getLeftAllowance() >= _amount, "Crowdsale: Amount exceeds left allowance.");
        _ERC20token.transferFrom(owner(), msg.sender, _amount);
    }

    function getLeftAllowance() public view returns(uint) {
        return _ERC20token.allowance(owner(), address(this));
    }
}