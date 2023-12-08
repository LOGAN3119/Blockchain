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
        });

        return App.bindEvents();
    },

    bindEvents: function() {

        $(document).on('click','.btn-erc20balance',App.getERC20Balance);
        $(document).on('click','.btn-erc721balance',App.getERC721Balance);
        $(document).on('click','.btn-register',App.getData);
    },

    getERC20Balance:function(event) {
        event.preventDefault();
        var productInstance;
        var ethperToken = 10000;
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];
            App.contracts.product.deployed().then(function(instance){

                productInstance=instance;
                return productInstance.getERC20Balance({from:account});

            }).then(function(result){
                console.log(result);

                document.getElementById('displayERC20Balance').innerHTML=result.c[0] / ethperToken;

                
                document.getElementById('add').innerHTML=account;
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
                return productInstance.getERC721Balance({from:account});

            }).then(function(result){
                console.log(result);

                document.getElementById('displayERC721Balance').innerHTML=result.c[0];

                
                document.getElementById('add').innerHTML=account;
           }).catch(function(err){
               console.log(err.message);
           })
        })
    },

    getData:function(event) {
        event.preventDefault();
        var productSN = document.getElementById('productSN').value;
        var consumerCode = document.getElementById('consumerCode').value;
        var productInstance;
        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];
            // console.log(account);
            App.contracts.product.deployed().then(function(instance){

                productInstance=instance;
                return productInstance.verifyProduct(web3.fromAscii(productSN), web3.fromAscii(consumerCode),{from:account});

            }).then(function(result){
                
                // console.log(result);

                var t= "";

                var tr="<tr>";
                if(result){
                    tr+="<td>"+ "Genuine Product."+"</td>";
                }else{
                    tr+="<td>"+ "Fake Product."+"</td>";
                }
                tr+="</tr>";
                t+=tr;

                document.getElementById('logdata').innerHTML = t;
                document.getElementById('add').innerHTML=account;
           }).catch(function(err){
               console.log(err.message);
           })
        })
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    })
})