// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor(string memory _name, string memory _symbol, uint _fixedSupply) ERC20(_name, _symbol) {
        _mint(msg.sender, _fixedSupply);
    }
}