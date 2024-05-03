const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

module.exports = buildModule("AttestationRelayerModule", (m) => {
  const EAS = `0x4200000000000000000000000000000000000021`;
  const ATTEST_AUTH=`0xb5644397a9733f86cacd928478b29b4cd6041c45`;  
  const L1_MESSANGER = `0xE074d9DE09EDE4C1616ccc9217D59c6f754096D4`;

  const ar = m.contract("AttestationRelayer", [EAS,ATTEST_AUTH,L1_MESSANGER]);

  return { ar };
});
