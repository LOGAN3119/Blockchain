// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ProductNFT is ERC721 {

    constructor() ERC721("ProdToken", "721PT") {}

    

    function mintNFT(address _to, uint256 tokenId) external {
        _mint(_to, tokenId);
    }

    function transferNFT(address operator,address _from, address _to, uint256 tokenId) external {
        //approve(operator, tokenId);
        _transfer(_from, _to, tokenId);

        
    }

    function balanceOfNFT(address user) public view returns (uint256) {
        return balanceOf(user);
    }



}
