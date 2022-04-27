const Crowdsale = artifacts.require("./Crowdsale.sol");
const ERC20Token = artifacts.require("./ERC20Token.sol");

module.exports = async function(deployer, _, accounts) {
    const [ tokenDeployer, recepient, ...rest ] = accounts;
    const ERC20TokenInstance = await ERC20Token.deployed(); // get ERC20 from previous migration
    deployer.then(async () => {
        try {
            await deployer.deploy(Crowdsale, ERC20Token, tokenDeployer, { from: tokenDeployer });
            await ERC20TokenInstance.approve(Crowdsale.address, process.env.APPROVED_TO_SELL, { from: tokenDeployer });
        } catch (error) {
            console.log(error);
        }
    });
};
