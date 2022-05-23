const chai = require("chai");
const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("MyToken", function () {
  let Token;
  let TokenV2;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("MyHardhatToken");
    TokenV2 = await ethers.getContractFactory("MyHardhatToken");
    hardhatToken = await upgrades.deployProxy(Token, { kind: "uups" });
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transaction", function () {
    it("Should transfer tokens between accounts", async function () {
      await hardhatToken.transfer(addr1.address, 50);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    });
  });

  describe("Upgrade", function () {
    it("Upgrade TokenV2 contract to the proxy", async function () {
      await upgrades.deployProxy(TokenV2, { kind: "uups" });
    });
  });
});
