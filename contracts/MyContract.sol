pragma solidity 0.5.2;

import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";


contract MyContract {
    constructor() public {

    }

    function computeRecoveryAddress(bytes32 hashed, bytes memory signature) public pure returns (address) {
        return ECDSA.recover(ECDSA.toEthSignedMessageHash(hashed), signature);
    }

}
