const optimism = require("@eth-optimism/sdk");

const ethers = require("ethers");

const dotenv = require('dotenv');

dotenv.config();

const privateKey = process.env.PK;

const l1Provider = new ethers.providers.StaticJsonRpcProvider("https://sepolia.base.org");
const l2Provider = new ethers.providers.StaticJsonRpcProvider("https://rpc-moderate-peach-flea-8yhquemoor.t.conduit.xyz");
const l1Wallet = new ethers.Wallet(privateKey, l1Provider);
const l2Wallet = new ethers.Wallet(privateKey, l2Provider);

const l1Token = "0x7644Cf8E089FB3De8fBb84860cF2EBE38505B7b7";
//NOTE: make sure you deploy your erc20 implementing the IOptimismERC20 interface
//you can do this easily via the `createOptimismMintableERC20` function on 0x4200000000000000000000000000000000000012 on your L2
// the emitted log will give you your local address
const l2Token = "0x3431ced74a9d5588e950051d7bb6ea95448c7b6f";

const erc20ABI = [{ constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" }, { inputs: [], name: "faucet", outputs: [], stateMutability: "nonpayable", type: "function" }];


const l1ERC20 = new ethers.Contract(l1Token, erc20ABI, l1Wallet);
const l2ERC20 = new ethers.Contract(l2Token, erc20ABI, l2Wallet);
(async function(){
    console.log(("PRE: l1 token balance:", await l1ERC20.balanceOf(l1Wallet.address)).toString());
    console.log(("PRE: l2 token balance:", await l2ERC20.balanceOf(l2Wallet.address)).toString());
    console.log("l1 balance:",(await l1Wallet.getBalance()).toBigInt());
    console.log("l2 balance:",(await l2Wallet.getBalance()).toBigInt());
    
    const oneToken = 33n;
    debugger;
    const messenger = new optimism.CrossChainMessenger({
        l1ChainId: 84532, // 11155111 for Sepolia, 1 for Ethereum
        l2ChainId: 3964, // 11155420 for OP Sepolia, 10 for OP Mainnet
        l1Provider:l1Provider,
        l2Provider: l2Provider,
        
        l1SignerOrProvider: l1Wallet,
        l2SignerOrProvider: l2Wallet,
        contracts:{
            l1:{                
                //Note these addresses come from your conduit deployments
                //contract.json 
                //ensure you use the PROXY address for the contracts
                //https://api.conduit.xyz/file/getOptimismContractsJSON?network=d4d6a1e3-1163-4b5c-a77f-0ac6bb9025f2&organization=1cf7e7b0-e917-4baf-a64d-06701ae34eb0                
                AddressManager: "0x6806d4C599F23EF7ff37213B32Ed4a2aaf33BF29",
                L1CrossDomainMessenger: "0xE074d9DE09EDE4C1616ccc9217D59c6f754096D4",
                L1StandardBridge: "0x10567186468d65D02EBA7f2f0cBD3d551c71Dbe3",
                OptimismPortal: "0xe735E81fb7B7993079762FDcc6f495Deac123333",
                L2OutputOracle: "0x932EAbD2640E8f323975B276487d8260CDB9120A",
                StateCommitmentChain: "0x0000000000000000000000000000000000000000",
                CanonicalTransactionChain: "0x0000000000000000000000000000000000000000",
                BondManager: "0x0000000000000000000000000000000000000000",
                OptimismPortal2: "0x0000000000000000000000000000000000000000",
                DisputeGameFactory: "0x0000000000000000000000000000000000000000"               
            },
            l2:{   
                //These are typically standardly deployed contracts
                //find them on your verified address tab on blockscout
                //https://explorerl2new-moderate-peach-flea-8yhquemoor.t.conduit.xyz/verified-contracts                            
                L2CrossDomainMessenger: "0x4200000000000000000000000000000000000007",
                L2ToL1MessagePasser: "0x4200000000000000000000000000000000000016",
                L2StandardBridge: "0x4200000000000000000000000000000000000010",
                OVM_L1BlockNumber: "0x4200000000000000000000000000000000000013",
                OVM_L2ToL1MessagePasser: "0x4200000000000000000000000000000000000016",
                OVM_DeployerWhitelist: "0x4200000000000000000000000000000000000002",
                OVM_ETH: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
                OVM_GasPriceOracle: "0x420000000000000000000000000000000000000F",
                OVM_SequencerFeeVault: "0x4200000000000000000000000000000000000011",
                WETH: "0x4200000000000000000000000000000000000006",
                BedrockMessagePasser: "0x4200000000000000000000000000000000000016"
            }
       }
      });
    
    let tx = await messenger.approveERC20(l1Token, l2Token, oneToken);
    let receipt = await tx.wait();
    //console.log(receipt);

    tx = await messenger.depositERC20(l1Token, l2Token, oneToken);
    receipt = await tx.wait();
    console.log(tx.hash);
    //console.log(receipt);

    await messenger.waitForMessageStatus(tx.hash, optimism.MessageStatus.RELAYED);
    console.log(("POST: l1 token balance:", await l1ERC20.balanceOf(l1Wallet.address)).toString());
    console.log(("POST: l2 token balance:", await l2ERC20.balanceOf(l2Wallet.address)).toString());
})();

