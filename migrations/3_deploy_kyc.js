const KYCCheck = artifacts.require("./KYCCheck.sol");

module.exports = function(deployer, _, accounts) {
  const [ tokenDeployer, recepient, validator, ...rest ] = accounts;
  deployer.deploy(KYCCheck, { from: validator });
};
