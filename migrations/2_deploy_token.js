const ERC20Token = artifacts.require("./ERC20Token.sol");

module.exports = function(deployer, _, accounts) {
  const [ tokenDeployer, recepient, validator, ...rest ] = accounts;
  deployer.then(async function() {
    try {
      await deployer.deploy(ERC20Token, process.env.NAME, process.env.SYMBOL, process.env.TOTAL_SUPPLY, { from: tokenDeployer });
      const instance = await ERC20Token.deployed();
      await instance.mint(process.env.MINTED_AMOUNT, tokenDeployer, { from: tokenDeployer });
    } catch (error) {
      console.log(error);
    }
  })
};
