// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This is the main building block for smart contracts.
contract MyHardhatToken is ERC20{
	
	constructor() ERC20("MyHardhatToken","MHT"){
		_mint(msg.sender,12300*10**18);
	}

//0x91fDa5C332AF6Fb15692aD74a655bB4A25536985
}
