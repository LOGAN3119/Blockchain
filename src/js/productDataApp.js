App = {
    web3Provider: null,
    contracts: {},
    address: "0x2F3b1F71DFAc65e670912e5D935c0c5D2CaB651c",
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
    },

    getData:function(event) {
        event.preventDefault();
        var sellerCode = document.getElementById('sellerCode').value;

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
                return productInstance.queryProductsList(web3.fromAscii(sellerCode),{from:account});

            }).then(function(result){
                
                //console.log()
                var productIds=[];
                var productSNs=[];
                var productNames=[];
                var productBrands=[];
                var productPrices=[];
                var productStatus=[];

                // console.log(result);
                
                for(var k=0;k<result[0].length;k++){
                    productIds[k]=result[0][k];
                }

                for(var k=0;k<result[1].length;k++){
                    productSNs[k]=web3.toAscii(result[1][k]);

                }

                for(var k=0;k<result[2].length;k++){
                    productNames[k]=web3.toAscii(result[2][k]);
                }

                for(var k=0;k<result[3].length;k++){
                    productBrands[k]=web3.toAscii(result[3][k]);
                }

                for(var k=0;k<result[4].length;k++){
                    productPrices[k]=result[4][k];
                }

                for(var k=0;k<result[5].length;k++){
                    productStatus[k]=web3.toAscii(result[5][k]);
                }

                var t= "";
                document.getElementById('logdata').innerHTML = t;
                for(var i=0;i<result[0].length;i++) {
                    var temptr = "<td>"+productPrices[i]+"</td>";
                    if(temptr === "<td>0</td>"){
                        break;
                    }

                    var tr="<tr>";
                    tr+="<td>"+productIds[i]+"</td>";
                    tr+="<td>"+productSNs[i]+"</td>";
                    tr+="<td>"+productNames[i]+"</td>";
                    tr+="<td>"+productBrands[i]+"</td>";
                    tr+="<td>"+productPrices[i]+"</td>";
                    tr+="<td>"+productStatus[i]+"</td>";
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