"use strict";
//CHAI
var chai = require("chai");
//BN
var BN = require("bn.js");
var chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);
//TEST-HELPERS
var testHelpers = require("@openzeppelin/test-helpers");

/* VARIABLES SHARED WITH DEPLOYER USING .ENV */
const tokenMigrationVars = {
    tokenName: process.env.NAME,
    tokenSymbol: process.env.SYMBOL,
    tokenTotalSupply: new BN(process.env.TOTAL_SUPPLY),
    tokenMintedAmount: new BN(process.env.MINTED_AMOUNT),
    tokenDecimals: new BN(process.env.DECIMALS)
}
const crowdsaleMigrationVars = {
    crowdsaleAllowance: new BN(process.env.APPROVED_TO_SELL),
    crowdsaleDefaultRate: new BN(process.env.DEFAULT_RATE)
}

module.exports = {
    chai,
    BN,
    tokenMigrationVars,
    crowdsaleMigrationVars,
    testHelpers
}