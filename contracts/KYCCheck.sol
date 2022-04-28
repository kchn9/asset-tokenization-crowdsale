// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
contract KYCCheck is Ownable {
    
    mapping( address => bool ) private _allowed;

    function isAllowed(address _who) public view returns (bool) {
        return _allowed[_who];
    }

    function setKYCComleted(address _who) public onlyOwner {
        _allowed[_who] = true;
    }

    function setKYCRevoked(address _who) public onlyOwner {
        _allowed[_who] = false;
    }

}