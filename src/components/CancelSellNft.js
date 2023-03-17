import { React } from "react";

import {
  marketplaceContract
} from "../settings/Constant";
export default function CancelSellNft (props) {

  let marketItemId = props.marketItemId;
  
  const cancelNft = async () => {
    try {
      let cancelTx = await marketplaceContract.cancelListImageNFT(marketItemId);
      let tx = await cancelTx.wait();
      
      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div class=""></div>
      <div class="mb-0">
        <button className="btn btn-danger" onClick={() => cancelNft()}>
          Cancel
        </button>
      </div>
    </>
  );
}
