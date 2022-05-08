let accounts;
const numberContractAddress = "0xc6F7c30c32a269b2074A7A3BD21Aa50C8683b42b";
const numberContractABI = [
    {
        "inputs": [],
        "name": "pay",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

window.onload = function(){
    if(window.ethereum !== "undefined"){
        this.ethereum.on("accountsChanged", handleAccountsChanged)

        window.ethereum.request({method:"eth_accounts"})
            .then(handleAccountsChanged)
            .catch((err)=>{
                console.log(err)
            })
    }
};

const  handleAccountsChanged = (a) => {
    accounts = a;
};

async function purchase() {
    if(typeof  window.ethereum == 'undefined' || (typeof window.web3 == 'undefined')){
        alert("Metamask not detected! Please Install Metamask.");
        return;
    }
    accounts = await window.ethereum.request({method:"eth_requestAccounts"}).catch((err)=>{console.log(err.code)});
    let totalPrice = document.getElementById("totalPrice").innerText;
    let value = parseFloat(totalPrice) * 1000000000000000000;
    await web3.eth.sendTransaction({
        from: accounts[0],
        to: numberContractAddress,
        value: value.toString()
    }, function(error,hash){
        if (!error){
            $.ajax({
                url: urlWebsite + "/purchase",
                type: "POST",
                async:false,
                success: function (response) {
                    if (response == true){
                        alert("Thank for your purchase.\nA mail with the keys has been sent to your\nmail address");
                    }
                }
            });
            angular.element(document.getElementById("account")).scope().getCart();
        }
    });
}

//displays the balance window
async function manageBalance(){
    $(".navbar-collapse").collapse('hide');
    $("footer, .pagination, [id*='pg'], #resultsNumber, #gameInformation, #gameQuery").fadeOut(500);
    $("#manage_balance").show();
    $("#carousels").fadeOut(500);
    refreshBalance();
}

//withdraw all money from the smart contract
async function withdraw() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const numberContract = new ethers.Contract(numberContractAddress, numberContractABI, provider.getSigner());
    let balance = await numberContract.getBalance();
    balance = (parseFloat(balance)/1000000000000000000).toString();
    await numberContract.withdraw(ethers.utils.parseEther(balance));
}

//displays the current balance
async function refreshBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const numberContract = new ethers.Contract(numberContractAddress, numberContractABI, provider.getSigner());
    const balance = await numberContract.getBalance();
    document.getElementById("balance").innerText = parseFloat(balance)/1000000000000000000 + " ETH";
}