/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "UTtJiBT_TnuDzEZyEW43oSikFpy_6_Tw";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY =
  "0543cd13d1b272a550ab23c0dfc7aa3d3643d3814b4e4fc5575395a6d16f8b41";

module.exports = {
  solidity: "0.8.10",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
    },
  },
};
