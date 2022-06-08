const { ethers, upgrades } = require("hardhat");

const PROXY = "0x0Cb700556497ac8479C15B8b27DB3B73C32Ac45b";

async function main() {
  const MyHardhatTokenV2 = await ethers.getContractFactory("MyHardhatTokenV2");
  console.log("Upgrading Token to V2...");
  await upgrades.upgradeProxy(PROXY, MyHardhatTokenV2);
  console.log("Token upgraded");
}

main();
