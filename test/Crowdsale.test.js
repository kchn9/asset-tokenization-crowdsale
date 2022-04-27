const { chai, BN, testHelpers, crowdsaleMigrationVars, tokenMigrationVars } = require("./setup.js");
const { tokenDecimals } = tokenMigrationVars;
const { crowdsaleAllowance, crowdsaleDefaultRate } = crowdsaleMigrationVars;
const { expectRevert } = testHelpers;
const { expect } = chai;

const ERC20Token = artifacts.require("./ERC20Token.sol");
const Crowdsale = artifacts.require("./Crowdsale.sol");

contract("Crowdsale", async function(accounts) {

    const [ tokenDeployer, recepient, ...rest ] = accounts;
    let tokenInstance;
    let crowdsaleInstance;

    async function getFreshInstance() {
        return Crowdsale.new(tokenInstance.address, tokenDeployer, crowdsaleDefaultRate, { from: tokenDeployer });
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
        const msgValue = web3.utils.toWei(new BN(1));
        const expectedBalance = msgValue.mul(crowdsaleDefaultRate).div(new BN(10).pow(new BN(tokenDecimals)))

        await crowdsaleInstance.buyTokens({ from: rest[0], value: msgValue }); // buy tokens for 1Eth

        const actualBalance = await tokenInstance.balanceOf(rest[0]);
        return expect(actualBalance).to.be.a.bignumber.that.equal(expectedBalance);
    })

    it("should reject to sell tokens if has no allowance", async function() {
        const instance = await getFreshInstance();

        await expectRevert(
            instance.buyTokens({ from: rest[0], value: 100 }),
            "Crowdsale: Amount exceeds left allowance."
        )
    })

    it("should reject to sell tokens if amount exceeds allowance", async function() {
        await expectRevert(
            crowdsaleInstance.buyTokens({ from: rest[0], value: crowdsaleAllowance.add(new BN(1)) }),
            "Crowdsale: Amount exceeds left allowance."
        )
    })
    

})