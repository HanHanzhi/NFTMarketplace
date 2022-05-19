const { ethers, upgrades } = require("hardhat");

const PROXY = "0x6b036451489Aa501E61d4549a83aE75D69c97691";

async function main() {
  const MyHardhatTokenV3 = await ethers.getContractFactory("MyHardhatTokenV3");
  console.log("Upgrading Token...");
  await upgrades.upgradeProxy(PROXY, MyHardhatTokenV3);
  console.log("Token upgraded");
}

main();
