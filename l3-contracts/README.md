# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```


```shell
#deploy to L3
npx hardhat ignition deploy ./ignition/modules/Target.js --network l3
#deploy to sepolia
npx hardhat ignition deploy ./ignition/modules/AttestationRelayer.js --network sepolia

#update the target address based on the L3 address received
npx hardhat test --grep live

#this will generate a cross chain message that sends the attester and receiver to the L3
