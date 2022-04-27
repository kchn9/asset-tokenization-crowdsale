const ERC20Token = artifacts.require("./ERC20Token.sol");

module.exports = function(deployer, _, accounts) {
  const [ tokenDeployer, recepient, ...rest ] = accounts;
  deployer.deploy(ERC20Token, process.env.NAME, process.env.SYMBOL, process.env.TOTAL_SUPPLY, { from: tokenDeployer });
};
