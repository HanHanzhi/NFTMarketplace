pragma solidity ^0.8.10;

import "./MyHardhatToken.sol";
import "./NFTCollectible.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol"; 

contract NFTMarket is IERC721Receiver{
    string public name;
    uint256 public index = 0;

    constructor(string memory _name) {
        name = _name;
    }

    event NewAuction(
        uint256 index,
        address addressNFTCollection,
        address addressPaymentToken,
        uint256 nftId,
        address mintedBy,
        address currentBidOwner,
        uint256 currentBidPrice,
        uint256 bidCount
    );

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function isContract(address _addr) private view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }

    struct Auction {
        uint index;
        address addressNFTCollection; // Address of the ERC721 NFT Collection contract
        address addressPaymentToken; // Address of the ERC20 Payment Token contract
        uint256 nftId; // NFT Id
        address creator; // Creator of the Auction
        address payable currentBidOwner; // Address of the highest bider
        uint256 currentBidPrice; // Current highest bid for the auction
        uint256 bidCount;
        
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
            isContract(_addressNFTCollection),
            "Invalid NFT Collection contract address"
        );
        require(
            isContract(_addressPaymentToken),
            "Invalid Payment Token contract address"
        );
        require(
            nftCollection.ownerOf(_nftId) == msg.sender,
            "Caller is not the owner of the NFT"
        );
        require(nftCollection.transferNFTFrom(msg.sender, address(this), _nftId));
        address payable currentBidOwner = payable(address(0));
        // Create new Auction object
        Auction memory newAuction = Auction({
            index: index,
            addressNFTCollection: _addressNFTCollection,
            addressPaymentToken: _addressPaymentToken,
            nftId: _nftId,
            creator: msg.sender,
            currentBidOwner: currentBidOwner,
            currentBidPrice: _initialBid,
            bidCount: 0
            
        });
        allAuctions.push(newAuction);
        index++;
        emit NewAuction(
            index,
            _addressNFTCollection,
            _addressPaymentToken,
            _nftId,
            msg.sender,
            currentBidOwner,
            _initialBid,
            0
            
        );
        return index;
    }

    function getCurrentBidOwner(uint256 _auctionIndex)
        public
        view
        returns (address)
    {
        require(_auctionIndex < allAuctions.length, "Invalid auction index");
        return allAuctions[_auctionIndex].currentBidOwner;
    }
    function getCurrentBid(uint256 _auctionIndex)
        public
        view
        returns (uint256)
    {
        require(_auctionIndex < allAuctions.length, "Invalid auction index");
        return allAuctions[_auctionIndex].currentBidPrice;
    }

    function bid(uint256 _auctionIndex, uint256 _newBid)
        external
        returns (bool)
    {
        require(_auctionIndex < allAuctions.length, "Invalid auction index");
        Auction storage auction = allAuctions[_auctionIndex];

        // check if new bid price is higher than the current one
        require(
            _newBid > auction.currentBidPrice,
            "New bid price must be higher than the current bid"
        );

        // check if new bider is not the owner
        require(
            msg.sender != auction.creator,
            "Creator of the auction cannot place new bid"
        );

        
        MyHardhatToken paymentToken = MyHardhatToken(auction.addressPaymentToken);

       
        require(
            paymentToken.transferFrom(msg.sender, address(this), _newBid),
            "Tranfer of token failed"
        );

        
        
        if (auction.bidCount > 0) {
            paymentToken.transfer(
                auction.currentBidOwner,
                auction.currentBidPrice
            );
        }
        

        
        address payable newBidOwner = payable(msg.sender);
        auction.currentBidOwner = newBidOwner;
        auction.currentBidPrice = _newBid;
        auction.bidCount++;
        


        return true;
    }
    function claimNFT(uint256 _auctionIndex) external {
        
        Auction storage auction = allAuctions[_auctionIndex];

        
        require(
            auction.currentBidOwner == msg.sender,
            "NFT can be claimed only by the current bid owner"
        );

        
        NFTCollectible nftCollection = NFTCollectible(
            auction.addressNFTCollection
        );
        
        require(
            nftCollection.transferNFTFrom(
                address(this),
                auction.currentBidOwner,
                _auctionIndex
            )
        );

        MyHardhatToken paymentToken = MyHardhatToken(auction.addressPaymentToken);
        
        require(
            paymentToken.transfer(auction.creator, auction.currentBidPrice)
        );
    }



    
    
}