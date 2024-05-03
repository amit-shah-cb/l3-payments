require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    hardhat: {
      chainId: 1337,
      forking: {
        url: "https://sepolia.base.org",
      }
    },
    sepolia: {
      chainId: 84532,
      url: "https://sepolia.base.org",      
      accounts:[process.env.PK]      
    },
    l3:{
      chainId:3964,
      url:"https://rpc-moderate-peach-flea-8yhquemoor.t.conduit.xyz",
      accounts:[process.env.PK]      
    }

  }
};
