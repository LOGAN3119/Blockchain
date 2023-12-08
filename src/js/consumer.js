App = {

    web3Provider: null,
    contracts: {},
    address: "0x849EAAE44a671A8c5B80FCdc3a0F84c0A7ea12a9",
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

        $(document).on('click','.btn-erc20balance',App.getERC20Balance);
        $(document).on('click','.btn-erc721balance',App.getERC721Balance);
    },


    getERC20Balance:function(event) {
        event.preventDefault();
        var productInstance;
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];
            App.contracts.product.deployed().then(function(instance){

                productInstance=instance;
                return productInstance.batchbalance(account, 0,{from:account});

            }).then(function(result){
                console.log(result);

                document.getElementById('displayERC20Balance').innerHTML='';
                document.getElementById('displayERC20Balance').innerHTML=result.c[0];
           }).catch(function(err){
               console.log(err.message);
           })
        })
    },

    getERC721Balance:function(event) {
        event.preventDefault();
        var productInstance;
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];
            App.contracts.product.deployed().then(function(instance){

                productInstance=instance;
                return productInstance.batchbalance(account,1, {from:account});

            }).then(function(result){
                console.log(result);

                document.getElementById('displayERC721Balance').innerHTML='';
                document.getElementById('displayERC721Balance').innerHTML=result.c[0];

           }).catch(function(err){
               console.log(err.message);
           })
        })
    },


    registerProduct: function(event) {
        event.preventDefault();

        var productInstance;
        var consumerName = document.getElementById('consumerName').value;
        var consumerCode = document.getElementById('consumerCode').value;
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
                return productInstance.registerConsumer(web3.fromAscii(consumerName),web3.fromAscii(consumerCode),{from:account});
             }).then(function(result, err){
                console.log(result);
                if (result) {
                    console.log(result.receipt.status);
                  } else {
                    toastr["error"]("Registering Consumer Failed!");
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

