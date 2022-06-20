pragma solidity ^0.8.2;

import "./MyHardhatToken.sol";
import "./NFTCollectible.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol"; //For debugging only

contract NFTMarket{
    struct Auction {
        
        address addressNFTCollection; // Address of the ERC721 NFT Collection contract
        address addressPaymentToken; // Address of the ERC20 Payment Token contract
        uint256 nftId; // NFT Id
        address creator; // Creator of the Auction
        address payable currentBidOwner; // Address of the highest bider
        uint256 currentBidPrice; // Current highest bid for the auction
        
    }
    Auction[] private allAuctions;
    
    function createAuction (
        address _addressNFTCollection,
        address _addressPaymentToken,
        uint256 _nftId,
        uint256 _initialBid

    ) external returns (uint256) {
        NFTCollectible nftCollection = NFTCollectible(_addressNFTCollection);
        require(
            nftCollection.ownerOf(_nftId) == msg.sender,
            "Caller is not the owner of the NFT"
        );
        address payable currentBidOwner = payable(address(0));
        // Create new Auction object
        Auction memory newAuction = Auction({
            
            addressNFTCollection: _addressNFTCollection,
            addressPaymentToken: _addressPaymentToken,
            nftId: _nftId,
            creator: msg.sender,
            currentBidOwner: currentBidOwner,
            currentBidPrice: _initialBid
            
        });
        allAuctions.push(newAuction);
        return 0;
    }
    
}