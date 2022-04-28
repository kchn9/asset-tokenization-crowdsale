// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Pausable.sol";
import "./KYCCheck.sol";

/**
 * @title ERC20 Crowdsale
 * @notice Contract implements mechanism of selling tokens to audience. Crowdsale owner sets ERC20 token he want to sell,
 * @notice KYCContract to validate customer before selling, and recipient - he is receiving all ETH earned by this contract
 * @notice and rate - represented as token amount customer may buy for 1ETH. (i.e: rate 10^18 means user can buy 1 token for 1ETH).
 * @notice Owner [inherited from Pausable] may change rate and recipient - every change emits suitable Event keeping audience informed.
 * @notice Owner is allowed to start / stop crowdsale - implemented by pause() / unpause() functions. He is allowed also to delete crowdsale.
 */
contract Crowdsale is Pausable {

    /// @dev Emitted whenever customer {who} succesfully buys {amount} of tokens.
    event TokensPurchased(address who, uint amount);

    /// @dev Keep track of {rate} and {recipient} changes.
    event RecipientChanged(uint when, address newRecipient);
    event RateChanged(uint when, uint128 newRate);

    /// @dev Store pointers to required contracts.
    ERC20 immutable private _ERC20token;
    KYCCheck immutable private _KYCCheck;
    
    /// @dev Store contract recipient - he directly receives earned ETH.
    address payable public recipient;

    /// @dev Amount of tokens for 1ETH. Limited to {2^128 - 1} to prevent balance overflows.
    uint128 public rate;

    /**
     * @dev Creates new Crowdsale.
     * @param _token Address pointer to ERC20 deployer want to sell.
     * @param _KYCContract Address pointer to know-your-customer prevalidate contract.
     * @param _recipient Payable address of crowdsale recipient.
     * @param _rate Crowdsale rate - amount of tokens for 1ETH.
     */
    constructor(ERC20 _token, KYCCheck _KYCContract,  address payable _recipient, uint128 _rate) Pausable() {
        require(_token.balanceOf(owner()) > 0, "Crowdsale: Deployer has no tokens to sell.");
        require(_recipient != address(0), "Crowdsale: Receipient cannot be address 0.");
        _ERC20token = _token;
        _KYCCheck = KYCCheck(_KYCContract);
        recipient = _recipient;
        rate = _rate;
    }

    /// @dev Changes {recipient} to given {_newRecipient}. Allowed only for contract owner.
    /// @dev Emits {RecipientChanged} event.
    function changeRecipient(address payable _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Crowdsale: Receipient cannot be address 0.");
        recipient = _newRecipient;
        emit RecipientChanged(block.timestamp, _newRecipient);
    }

    /// @dev Changes {rate} to given {_newRate}. Allowed only for contract owner.
    /// @dev Emits {RateChanged} event.
    function changeRate(uint128 _newRate) external onlyOwner {
        rate = _newRate;
        emit RateChanged(block.timestamp, _newRate);
    }

    /// @dev Allows pre-validated [by KYCCheck contract] customer to buy amount {tokenAmount} of tokens.
    /// @dev Crowdsale must be APPROVED by token owner and owner must have enough tokens.
    /// @dev Emits {TokensPurchased} event.
    function buyTokens() external payable notPaused {
        // pre-validation
        require(_KYCCheck.isAllowed(msg.sender), "Crowdsale: Caller KYC is not completed yet.");

        // calculate amount of tokens to sell then validates this amount
        uint tokenAmount = (msg.value * rate) / 10 ** _ERC20token.decimals();
        require(tokenAmount != 0, "Crowdsale: Token amount cannot be 0.");
        require(getLeftAllowance() >= tokenAmount, "Crowdsale: Amount exceeds left allowance.");

        // transfer tokens and ETH
        _ERC20token.transferFrom(owner(), msg.sender, tokenAmount);
        (bool success, /* data */) = recipient.call{ value: msg.value }("");
        require(success, "Crowdsale: ETH transfer failed.");
        
        emit TokensPurchased(msg.sender, tokenAmount);
    }

    /// @dev Deletes crowdsale - as fallback sends any received ETH to {recipient}. Allowed only for contract owner.
    function deleteCrowdsale() external onlyOwner {
        selfdestruct(recipient);
    }

    /// @dev Getter for contract left allowance of given {_ERC20token}.
    function getLeftAllowance() public view returns(uint) {
        return _ERC20token.allowance(owner(), address(this));
    }
}