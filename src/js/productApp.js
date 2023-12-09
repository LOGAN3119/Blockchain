App = {

    web3Provider: null,
    contracts: {},
    address: "0x2F3b1F71DFAc65e670912e5D935c0c5D2CaB651c",
    url: 'http://127.0.0.1:7545',
    currentAccount: null,
    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
          } else {
            // If no injected web3 instance is detected, fallback to the TestRPC
            App.web3Provider = new Web3.providers.HttpProvider(App.url);
          }
          web3 = new Web3(App.web3Provider);
          ethereum.enable();
          return App.initContract();
        // if(window.web3) {
        //     App.web3Provider=window.web3.currentProvider;
        // } else {
        //     App.web3Provider=new Web3.proviers.HttpProvider('http://localhost:7545');
        // }

        // web3 = new Web3(App.web3Provider);
        // return App.initContract();
    },

    initContract: function() {

        $.getJSON('product1155.json',function(data){

            var productArtifact=data;
            App.contracts.product=TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
            App.currentAccount = web3.eth.coinbase;
        });

        return App.bindEvents();
    },

    bindEvents: function() {

        $(document).on('click','.btn-register',App.registerProduct);
    },

    registerProduct: function(event) {
        event.preventDefault();

        var productInstance;

        var manufacturerID = document.getElementById('manufacturerID').value;
        var productName = document.getElementById('productName').value;
        var productSN = document.getElementById('productSN').value;
        var productBrand = document.getElementById('productBrand').value;
        var productPrice = document.getElementById('productPrice').value;

        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            console.log(accounts);
            var account=accounts[0];
            // console.log(account);

            App.contracts.product.deployed().then(function(instance){
                productInstance=instance;
                return productInstance.addProduct(account, web3.fromAscii(manufacturerID),web3.fromAscii(productName), web3.fromAscii(productSN), web3.fromAscii(productBrand), productPrice, {from:account});
             }).then(function(result, err){
                console.log(result);
                if (result) {
                    console.log(result.receipt.status);
                    if (parseInt(result.receipt.status) == 1){
                      toastr.info("Your product is registed!", "", { "iconClass": 'toast-info notification0' });
                      document.getElementById('manufacturerID').value='';
                      document.getElementById('productName').value='';
                      document.getElementById('productSN').value='';
                      document.getElementById('productBrand').value='';
                      document.getElementById('productPrice').value='';
                    }
                    else
                      toastr["error"]("Error in registering product. Adding Reverted!");
                  } else {
                    toastr["error"]("Registering Failed!");
                  }
                
            }).catch(function(err){
                console.log(err.message);
            });
        });
    }



};

$(function() {

    $(window).load(function() {
        App.init();
    })
})

