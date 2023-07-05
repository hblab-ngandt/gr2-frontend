import { React } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  marketplaceContract
} from "../settings/Constant";

export default function BuyNft (props) {

  let balance = props.balance;
  let price = props.price;
  let marketId = props.marketId;
  let address = props.address;
  const navigate = useNavigate();

  const buyNft = async () => {
    try {
      const hexPrice = ethers.utils.parseUnits(price.toString(), "ether");
      const amount = hexPrice.toString();
      if (balance < price)
        return;
      else {
        let buyTx = await marketplaceContract.buyImageNFT(marketId, {
          value: (amount),
        });
  
        let tx = await buyTx.wait();
        console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
        const data = {
          marketId: marketId,
          walletAddress: address,
        };
        const buyNft = await axios.post(
          "http://localhost:8626/api/nft/buy-nft",
          data,
        );
        console.log(buyNft.data);
        navigate("/my-nft")
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
