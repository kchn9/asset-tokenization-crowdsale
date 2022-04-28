// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Pausable is Ownable {

    event Start(address by, uint indexed when);
    event Stop(address by, uint indexed when);

    bool private _paused;

    modifier notPaused {
        require(_paused == false, "Pausable: Contract is paused.");
        _;
    }

    function isPaused() public view returns(bool) {
        return _paused;
    }

    function pause() public onlyOwner {
        require(_paused == false, "Pausable: Contract is paused already.");
        _paused = true;
        emit Stop(msg.sender, block.timestamp);
    }

    function unpause() public onlyOwner {
        require(_paused == true, "Pausable: Contract is unpaused already.");
        _paused = false;
        emit Start(msg.sender, block.timestamp);
    }

}