const { ethers, upgrades } = require("hardhat");

async function main() {
  const MyHardhatTokenV2 = await ethers.getContractFactory("MyHardhatTokenV2");
  console.log("Upgrading Token...");
  await upgrades.upgradeProxy(
    "0x66a6A27A3e71BCFAa29fABD5e74fA89F2225B9fb",
    MyHardhatTokenV2
  );
  console.log("Token upgraded");
}

main();
