import {utils} from "ethers"

export function getHash(order) {
    return utils.solidityKeccak256(
      [
        "bytes32",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "address",
        "address",
        "bool"
      ],
      [
        order.marketHash,
        order.totalBetSize,
        order.percentageOdds,
        order.expiry,
        order.oracleFee,
        order.relayerMakerFee,
        order.relayerTakerFee,
        order.salt,
        order.maker,
        order.relayer,
        order.isMakerBettingOutcomeOne
      ]
    );
  }