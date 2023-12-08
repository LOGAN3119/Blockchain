
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./Product20.sol";
import "./ProductNFT.sol";
contract product1155 is ERC1155{


    Product20 public productContract;
    ProductNFT public productNFTContract;
    address public owner;

    uint256 sellerCount =0;
    uint256 productCount;

    uint256 consumerCount=0;

    uint256 public constant CFTID = 0;
    uint256 public constant NFTID = 1;

    struct seller{
        uint256 sellerId;
        bytes32 sellerName;
        bytes32 sellerBrand;
        bytes32 sellerCode;
        uint256 sellerNum;
        bytes32 sellerManager;
        bytes32 sellerAddress;
    }
    //mapping(uint=>seller) public sellers;
    mapping(address=>seller) public sellers;
    address[] public sellerAddresses;

    address public erc20Contract;
    address public erc721Contract;
    struct productItem{
        uint256 productId;
        bytes32 productSN;
        bytes32 productName;
        bytes32 productBrand;
        uint256 productPrice;
        bytes32 productStatus;
    }
    struct Consumer {
        uint256 consumerId; // Unique identifier for consumers
        bytes32 consumerCode; // Code for the consumer
        string consumerName;
    }
    //mapping(uint => Consumer) public consumers; // Mapping of consumers
    mapping(address => Consumer) public consumers; // Mapping of consumers
    address[] public consumerAddresses;

    mapping(uint256=>productItem) public productItems;
    mapping(bytes32=>uint256) public productMap;
    mapping(bytes32=>bytes32) public productsManufactured;
    mapping(bytes32=>bytes32) public productsForSale;
    mapping(bytes32=>bytes32) public productsSold;
    mapping(bytes32=>bytes32[]) public productsWithSeller;
    mapping(bytes32=>bytes32[]) public productsWithConsumer;
    mapping(bytes32=>bytes32[]) public sellersWithManufacturer;

    uint256 private nextTokenId = 0;
    event Qrgenerated(address indexed recipient, uint256 tokenId);


    constructor(address _productContractAddress, address _productNFTContractAddress,uint256 id, uint256 amount, bytes memory data) ERC1155("id, amount, data") {
        
        owner = msg.sender;
        productContract = Product20(_productContractAddress);
        productNFTContract = ProductNFT(_productNFTContractAddress);
    }


        function registerConsumer(bytes32 _consumerCode, string memory _consumerName) public {
            Consumer memory newConsumer = Consumer({
                consumerId: consumerCount,
                consumerCode: _consumerCode,
                consumerName: _consumerName
            });
        
            consumers[msg.sender] = newConsumer;
            consumerCount++;
            consumerAddresses.push(msg.sender);
            productContract.mintCFT(msg.sender); 
        }
        
                   
             
    

    function addSeller(bytes32 _manufacturerId, bytes32 _sellerName, bytes32 _sellerBrand, bytes32 _sellerCode,
    uint256 _sellerNum, bytes32 _sellerManager, bytes32 _sellerAddress) public{
        sellers[msg.sender] = seller({
            sellerId: sellerCount,
            sellerName: _sellerName,
            sellerBrand: _sellerBrand,
            sellerCode: _sellerCode,
            sellerNum: _sellerNum,
            sellerManager: _sellerManager,
            sellerAddress: _sellerAddress
        });
        sellerCount++;
        sellerAddresses.push(msg.sender);
        sellersWithManufacturer[_manufacturerId].push(_sellerCode);
    }

    // function setERC20Address(address _erc20Contract) external {
    //     require(erc20Contract == address(0), "ERC20 address already set");
    //     erc20Contract = _erc20Contract;
    // }

    // function setERC721Address(address _erc721Contract) external {
    //     require(erc721Contract == address(0), "ERC721 address already set");
    //     erc721Contract = _erc721Contract;
    // }

    // function viewSellers () public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
    //     uint256[] memory ids = new uint256[](sellerCount);
    //     bytes32[] memory snames = new bytes32[](sellerCount);
    //     bytes32[] memory sbrands = new bytes32[](sellerCount);
    //     bytes32[] memory scodes = new bytes32[](sellerCount);
    //     uint256[] memory snums = new uint256[](sellerCount);
    //     bytes32[] memory smanagers = new bytes32[](sellerCount);
    //     bytes32[] memory saddress = new bytes32[](sellerCount);
        
    //     for(uint i=0; i<sellerCount; i++){
    //         ids[i] = sellers[i].sellerId;
    //         snames[i] = sellers[i].sellerName;
    //         sbrands[i] = sellers[i].sellerBrand;
    //         scodes[i] = sellers[i].sellerCode;
    //         snums[i] = sellers[i].sellerNum;
    //         smanagers[i] = sellers[i].sellerManager;
    //         saddress[i] = sellers[i].sellerAddress;
    //     }
    //     return(ids, snames, sbrands, scodes, snums, smanagers, saddress);
    // }

    //PRODUCT SECTION

    function addProduct(
        address _to,
        bytes32 _manufactuerID,
        bytes32  _productName,
        bytes32  _productSN,
        bytes32  _productBrand,
        uint256 _productPrice
    ) external returns (uint256){
        
        uint256 tokenId = nextTokenId++;
        productNFTContract.mintNFT(_to, tokenId);    
        emit Qrgenerated(_to, tokenId);
         productItems[tokenId] = productItem(tokenId, _productSN, _productName, _productBrand,
        _productPrice, "Available");
        productMap[_productSN] = tokenId;
        productsManufactured[_productSN] = _manufactuerID;
        return tokenId;
    }

    // function viewProductItems() external view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory) {
    //     uint256[] memory pids = new uint256[](productCount);
    //     bytes32[] memory pSNs = new bytes32[](productCount);
    //     bytes32[] memory pnames = new bytes32[](productCount);
    //     bytes32[] memory pbrands = new bytes32[](productCount);
    //     uint256[] memory pprices = new uint256[](productCount);
    //     bytes32[] memory pstatus = new bytes32[](productCount);
        
    //     for(uint i=0; i<productCount; i++){
    //         pids[i] = productItems[i].productId;
    //         pSNs[i] = productItems[i].productSN;
    //         pnames[i] = productItems[i].productName;
    //         pbrands[i] = productItems[i].productBrand;
    //         pprices[i] = productItems[i].productPrice;
    //         pstatus[i] = productItems[i].productStatus;
    //     }
    //     return(pids, pSNs, pnames, pbrands, pprices, pstatus);
    // }

    //SELL Product

    function manufacturerSellProduct(bytes32 _productSN, bytes32 _sellerCode) public{
        productsWithSeller[_sellerCode].push(_productSN);
        productsForSale[_productSN] = _sellerCode;

    }

    function sellerSellProduct(bytes32 _productSN, bytes32 _consumerCode, address operator) public{   
        bytes32 pStatus;
        uint256 i;
        uint256 j=0;

        if(productCount>0) {
            for(i=0;i<productCount;i++) {
                if(productItems[i].productSN == _productSN) {
                    j=i;
                }
            }
        }

        pStatus = productItems[j].productStatus;
        if(pStatus == "Available") {
            productItems[j].productStatus = "NA";
           for(uint i=0;i<consumerAddresses.length;i++){
            productContract.transferCFT(consumerAddresses[i],msg.sender, 999 * 10 ** 18);
            
            }
            productNFTContract.transferNFT(operator,msg.sender,consumerAddresses[0],0);




            productsWithConsumer[_consumerCode].push(_productSN);
            productsSold[_productSN] = _consumerCode;
        }


    }


    function queryProductsList(bytes32 _sellerCode) public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory){
        bytes32[] memory productSNs = productsWithSeller[_sellerCode];
        uint256 k=0;

        uint256[] memory pids = new uint256[](productCount);
        bytes32[] memory pSNs = new bytes32[](productCount);
        bytes32[] memory pnames = new bytes32[](productCount);
        bytes32[] memory pbrands = new bytes32[](productCount);
        uint256[] memory pprices = new uint256[](productCount);
        bytes32[] memory pstatus = new bytes32[](productCount);

        
        for(uint i=0; i<productCount; i++){
            for(uint j=0; j<productSNs.length; j++){
                if(productItems[i].productSN==productSNs[j]){
                    pids[k] = productItems[i].productId;
                    pSNs[k] = productItems[i].productSN;
                    pnames[k] = productItems[i].productName;
                    pbrands[k] = productItems[i].productBrand;
                    pprices[k] = productItems[i].productPrice;
                    pstatus[k] = productItems[i].productStatus;
                    k++;
                }
            }
        }
        return(pids, pSNs, pnames, pbrands, pprices, pstatus);
    }

    function querySellersList (bytes32 _manufacturerCode) public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
        bytes32[] memory sellerCodes = sellersWithManufacturer[_manufacturerCode];
        uint256 totalSellers = sellerAddresses.length;

        uint256[] memory ids = new uint256[](totalSellers);
        bytes32[] memory snames = new bytes32[](totalSellers);
        bytes32[] memory sbrands = new bytes32[](totalSellers);
        bytes32[] memory scodes = new bytes32[](totalSellers);
        uint256[] memory snums = new uint256[](totalSellers);
        bytes32[] memory smanagers = new bytes32[](totalSellers);
        bytes32[] memory saddress = new bytes32[](totalSellers);

        for (uint256 i = 0; i < totalSellers; i++) {
            address sellerAddress = sellerAddresses[i];
            seller storage currentSeller = sellers[sellerAddress];
            ids[i] = currentSeller.sellerId;
            snames[i] = currentSeller.sellerName;
            sbrands[i] = currentSeller.sellerBrand;
            scodes[i] = currentSeller.sellerCode;
            snums[i] = currentSeller.sellerNum;
            smanagers[i] = currentSeller.sellerManager;
            saddress[i] = currentSeller.sellerAddress;
        }

        return (ids, snames, sbrands, scodes, snums, smanagers, saddress);
    }

    function getPurchaseHistory(bytes32 _consumerCode) public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory){
        bytes32[] memory productSNs = productsWithConsumer[_consumerCode];
        bytes32[] memory sellerCodes = new bytes32[](productSNs.length);
        bytes32[] memory manufacturerCodes = new bytes32[](productSNs.length);
        for(uint i=0; i<productSNs.length; i++){
            sellerCodes[i] = productsForSale[productSNs[i]];
            manufacturerCodes[i] = productsManufactured[productSNs[i]];
        }
        return (productSNs, sellerCodes, manufacturerCodes);
    }

    //Verify

    function verifyProduct(bytes32 _productSN, bytes32 _consumerCode) public view returns(bool){
        
        // for(uint i=0;i<consumerAddresses.length;i++){
        //          productContract.transferCFT(consumerAddresses[i],msg.sender, 999 * 10 ** 18);
        //  }

        if(productsSold[_productSN] == _consumerCode){
            return true;
        }
        else{
            return false;
        }
    }

     function exchangeTokens(address accountWithERC20, uint256 erc20Amount, address accountWithERC721, uint256 erc721Id, bytes memory data) external {
        // Ensure the caller has the required ERC-20 and ERC-721 tokens
        require(balanceOf(accountWithERC20, 0) >= erc20Amount, "Insufficient ERC-20 balance");
        require(productNFTContract.ownerOf(erc721Id) == accountWithERC721, "Caller does not own ERC-721 token");

        // Transfer ERC-20 tokens from accountWithERC20 to accountWithERC721
        safeTransferFrom(accountWithERC20, accountWithERC721, 0, erc20Amount, data);

        // Transfer ERC-721 tokens from accountWithERC721 to accountWithERC20
        productNFTContract.safeTransferFrom(accountWithERC721, accountWithERC20, erc721Id, data);


        //productContract.transferCFT(msg.sender,)
    }


    // function check_balance() public view returns(uint256){
    //     return productContract.balanceOfUser(msg.sender);  
    // }

    function getERC20Balance() public view returns(uint256){
        return productContract.balanceOfUser(msg.sender);  
    }

    function getERC721Balance() public view returns(uint256){
        return productNFTContract.balanceOfNFT(msg.sender);  
    }


    function buyTokens() external {

        //uint256 cftAmount = 1000 * 10 ** 18;

        uint256[] memory ids = new uint256[](2);
        uint256[] memory amounts = new uint256[](2);
        ids[0] = CFTID;
        ids[1] = NFTID;
        amounts[0] = 1000;
        amounts[1] = 10;


        _mintBatch(msg.sender, ids, amounts, "");
        // _mint(msg.sender, CFTID, 100, "");
        // _mint(msg.sender, NFTID, 100, "");

    }

    function batchbalance(address user, uint tokenID) public view returns (uint256) {
        return balanceOf(user, tokenID);
    }
    
    function batchTransfer(address _to, uint256 amount) external {
        

        uint256[] memory ids = new uint256[](2);
        uint256[] memory amounts = new uint256[](2);

        ids[0] = CFTID; // ID for erc-20 TOKENS
        ids[1] = NFTID; // ID for ERC-721 tokens

        amounts[0] = amount;
        amounts[1] = 1; 

        // Perform the batch transfer
        safeBatchTransferFrom(msg.sender, _to, ids, amounts, "");
    }




}