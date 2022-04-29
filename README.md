
# ERC-20 Pausable Crowdsale w/ KYC pre-validation

![](https://github.com/Developer-DAO/ukraine-donation-nft/actions/workflows/continuous-integration.yaml/badge.svg)

This project is implements:
- mintable ERC-20 token *(limited by total supply)*, 
- Know-Your-Customer pre-validation contract,
- Pausable mechanism,

All used to create pausable Crowdsale contract - that deliver method to distribute tokens.

As mentioned above, Crowdsale is Pausable - contract deployer may control sale by stopping it and resuming.

Contract is fully covered by unit-tests.

## Disclaimer

Keep in mind, that the ERC-20 token is represented by 18 decimal places *(default)* which means
that **1 Token is actually represented by the amount 10 ^ 18**.


## Features  

- Crowdsale safely distributes tokens to audience by buyToken() payable function

- Mintable ERC-20 token allows token deployer to **gradually** control circulating supply

- Crowdsale is fully configurable, rate *(amount of tokens for 1 ETH)* and ETH receiver may be changed during crowdsale - audience is informed by events

- Crowdsale is pausable - owner may pause/unpause distribution - what emits suitable (Start/Stop events)

- KYC contract implements required pre-validation process (customers have to be validated by validator - **KYC deployer** before they are allowed to buy tokens)

- Owner is also allowed to delete the crowdsale


## Created with (dependencies)

- Truffle v5.5.11 (core: 5.5.11)
- Ganache v^7.0.4
- Solidity - ^0.8.0 (solc-js)
- Node v16.14.2
- Web3.js v1.5.3
- dotenv ^16.0.0
- @openzeppelin/contracts ^4.5.0
- @openzeppelin/test-helpers ^0.5.15


## Installation

Clone the erc20-crowdsale

```bash
  git clone https://github.com/kchn9/erc20-crowdsale.git
```

Go to the project directory

```bash
  cd erc20-crowdsale
```

Install dependencies

```bash
  npm install
```


## Running Tests

#### Disclaimer

To run tests properly .env configuration file is required.
You may want to use default .env delivered in this repo.  
**(here [.env-example](.env-example))**

To run tests, run the following command

```bash
  truffle test
```


## Authors

- [@khcn9](https://www.github.com/kchn9)


## License

[MIT](https://choosealicense.com/licenses/mit/)

