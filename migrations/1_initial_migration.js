// Import dotenv to get access to {process.env.*} variables which are shared with tests
// Default path for .env is "/erc-crowdsale/.env"
// See next migration for continuation ->
require("dotenv").config({ path: "../.env" }); 
const Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
