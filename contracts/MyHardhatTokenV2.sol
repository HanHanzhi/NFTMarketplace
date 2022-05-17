pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


// This is the main building block for smart contracts.
contract MyHardhatTokenV2 is ERC20Upgradeable,OwnableUpgradeable{
	uint public val;
	/*constructor() ERC20Upgradeable("MyHardhatToken","MHT"){
		_mint(msg.sender,12300*10**18);
	}*/
	function initialize() external {
		__ERC20_init("MyHardhatToken", "MHT");
	}
	


}