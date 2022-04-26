// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {

    uint immutable MAX_SUPPLY;
    constructor(string memory _name, string memory _symbol, uint _maxSupply) ERC20(_name, _symbol) {
        MAX_SUPPLY = _maxSupply;
    }
    
}