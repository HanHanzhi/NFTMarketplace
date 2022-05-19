const { ethers, upgrades } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const weiAmount = (await deployer.getBalance()).toString();

  console.log("Account123 balance:", await ethers.utils.formatEther(weiAmount));

  // make sure to replace the "GoofyGoober" reference with your own ERC-20 name!
  const Token = await ethers.getContractFactory("MyHardhatToken");

  const token = await upgrades.deployProxy(Token, [], {
    initializer: "initialize",
  });

  await token.deployed();

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
