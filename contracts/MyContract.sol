pragma solidity 0.5.7;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "./LibOrder.sol";


contract MyContract {
    using LibOrder for LibOrder.Order;

    constructor() public {

    }

    enum Outcome {VOID, OUTCOME_ONE, OUTCOME_TWO}
    enum VoteOption {MISSED, OUTCOME_ONE, OUTCOME_TWO, VOID}

    struct TestStruct {
        Outcome outcome;
        VoteOption voteOption;
        uint256 hello;
    }

    function computeRecoveryAddress(bytes32 hashed, bytes memory signature) public pure returns (address) {
        return ECDSA.recover(ECDSA.toEthSignedMessageHash(hashed), signature);
    }

    /// @notice Gets the "base" status of an order without considering any token 
    ///         allowances and balances.
    /// @param makerOrder A maker order.
    /// @param makerSig The signature of the maker on this order.
    /// @return A string representing the status. "OK" for valid.
    function getBaseOrderStatus( // solhint-disable-line code-complexity
        LibOrder.Order memory makerOrder,
        bytes memory makerSig
    ) 
        public
        pure
        returns (address)
    {
        if (makerOrder.checkSignature(makerSig) == false) {
            bytes32 orderHash = makerOrder.getOrderHash();
            return ECDSA.recover(ECDSA.toEthSignedMessageHash(orderHash), makerSig);
        }
        return 0x0000000000000000000000000000000000000000;
    }

    function getHash(LibOrder.Order memory makerOrder)
        public
        pure
        returns (bytes32)
    {
        return makerOrder.getOrderHash();
    }

    function getEnum()
        public
        view
        returns (TestStruct memory)
    {
        return TestStruct({
            outcome: Outcome.OUTCOME_ONE,
            voteOption: VoteOption.OUTCOME_TWO,
            hello: 0
        });
    }

}
