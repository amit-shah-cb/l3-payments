const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();

describe("AttestationRelayer", function () {
  const UID = `0x927f9ae711a06627ba82cc4662177586fcf14d8b43d2d69afebf9097ab3b259b`;
  const ATTEST_AUTH=`0xb5644397a9733f86cacd928478b29b4cd6041c45`;
  const EAS = `0x4200000000000000000000000000000000000021`;
  const MESSANGER = `0xE074d9DE09EDE4C1616ccc9217D59c6f754096D4`;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
      const [owner, otherAccount] = await ethers.getSigners();

    const AttestationRelayer = await ethers.getContractFactory("AttestationRelayer");
    const ar = await AttestationRelayer.deploy(EAS,ATTEST_AUTH, MESSANGER);

    return { ar, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { ar } = await loadFixture(deployFixture);
      expect(ar).to.not.null;

    });

    it("Should return attestation", async function () {
      const { ar } = await loadFixture(deployFixture);
      expect(ar).to.not.null;
      const tx = await ar.sendAttestation(UID);
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });

    it("should call on live network",async function(){
      const provider = new ethers.JsonRpcProvider(`https://sepolia.base.org`);
      const wallet = new ethers.Wallet(process.env.PK,provider);
      console.log('wallet:',wallet.address );
      console.log('balance:',await provider.getBalance(wallet.address));
      const AttestationRelayer = await ethers.getContractFactory("AttestationRelayer");
      let ar = AttestationRelayer.attach(`0xb6D8CdC57A96991A8663cA2ff662C34c6D3aCE2B`);
      ar = ar.connect(wallet)
      console.log("ar:",await ar.getAddress());

      const tx = await ar.sendAttestation(UID,`0x9bdC14BFcb953D963a0d864A2F1f37D1b68baa32`);
      console.log(await tx.wait());
      // const receipt = await tx.wait();
      // console.log(tx.hash);
    });

  });

 
});
