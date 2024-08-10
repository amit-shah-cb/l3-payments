### L3 KYC Payments Prototype [WIP]

- the goal of this was to test the movement of state from base to a L3 app chain
- inititally the idea was creating an L3 chain with only KYC'd users.  This would be accomplished by moving EAS verification attestions from CB to the L3
- fragmented state is problematic though
- A simpler idea maybe to have a kycUSDC wrapper token on base that only allows transfers wrapping and transferring between EAS attested addresses
- this can then be bridged over to the L3 via erc20 bridges and the only type of erc token accepted for payments on the L3
- this effectively makes all capital on L3 KYCd which means potential for deploying privacy preserving contracts on the L3
