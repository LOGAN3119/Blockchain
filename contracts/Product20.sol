// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";




contract Product20 is ERC20{

    address public owner;

    constructor() ERC20("prodTok", "20T") {

        owner = msg.sender;
    }

    function mintCFT(address user) external {
        _mint(user, 1000000 * 10 ** 18);
        _mint(address(this), 1000000 * 10 ** 18); 
    }
    function transferCFT(address from , address to, uint256 cftAmount) public {
        _transfer(from, to, cftAmount);
    }

    // Check CFT balance of a user
    function balanceOfUser(address user) public view returns (uint256) {
        return balanceOf(user);
    }

}
