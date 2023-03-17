import { React } from "react";
import { ethers } from "ethers";

import {
  nftAddress,
  marketplaceContract
} from "../settings/Constant";

export default function SellNft (props) {

  let priceInHex = props.price;
  let tokenId = props.tokenId;

  const sellNft = async () => {
    try {
      let price = ethers.utils.parseUnits(priceInHex, "ether");
      let marketTx = await marketplaceContract.listImageNFT(
        nftAddress,
        tokenId,
        price
      );

      let tx = await marketTx.wait();
      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div class=""></div>
      <div class="mb-0">
        <button className="btn btn-primary mb-0" onClick={() => sellNft()}>
          Sell
        </button>
      </div>
    </>
  );
}
