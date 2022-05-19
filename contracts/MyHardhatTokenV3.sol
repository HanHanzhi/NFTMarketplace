pragma solidity ^0.8.10;

import "./MyHardhatTokenV2.sol";

/// @author HY Lim 2022
contract MyHardhatTokenV3 is MyHardhatTokenV2 {
    

    function burn_supply (uint256 amount) public virtual onlyOwner  {
        require(balanceOf(msg.sender) >= amount,"Failed attempt to burn tokens where requested burn tokens is more than owned tokens");
        _burn(msg.sender,amount);
    }
}