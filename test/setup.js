"use strict";
//CHAI
var chai = require("chai");
//BN
var BN = require("bn.js");
var chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);
//TEST-HELPERS
var testHelpers = require("@openzeppelin/test-helpers");

module.exports = {
    chai,
    BN,
    testHelpers
}