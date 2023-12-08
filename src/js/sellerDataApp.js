App = {
    web3Provider: null,
    contracts: {},
    address: "0x849EAAE44a671A8c5B80FCdc3a0F84c0A7ea12a9",
    url: 'http://127.0.0.1:7545',
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

        $(document).on('click','.btn-register',App.getData);
        $(document).on('click','.btn-buyTokens',App.buyTokens);
        $(document).on('click','.btn-erc20balance',App.getERC20Balance);
        $(document).on('click','.btn-erc721balance',App.getERC721Balance);
        $(document).on('click','.btn-batchTransfer',App.batchTransfer);
    },

    buyTokens:function(event) {
        event.preventDefault();
        var productInstance;
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];
            App.contracts.product.deployed().then(function(instance){

                productInstance=instance;
                return productInstance.buyTokens({from:account});

            }).then(function(result){
                console.log(result);
                document.getElementById('status').innerHTML="Purchase SuccessFul";
           }).catch(function(err){
               console.log(err.message);
           })
        })
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

    batchTransfer: function(event) {
        event.preventDefault();

        var productInstance;

        var consumerTo = document.getElementById('consumerTo').value;
        var amountTobeSent = document.getElementById('amountTobeSent').value
 
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
                return productInstance.batchTransfer(accounts[1],amountTobeSent, {from:account});
             }).then(function(result){
                // console.log(result);
                window.location.reload();
                document.getElementById('consumerTo').value='';
                document.getElementById('amountTobeSent').value='';

            }).catch(function(err){
                console.log(err.message);
            });
        });
    },

    getData:function(event) {
        event.preventDefault();
        var manufacturerCode = document.getElementById('manufacturerCode').value;

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
                return productInstance.querySellersList(web3.fromAscii(manufacturerCode),{from:account});

            }).then(function(result){
                
                var sellerId=[];
                var sellerName=[];
                var sellerBrand=[];
                var sellerCode=[];
                var sellerNum=[];
                var sellerManager=[];
                var sellerAddress=[];
                // console.log(result);
                
                for(var k=0;k<result[0].length;k++){
                    sellerId[k]=result[0][k];
                }

                for(var k=0;k<result[1].length;k++){
                    sellerName[k]=web3.toAscii(result[1][k]);

                }

                for(var k=0;k<result[2].length;k++){
                    sellerBrand[k]=web3.toAscii(result[2][k]);
                }

                for(var k=0;k<result[3].length;k++){
                    sellerCode[k]=web3.toAscii(result[3][k]);
                }

                for(var k=0;k<result[4].length;k++){
                    sellerNum[k]=result[4][k];
                }

                for(var k=0;k<result[5].length;k++){
                    sellerManager[k]=web3.toAscii(result[5][k]);
                }

                for(var k=0;k<result[6].length;k++){
                    sellerAddress[k]=web3.toAscii(result[6][k]);
                }
                

                var t= "";
                document.getElementById('logdata').innerHTML = t;
                for(var i=0;i<result[0].length;i++) {
                    var temptr = "<td>"+sellerNum[i]+"</td>";
                    if(temptr === "<td>0</td>"){
                        break;
                    }
                    var tr="<tr>";
                    tr+="<td>"+sellerId[i]+"</td>";
                    tr+="<td>"+sellerName[i]+"</td>";
                    tr+="<td>"+sellerBrand[i]+"</td>";
                    tr+="<td>"+sellerCode[i]+"</td>";
                    tr+="<td>"+sellerNum[i]+"</td>";
                    tr+="<td>"+sellerManager[i]+"</td>";
                    tr+="<td>"+sellerAddress[i]+"</td>";
                    tr+="</tr>";
                    t+=tr;

                }
                document.getElementById('logdata').innerHTML += t;
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