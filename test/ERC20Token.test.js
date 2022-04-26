const { chai, BN, testHelpers } = require("./setup.js"); 
const { expectRevert } = testHelpers;
const { expect } = chai;

const ERC20Token = artifacts.require("./ERC20Token.sol");

/* VARIABLES SHARED WITH DEPLOYER USING .ENV */
const tokenName = process.env.NAME;
const tokenSymbol = process.env.SYMBOL;
const tokenTotalSupply = process.env.TOTAL_SUPPLY;

contract("ERC20Token", async function(accounts) {

    const [ tokenDeployer, recepient, ...rest ] = accounts;
    let preDeployedInstance;

    function getFreshInstance() {
        return ERC20Token.new(tokenName, tokenSymbol, tokenTotalSupply, { from: tokenDeployer});
    }

    before("prepare pre-deployed instance", async function() {
        preDeployedInstance = await ERC20Token.deployed();
    })

    it("should set max supply of token correctly", async function() {        
        const actualMaxSupply = await preDeployedInstance.maxSupply();

        return expect(actualMaxSupply).to.be.a.bignumber.that.equal(new BN(tokenTotalSupply));
    });

    it("should allow tokenDeployer to mint tokens", async function() {
        const expectedAmount = 1_000_000;
 
        await preDeployedInstance.mint(expectedAmount, recepient, { from: tokenDeployer });
        const actualAmount = await preDeployedInstance.balanceOf(recepient);

        return expect(actualAmount).to.be.a.bignumber.that.equal(new BN(1_000_000));
    });

    it("should reject mint() if supply would exceed max supply", async function() {
        const freshInstance = await getFreshInstance();
        await freshInstance.mint(tokenTotalSupply, recepient, { from: tokenDeployer });
        
        await expectRevert(
            freshInstance.mint(1, recepient, { from: tokenDeployer }),
            "ERC20Token: Amount exceeding max supply."
        )
    })

    it("should reject mint() from NOT owner address", async function() {
        await expectRevert(
            preDeployedInstance.mint(1, recepient, { from: recepient }),
            "Ownable: caller is not the owner."
        )
    })
})