const Product20 = artifacts.require("Product20");
const ProductNFT = artifacts.require("ProductNFT");
const product1155 = artifacts.require("product1155");

module.exports = async function (deployer) {
  // Deploy ChainFundToken1
  await deployer.deploy(Product20);
  const cftTokenInstance = await Product20.deployed();

  await deployer.deploy(ProductNFT);
  const nFTInstance = await ProductNFT.deployed();



  await deployer.deploy(product1155, cftTokenInstance.address, nFTInstance.address,0,100000,[]);
};


// var erc20Prod=artifacts.require('Product20');
// var erc721Prod=artifacts.require('ProductNFT');
// var erc1155prod=artifacts.require('product1155');

// module.exports=function(deployer) {
   

//   deployer.deploy(erc20Prod);
//   deployer.deploy(erc721Prod);

//   deployer.deploy(erc1155prod, erc20Prod.address, erc721Prod.address,0,100000,[])
//         .then(async () => {
//             const erc1155Instance = await erc1155prod.deployed();
//             await erc1155Instance.setERC20Address(erc20Prod.address);
//             await erc1155Instance.setERC721Address(erc721Prod.address);
//         });
    
// };

