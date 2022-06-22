const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace contract", () => {
  beforeEach(async () => {
    // Deploy Marketplace contract
    MarketplaceContract = await ethers.getContractFactory("NFTMarket");
    Marketplace = await MarketplaceContract.deploy("My NFT Marketplace");
    [ownerMarketPlace, USER1, USER2, _] = await ethers.getSigners();
  });

  describe("Transactions - Place new Bid on auction", () => {
    beforeEach(async () => {
      // Deploy NFTCollectible contract
      NFTCollectibleContract = await ethers.getContractFactory(
        "NFTCollectible"
      );
      NFTCollectible = await NFTCollectibleContract.deploy(
        "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/"
      );

      PaymentTokenContract = await ethers.getContractFactory("MyHardhatToken");

      PaymentToken = await upgrades.deployProxy(PaymentTokenContract, [], {
        initializer: "initialize",
      });
      await PaymentToken.deployed();

      // Mint new NFT
      await NFTCollectible.mintNFTs(3);

      // Approve NFT transfer by the marketplace(addr,nftid)
      await NFTCollectible.approve(Marketplace.address, 0);

      // Create new auction

      await Marketplace.createAuction(
        NFTCollectible.address,
        PaymentToken.address,
        0,
        50
      );
    });

    describe("Place new Bid on an auction - Failure", () => {
      it("Should reject new Bid because the auction index is invalid", async () => {
        await expect(
          Marketplace.connect(USER1).bid(4545, 100)
        ).to.be.revertedWith("Invalid auction index");
      });

      it("Should reject new Bid because the new bid amount is invalid", async () => {
        await expect(Marketplace.connect(USER1).bid(0, 25)).to.be.revertedWith(
          "New bid price must be higher than the current bid"
        );
      });

      it("Should reject new Bid because caller is the creator of the auction", async () => {
        await expect(Marketplace.bid(0, 60)).to.be.revertedWith(
          "Creator of the auction cannot place new bid"
        );
      });

      it("Should reject new Bid because new bider has not enought balances", async () => {
        await PaymentToken.connect(USER1).approve(Marketplace.address, 10000);

        await expect(Marketplace.connect(USER1).bid(0, 60)).to.be.reverted;
      });
    });

    describe("Place new Bid on an auction - Success", () => {
      beforeEach(async () => {
        // Allow marketplace contract to transfer token of USER1
        await PaymentToken.connect(USER1).approve(Marketplace.address, 10000);
        // credit USER1 balance with tokens
        await PaymentToken.transfer(USER1.address, 10000);
        // Place new bid with USER1
        await Marketplace.connect(USER1).bid(0, 500);
      });

      it("Token balance of new bider must be debited with the bid amount", async () => {
        let USER1Bal = await PaymentToken.balanceOf(USER1.address);
        expect(USER1Bal).to.equal(9500);
      });

      it("Token balance of Marketplace contract must be updated with new bid amount", async () => {
        let marketplaceBal = await PaymentToken.balanceOf(Marketplace.address);
        expect(marketplaceBal).to.equal(500);
      });

      it("Auction info are correctly updated", async () => {
        let currentBidOwner = await Marketplace.getCurrentBidOwner(0);
        expect(currentBidOwner).to.equal(USER1.address);
        let currentBid = await Marketplace.getCurrentBid(0);
        expect(currentBid).to.equal(500);
      });

      it("Current bid owner must be refunded after a new successful bid is placed", async () => {
        // Allow marketplace contract to tranfer token of USER2
        await PaymentToken.connect(USER2).approve(Marketplace.address, 20000);
        // Credit USER2 balance with some tokens
        await PaymentToken.transfer(USER2.address, 20000);
        // Place new bid with USER2
        await Marketplace.connect(USER2).bid(0, 1000);

        let USER1Bal = await PaymentToken.balanceOf(USER1.address);
        expect(USER1Bal).to.equal(10000);

        let USER2Bal = await PaymentToken.balanceOf(USER2.address);
        expect(USER2Bal).to.equal(19000);

        let marketplaceBal = await PaymentToken.balanceOf(Marketplace.address);
        expect(marketplaceBal).to.equal(1000);

        let currentBidOwner = await Marketplace.getCurrentBidOwner(0);
        expect(currentBidOwner).to.equal(USER2.address);
        let currentBid = await Marketplace.getCurrentBid(0);
        expect(currentBid).to.equal(1000);
      });
    });
  });
  describe("Transactions - Claim NFT", () => {
    beforeEach(async () => {
      // Deploy NFTCollectible contract
      NFTCollectibleContract = await ethers.getContractFactory(
        "NFTCollectible"
      );
      NFTCollectible = await NFTCollectibleContract.deploy(
        "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/"
      );
      [ownerNFTCollectible, _, _, _] = await ethers.getSigners();

      // Deploy payment token contract
      PaymentTokenContract = await ethers.getContractFactory("MyHardhatToken");

      PaymentToken = await upgrades.deployProxy(PaymentTokenContract, [], {
        initializer: "initialize",
      });
      await PaymentToken.deployed();

      [ownerPaymentToken, _, _, _] = await ethers.getSigners();
    });

    describe("Claim NFT - Failure", () => {
      it("Should reject because caller is not the current bid owner", async () => {
        await claimFunctionSetUp(
          Marketplace,
          NFTCollectible,
          PaymentToken,
          USER1,
          USER2
        );

        await expect(Marketplace.connect(USER1).claimNFT(0)).to.be.revertedWith(
          "NFT can be claimed only by the current bid owner"
        );
      });
    });

    describe("Claim NFT - Success", () => {
      it("Winner of the auction must be the new owner of the NFT", async () => {
        await claimFunctionSetUp(
          Marketplace,
          NFTCollectible,
          PaymentToken,
          USER1,
          USER2
        );

        await Marketplace.connect(USER2).claimNFT(0);

        let newOwnerNFT = await NFTCollectible.ownerOf(0);
        expect(newOwnerNFT).to.equal(USER2.address);
      });

      it("Creator of the auction must have his token balance credited with the highest bid amount", async () => {
        await claimFunctionSetUp(
          Marketplace,
          NFTCollectible,
          PaymentToken,
          USER1,
          USER2
        );

        await Marketplace.connect(USER2).claimNFT(0);

        let auctionCreatorBal = await PaymentToken.balanceOf(USER1.address);
        expect(auctionCreatorBal).to.equal(500);

        let marketPlaceBal = await PaymentToken.balanceOf(Marketplace.address);
        expect(marketPlaceBal).to.equal(0);
      });

      it("Winner of the auction should not be able to claim NFT more than one time", async () => {
        await claimFunctionSetUp(
          Marketplace,
          NFTCollectible,
          PaymentToken,
          USER1,
          USER2
        );

        await Marketplace.connect(USER2).claimNFT(0);
        await expect(Marketplace.connect(USER2).claimNFT(0)).to.be.revertedWith(
          "ERC721: transfer caller is not owner nor approved"
        );
      });
    });
  });
});

async function claimFunctionSetUp(
  Marketplace,
  NFTCollection,
  PaymentToken,
  auctionCreator,
  bider
) {
  //mint new NFT
  await NFTCollection.connect(auctionCreator).mintNFTs(1);
  // approve NFT transfer by MarketPlace contract
  await NFTCollection.connect(auctionCreator).approve(Marketplace.address, 0);
  // create auction

  await Marketplace.connect(auctionCreator).createAuction(
    NFTCollection.address,
    PaymentToken.address,
    0,
    50
  );
  if (bider) {
    // allow marketplace contract to get token
    await PaymentToken.connect(bider).approve(Marketplace.address, 10000);
    // credit USER2 balance with tokens
    await PaymentToken.transfer(bider.address, 20000);
    // place new bid
    await Marketplace.connect(bider).bid(0, 500);
  }
}
