import { React } from "react";
import { ethers } from "ethers";

import {
  marketplaceContract
} from "../settings/Constant";

export default function BuyNft (props) {

  let balance = props.balance;
  let price = props.price;
  let marketItemId = props.marketItemId;

  const buyNft = async () => {
    try {
      let valueInBnb = ethers.utils.formatEther(price.toString());
      if (balance < valueInBnb)
        return;
      else {
        let buyTx = await marketplaceContract.buyImageNFT(marketItemId, {
          value: ethers.utils.parseEther(valueInBnb),
        });
  
        let tx = await buyTx.wait();
        console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div class=""></div>
      <div class="mb-0">
        <button className="btn btn-primary" onClick={() => buyNft()}>
          Buy
        </button>
      </div>
    </>
  );
}
