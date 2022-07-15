# NFT Marketplace (ERC20 PAYMENT)
## install dependency
```
npm i
```

## compile
```
npx hardhat compile
```

## testing
```
npx hardhat test
```

## deployment
### first add your own env file and choose your network (goerli for me)
```
npx hardhat run scripts/deploy.js --network goerli
npx hardhat run scripts/deployNFT.js --network goerli
npx hardhat run scripts/deployNftMarket.js --network goerli
```
### then try it out on etherscan
