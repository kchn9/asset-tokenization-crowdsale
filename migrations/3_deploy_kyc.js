const KYCCheck = artifacts.require("./KYCCheck.sol");

// After succesfull ERC20Token deployment it deploys KYCCheck contract with {validator} account as owner
// See next migration for continuation ->
module.exports = function(deployer, _, accounts) {
  const [ tokenDeployer, recepient, validator, ...rest ] = accounts;
  deployer.deploy(KYCCheck, { from: validator });
};
