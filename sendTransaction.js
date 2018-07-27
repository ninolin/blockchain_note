const ecRequest = require('ecrequest'),
	  jssha3 = require('js-sha3'),
	  keythereum = require('keythereum'),
      Tx = require('ethereumjs-tx');

const numberToHexString = (num) => {
	const length = 64;
	let rs = num >= 0 ? num.toString(16) : '0';
	if(rs.length < length) {
		rs = new Array(length - rs.length).fill(0).join('') + rs;
	}
	return rs;
};
const fillzero = (str) => {
	let rs = str;
    if (str.length < 64)
    {
        rs = new Array(64 - str.length).fill(0).join('') + rs;
    }
    return rs;
};

const key = {"address":"7c2fca6e95ffbf842b91daa1c77bfb5327f5c85d","crypto":{"cipher":"aes-128-ctr","ciphertext":"73c02d0c8f228767af1d3fa6d52af1f58ec8c47e19650bb3ead8c71e9409eaee","cipherparams":{"iv":"6aed216954c9d0c297ece2a29dcf1d18"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"5f2501bf4a701f23bb6edd364e71f57fdac41213f4f346ae3ee2a4e0845ea69c"},"mac":"8d3c5e4500c2d2f8b89c2d0b20de2c1d8c1895d02f2ced9a7b129ed77b4138d8"},"id":"9d943fc5-09d2-4dfd-b232-27efc9067ea3","version":3};

let nonce = 3132;
const sendether = () => {
        let fromUser = "0x7c2fca6e95ffbf842b91daa1c77bfb5327f5c85d";
        let toUser = "0x27ca548a8e0b7d789239a5fb209a567b14eca090";
        let value = "0x2386f26fc10000";
        const getNonce = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [fromUser,"pending"],
            id: 7
        };
        const getGasPrice = {
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: 7
        };
        const getEstimateGas = {
            "jsonrpc":"2.0",
            "method":"eth_estimateGas",
            "params":[{
                "from":fromUser,
                "to":toUser,
                "value":value,
                "data":"0x00000000"
            }],
            "id": 7
        };
        const sendRawTransaction = {
            "jsonrpc":"2.0",
            "method":"eth_sendRawTransaction",
            "params":[],
            "id": 7
        };

        
        //let nonce = "",
        let gasPrice = "",
            estimateGas = "";
        return ETHRPC({ body: getNonce })
        .then(({result}) => {
            console.log(nonce);
            //nonce = result;
            return ETHRPC({ body: getGasPrice })
        })
        .then(({result}) => {
            gasPrice = result;
            return ETHRPC({ body: getEstimateGas })
        }).then(({ result }) => {
            estimateGas = result;
            var privateKey = keythereum.recover('123456', key);
            var rawTx = {
                nonce: '0x'+(nonce++).toString(16),//由eth_getTransactionCount获取。参数为交易发送方地址
                to: toUser,
                gasPrice: gasPrice,
                gasLimit: estimateGas,
                value: value, 
                data: "0x0"
            }
            var tx = new Tx(rawTx);
            tx.sign(privateKey);
            var serializedTx = tx.serialize();
            var rawparam = serializedTx.toString('hex');
            sendRawTransaction.params[0] = "0x"+rawparam;
            return ETHRPC({ body: sendRawTransaction });
        }).then(({ result }) => {
            console.log(result);
            return Promise.resolve();
        }).catch((err) => {
            console.log('fail', err);
        });
    
}
const ETHRPC = ({ body }) => {
    const opt = {
        protocol: 'http:',
        hostname: '10.40.1.194',
        port: '8545',
        path: '/',
        headers: { 'content-type': 'application/json' },
        data: body
    };
    return ecRequest.post(opt).then((rs) => {
        return Promise.resolve(JSON.parse(rs.data));
    });
}

//sendether();
new Array(3000).fill('0').reduce((pre,cur) => {
    return pre.then(() =>{
        return new Promise((resolve, reject) => {
            console.log("aaa");
            return sendether().then(() => { resolve()});
        })
    })
},Promise.resolve())


   
    

