const { ethers, upgrades } = require("hardhat");

describe("MyToken", function () {
  it("deploys", async function () {
    const MyHardhatToken = await ethers.getContractFactory("MyHardhatToken");
    await upgrades.deployProxy(MyHardhatToken, { kind: "uups" });
  });
  it("Upgrades", async function () {
    const MyHardhatTokenV2 = await ethers.getContractFactory(
      "MyHardhatTokenV2"
    );
    await upgrades.deployProxy(MyHardhatTokenV2, { kind: "uups" });
  });
});
