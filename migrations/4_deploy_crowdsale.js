const Crowdsale = artifacts.require("./Crowdsale.sol");
const ERC20Token = artifacts.require("./ERC20Token.sol");
const KYCCheck = artifacts.require("./KYCCheck.sol");


module.exports = async function(deployer, _, accounts) {
  const [ tokenDeployer, recepient, validator, ...rest ] = accounts;
  deployer.then(async function() {
    try {
      const ERC20TokenInstance = await ERC20Token.deployed();
      const KYCCheckInstance = await KYCCheck.deployed();
      await deployer.deploy(Crowdsale, ERC20TokenInstance.address, KYCCheckInstance.address, recepient, process.env.DEFAULT_RATE, { from: tokenDeployer });
      const crowdsaleInstance = await Crowdsale.deployed();
      await ERC20TokenInstance.approve(crowdsaleInstance.address, process.env.APPROVED_TO_SELL, { from: tokenDeployer });
    } catch (error) {
      console.log(error);
    }
  })
};
