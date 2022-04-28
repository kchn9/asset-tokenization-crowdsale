// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Know-your-customer validation contract.
 * @notice Simple implementation of pre-validation contract, it allows any validation provider - owner of this 
 * @notice contract to check customers on their side then tag them as completed or revoked.
 * @author kchn9
 */
contract KYCCheck is Ownable {
    
    /// @dev Private mapping of pre-validated addresses of customers.
    /// @notice Returns true value for address that validation is completed, false for revoked.
    mapping( address => bool ) private _allowed;

    /// @dev Getter for indicated {_who} customer validation state.
    function isAllowed(address _who) public view returns (bool) {
        return _allowed[_who];
    }

    /// @dev Tag indicated address {_who} as completed.
    function setKYCComleted(address _who) public onlyOwner {
        _allowed[_who] = true;
    }

    /// @dev Tag indicated address {_who} as revoked.
    function setKYCRevoked(address _who) public onlyOwner {
        _allowed[_who] = false;
    }

}