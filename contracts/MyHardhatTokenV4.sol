pragma solidity ^0.8.10;

import "./MyHardhatTokenV3.sol";


contract MyHardhatTokenV4 is MyHardhatTokenV3 {
    
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
    _disableInitializers();
    }
    
}