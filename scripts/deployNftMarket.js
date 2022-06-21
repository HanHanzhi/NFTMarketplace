const { utils } = require("ethers");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Marketplace = await ethers.getContractFactory("NFTMarket");
  const marketplace = await Marketplace.deploy("NFTMarketPlace");

  console.log("Marketplace address:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
