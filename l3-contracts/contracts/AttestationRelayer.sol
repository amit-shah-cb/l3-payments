// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract AttestationRelayer {
    address eas;
    address authority;
    address messanger;

    constructor(address _eas, address _authority, address _messanger) payable {
        require(_eas != address(0), "EAS address cannot be 0x0");
        eas = _eas;
        authority = _authority;
        messanger = _messanger;
    }

    function sendAttestation(bytes32 uid,address target) public {
        console.logBytes32(uid);
        console.log(eas);
        IEAS.Attestation memory a =  IEAS(eas).getAttestation(uid);
        console.logBytes32(a.uid);
        if(a.uid != uid){
            revert("invalid attetation");
        }
        if(a.attester != authority){
            revert("invalid attester");
        }

        ICrossDomainMessanger(messanger).sendMessage(target,abi.encodeCall(
                ITarget.updateKyc,
                (
                    a.attester,
                    a.recipient
                )
            ), 500_000);
        
    }
}

interface IEAS {
    struct Attestation {
        bytes32 uid; // A unique identifier of the attestation.
        bytes32 schema; // The unique identifier of the schema.
        uint64 time; // The time when the attestation was created (Unix timestamp).
        uint64 expirationTime; // The time when the attestation expires (Unix timestamp).
        uint64 revocationTime; // The time when the attestation was revoked (Unix timestamp).
        bytes32 refUID; // The UID of the related attestation.
        address recipient; // The recipient of the attestation.
        address attester; // The attester/sender of the attestation.
        bool revocable; // Whether the attestation is revocable.
        bytes data; // Custom attestation data.
    }

    /// @notice Returns an existing attestation by UID.
    /// @param uid The UID of the attestation to retrieve.
    /// @return The attestation data members.
    function getAttestation(bytes32 uid) external view returns (Attestation memory);

    /// @notice Checks whether an attestation exists.
    /// @param uid The UID of the attestation to retrieve.
    /// @return Whether an attestation exists.
    function isAttestationValid(bytes32 uid) external view returns (bool);
}

interface ICrossDomainMessanger{
    /// @notice Sends a message to some target address on the other chain. Note that if the call
    ///         always reverts, then the message will be unrelayable, and any ETH sent will be
    ///         permanently locked. The same will occur if the target on the other chain is
    ///         considered unsafe (see the _isUnsafeTarget() function).
    /// @param _target      Target contract or wallet address.
    /// @param _message     Message to trigger the target address with.
    /// @param _minGasLimit Minimum gas limit that the message can be executed with.
     function sendMessage(address _target, bytes calldata _message, uint32 _minGasLimit) external payable;
}

interface ITarget {
    function updateKyc(address attester, address recipient) external;
}