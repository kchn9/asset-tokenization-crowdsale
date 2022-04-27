const { chai, BN, testHelpers, tokenMigrationVars } = require("./setup.js");
const { crowdsaleAllowance } = tokenMigrationVars;
const { expectRevert } = testHelpers;
const { expect } = chai;

const ERC20Token = artifacts.require("./ERC20Token.sol");
const Crowdsale = artifacts.require("./Crowdsale.sol");

contract("Crowdsale", async function(accounts) {

    const [ tokenDeployer, recepient, ...rest ] = accounts;
    let tokenInstance;
    let crowdsaleInstance;

    async function getFreshInstance() {
        return Crowdsale.new(tokenInstance.address, tokenDeployer, { from: tokenDeployer });
    }

    before("prepare pre-deployed instance", async function() {
        crowdsaleInstance = await Crowdsale.deployed();
        tokenInstance = await ERC20Token.deployed();
    })

    it("should be allowed to sell tokens in behalf of token deployer", async function() {
        const expectedAllowance = crowdsaleAllowance;
        const actualAllowance = await tokenInstance.allowance(tokenDeployer, crowdsaleInstance.address);
        
        return expect(actualAllowance).to.be.a.bignumber.that.equal(expectedAllowance);
    })

    it("should sell tokens to address", async function() {
        const expectedBalance = new BN(1_000_000);
        await crowdsaleInstance.buyTokens(expectedBalance, { from: recepient }); // buy tokens
        
        const actualBalance = await tokenInstance.balanceOf(recepient);
        return expect(actualBalance).to.be.a.bignumber.that.equal(expectedBalance);
    })

    it("should reject to sell tokens if has no allowance", async function() {
        const instance = await getFreshInstance();

        await expectRevert(
            instance.buyTokens(1, { from: recepient }),
            "Crowdsale: Contract has no rights to sell tokens on owners behalf"
        )
    })

    it("should reject to sell tokens if amount exceeds allowance", async function() {
        const exceedsAllowance =  crowdsaleAllowance.add( new BN(1) );

        await expectRevert(
            crowdsaleInstance.buyTokens(exceedsAllowance, { from: recepient }),
            "Crowdsale: Amount exceeds left allowance."
        )
    })
    

})