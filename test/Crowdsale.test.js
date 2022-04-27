const { chai, BN, testHelpers, tokenMigrationVars } = require("./setup.js");
const { tokenAllowance } = tokenMigrationVars;
const { expectRevert } = testHelpers;
const { expect } = chai;

const ERC20Token = artifacts.require("./ERC20Token.sol");
const Crowdsale = artifacts.require("./Crowdsale.sol");

contract("Crowdsale", async function(accounts) {

    const [ tokenDeployer, recepient, ...rest ] = accounts;
    let tokenInstance;
    let crowdsaleInstance;

    before("prepare pre-deployed instance", async function() {
        crowdsaleInstance = await Crowdsale.deployed();
        tokenInstance = await ERC20Token.deployed();
    })

    it("should be allowed to sell tokens in behalf of token deployer", async function() {
        const expectedAllowance = tokenAllowance;
        const actualAllowance = await tokenInstance.allowance(tokenDeployer, crowdsaleInstance.address);
        
        expect(actualAllowance).to.be.a.bignumber.that.equal(expectedAllowance);
    })

})