/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.10",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_ALCHEMY_API_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_ALCHEMY_API_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    // API key for Etherscan
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
