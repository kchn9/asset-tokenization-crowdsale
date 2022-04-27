//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdsale is Ownable {

    ERC20 immutable token;
    address payable immutable seller;

    constructor(ERC20 _token, address payable _seller) {
        token = _token;
        seller = _seller;
    }
}