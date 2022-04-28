// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ERC20Token implementation
 * @notice Example of tokenization to ERC-20 eip standard - see https://eips.ethereum.org/EIPS/eip-20
 * @notice This one is mintable - owner of token may call mint() to create more assets.
 * @notice Token is divisble to 18 decimal places - what means 1 token is represeneted by 10^18 amount. 
 * @notice Minting is limited - during creation deployer indicates {_maxSupply} maximal supply of token.
 * @author kchn9
 */

contract ERC20Token is ERC20, Ownable {

    /// @dev Maximal minted token amount.
    uint256 immutable MAX_SUPPLY;

    /**
     * @dev Creates ERC20 token
     * @param _name Name of new token
     * @param _symbol Symbol of new token
     * @param _maxSupply Maximal supply of new token
     */
    constructor(string memory _name, string memory _symbol, uint _maxSupply) ERC20(_name, _symbol) {
        MAX_SUPPLY = _maxSupply;
    }

    /**
     * @dev Creates more tokens - limited by {MAX_SUPPLY}
     * @param _amount Amount of token to create - keep in mind that 1 token is represented by 10^18.
     * @param _to Tokens receiver address.
     */
    function mint(uint256 _amount, address _to) public onlyOwner {
        require(totalSupply() + _amount<= MAX_SUPPLY, "ERC20Token: Amount exceeding max supply.");
        _mint(_to, _amount);
    }

    function maxSupply() public view returns(uint256) {
        return MAX_SUPPLY;
    }

}