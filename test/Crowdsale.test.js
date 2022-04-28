const { chai, BN, testHelpers, crowdsaleMigrationVars, tokenMigrationVars } = require("./setup.js");
const { tokenDecimals } = tokenMigrationVars;
const { crowdsaleAllowance, crowdsaleDefaultRate } = crowdsaleMigrationVars;
const { expectRevert, expectEvent } = testHelpers;
const { expect } = chai;

const ERC20Token = artifacts.require("./ERC20Token.sol");
const KYCCheck = artifacts.require("./KYCCheck.sol");
const Crowdsale = artifacts.require("./Crowdsale.sol");

contract("Crowdsale", async function(accounts) {

    const [ tokenDeployer, recepient, validator, ...rest ] = accounts;
    let tokenInstance;
    let kycCheckInstace;
    let crowdsaleInstance;

    const defaultMsgValue = web3.utils.toWei(new BN(1));

    async function getFreshInstance() {
        return Crowdsale.new(tokenInstance.address, kycCheckInstace.address, tokenDeployer, crowdsaleDefaultRate, { from: tokenDeployer });
    }

    before("prepare pre-deployed instance", async function() {
        crowdsaleInstance = await Crowdsale.deployed();
        kycCheckInstace = await KYCCheck.deployed();
        tokenInstance = await ERC20Token.deployed();
    })

    it("should be allowed to sell tokens in behalf of token deployer", async function() {
        const expectedAllowance = crowdsaleAllowance;
        const actualAllowance = await tokenInstance.allowance(tokenDeployer, crowdsaleInstance.address);
        
        return expect(actualAllowance).to.be.a.bignumber.that.equal(expectedAllowance);
    })

    it("should reject to change recipient if caller is not deployer", async function() {
        await expectRevert(
            crowdsaleInstance.changeRecipient(rest[0], { from: rest[0] }),
            "Ownable: caller is not the owner"
        )
    })

    it("should change recipient", async function() {
        const instance = await getFreshInstance();
        const expectedRecipient = rest[1];

        await instance.changeRecipient(expectedRecipient, { from: tokenDeployer });

        const actualRecipient = await instance.recipient();

        return assert.strictEqual(actualRecipient, expectedRecipient);
    })

    it("should emit RecipientChanged() whenever recipient changes", async function() {
        const instance = await getFreshInstance();
        const expectedRecipient = rest[1];

        expectEvent(
            await instance.changeRecipient(expectedRecipient, { from: tokenDeployer }),
            "RecipientChanged",
            {
                newRecipient: expectedRecipient
            }
        )
    })

    it("should reject to change rate if caller is not deployer", async function() {
        const newRate = crowdsaleDefaultRate.mul(new BN(10).pow(new BN(10)));
        await expectRevert(
            crowdsaleInstance.changeRate(newRate, { from: rest[0] }),
            "Ownable: caller is not the owner"
        )
    })
    
    it("should change rate", async function() {
        const instance = await getFreshInstance();
        const expectedRate = crowdsaleDefaultRate.mul(new BN(10).pow(new BN(10)));

        await instance.changeRate(expectedRate, { from: tokenDeployer });

        const actualRate = await instance.rate();

        return expect(actualRate).to.be.a.bignumber.that.equal(expectedRate);
    })

    it("should emit RateChanged() whenever rate changes", async function() {
        const instance = await getFreshInstance();
        const expectedRate = crowdsaleDefaultRate.mul(new BN(10).pow(new BN(10)));

        expectEvent(
            await instance.changeRate(expectedRate, { from: tokenDeployer }),
            "RateChanged",
            {
                newRate: expectedRate
            }
        )
    })

    describe("KYC dependant features", async function() {

        it("should reject selling tokens to unvalidated address", async function() {
            await expectRevert(
                crowdsaleInstance.buyTokens({ from: rest[0], value: defaultMsgValue }),
                "Crowdsale: Caller KYC is not completed yet."
            )
        })

        it("should reject validation if caller is not validator", async function() {
            await expectRevert(
                kycCheckInstace.setKYCComleted(rest[0], { from: rest[0] }),
                "Ownable: caller is not the owner"
            )
        })

        it("should sell tokens to validated address", async function() {
            const expectedBalance = defaultMsgValue.mul(crowdsaleDefaultRate).div(new BN(10).pow(new BN(tokenDecimals)))
            await kycCheckInstace.setKYCComleted(rest[0], { from: validator }); // validate rest[0]
        
            await crowdsaleInstance.buyTokens({ from: rest[0], value: defaultMsgValue }); // buy tokens for 1Eth
    
            const actualBalance = await tokenInstance.balanceOf(rest[0]);
            return expect(actualBalance).to.be.a.bignumber.that.equal(expectedBalance);
        })

        it("should emit TokensPurchased() event after tokens are sold [if validated]", async function() {
            const expectedAmount = defaultMsgValue.mul(crowdsaleDefaultRate).div(new BN(10).pow(new BN(tokenDecimals)))

            expectEvent(
                await crowdsaleInstance.buyTokens({ from: rest[0], value: defaultMsgValue }),
                "TokensPurchased",
                {
                    amount: expectedAmount
                }
            )
        })
                
        it("should reject to sell tokens if has no allowance [if validated]", async function() {
            const instance = await getFreshInstance();
            await expectRevert(
                instance.buyTokens({ from: rest[0], value: 100 }),
                "Crowdsale: Amount exceeds left allowance."
            )
        })
    
        it("should reject to sell tokens if amount exceeds allowance [if validated]", async function() {
            await expectRevert(
                crowdsaleInstance.buyTokens({ from: rest[0], value: crowdsaleAllowance.add(new BN(1)) }),
                "Crowdsale: Amount exceeds left allowance."
            )
        })

        it("should mark address as unvalidated again", async function() {
            await kycCheckInstace.setKYCRevoked(rest[0], { from: validator }); // unvalidate rest[0]

            await expectRevert(
                crowdsaleInstance.buyTokens({ from: rest[0], value: defaultMsgValue }), // rest[0] tries to buy tokens
                "Crowdsale: Caller KYC is not completed yet."
            )
        })

    })

    describe("Pausable features", async function() {
    
        it("should reject to stop contract if caller is not crowdsale owner", async function() {
            await expectRevert(
                crowdsaleInstance.pause({ from: rest[0] }),
                "Ownable: caller is not the owner"
            )
        })
        
        it("should reject to start contract if caller is not crowdsale owner", async function() {
            await expectRevert(
                crowdsaleInstance.unpause({ from: rest[0] }),
                "Ownable: caller is not the owner"
            )
        })
    
        it("should emit Stop() event when crowdsale is paused", async function() {
            expectEvent(
                await crowdsaleInstance.pause({ from: tokenDeployer }),
                "Stop",
                {
                    by: tokenDeployer
                }
            )
        })
        
        it("should emit Start() event when crowdsale is unpaused", async function() {
            expectEvent(
                await crowdsaleInstance.unpause({ from: tokenDeployer }),
                "Start",
                {
                    by: tokenDeployer
                }
            )
        })
    
        it("should reject to sell tokens if crowdsale is paused", async function() {
            await crowdsaleInstance.pause({ from: tokenDeployer });
            await kycCheckInstace.setKYCComleted(rest[0], { from: validator}); // validate purchase
            await expectRevert(
                crowdsaleInstance.buyTokens({ from: rest[0], value: defaultMsgValue }),
                "Pausable: Contract is paused."
            )
        })
    
        it("should unpause contract", async function() {
            await crowdsaleInstance.unpause({ from: tokenDeployer });
            const isPaused = await crowdsaleInstance.isPaused();
    
            return expect(isPaused).to.be.false;
        })
    })
})