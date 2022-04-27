// import dotenv to get access to {process.env.*} variables
require("dotenv").config({ path: "../.env" }); 

const Migrations = artifacts.require("./Migrations.sol");
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
