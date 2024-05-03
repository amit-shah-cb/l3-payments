const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

module.exports = buildModule("TargetModule", (m) => {  
  const ar = m.contract("Target");
  return { ar };
});
