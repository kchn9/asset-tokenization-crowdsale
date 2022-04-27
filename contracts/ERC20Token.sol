// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {

    uint256 immutable MAX_SUPPLY;
    constructor(string memory _name, string memory _symbol, uint _maxSupply) ERC20(_name, _symbol) {
        MAX_SUPPLY = _maxSupply;
    }

    function mint(uint256 _amount, address _to) public onlyOwner {
        require(totalSupply() + _amount<= MAX_SUPPLY, "ERC20Token: Amount exceeding max supply.");
        _mint(_to, _amount);
    }

    function maxSupply() public view returns(uint256) {
        return MAX_SUPPLY;
    }

}