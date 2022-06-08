pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";


// This is the main building block for smart contracts.
contract MyHardhatToken is Initializable, ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable, BaseRelayRecipient{
	uint public val;
	uint256 public counter;
	event FlagCaptured(address previousHolder, address currentHolder);
address public currentHolder = address(0);
	function initialize() external initializer{
		__ERC20_init("MyHardhatToken", "MHT");
		__Ownable_init();
		__UUPSUpgradeable_init();
		_mint(msg.sender,123*10**18);
		
	}
	
	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() initializer {}

	
	function _authorizeUpgrade(address) internal override onlyOwner {}

	function increment() public {
        counter++;
        lastCaller = _msgSender();
        emit Increment(_msgSender(), counter);
    }

}

//0xE4C3Ce6302e7c542dB60bD2761B4c6Dff0C59730
