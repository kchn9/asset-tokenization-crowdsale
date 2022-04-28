// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Pausable
 * @notice Contract is implementation of mechanism that allow to start and stop child contract.
 * @notice Contract owner [inherited from OpenZeppelin Ownable.sol] is only allowed to pause() / unpause() contract.
 * @notice Modifier {notPaused} ensures function calls will be possible only if contract is not paused.
 * @author kchn9
 */
contract Pausable is Ownable {

    /// @dev Keeps track of contract {_paused} state changes.
    event Start(address by, uint indexed when);
    event Stop(address by, uint indexed when);

    /// @dev Statevar represents current paused/unpaused state.
    bool private _paused;

    /// @dev Ensures marked function will be called only if contract is paused.
    modifier notPaused {
        require(_paused == false, "Pausable: Contract is paused.");
        _;
    }

    /// @dev Getter for {_paused}.
    function isPaused() public view returns(bool) {
        return _paused;
    }

    /// @dev Pauses contract. Allowed only for owner.
    function pause() public onlyOwner {
        require(_paused == false, "Pausable: Contract is paused already.");
        _paused = true;
        emit Stop(msg.sender, block.timestamp);
    }

    /// @dev Unpauses contract. Allowed only for owner.
    function unpause() public onlyOwner {
        require(_paused == true, "Pausable: Contract is unpaused already.");
        _paused = false;
        emit Start(msg.sender, block.timestamp);
    }

}