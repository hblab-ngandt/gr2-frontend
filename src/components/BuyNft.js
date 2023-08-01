import { React, useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

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
        toast.success('Buy NFT successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000 // 5 seconds
        });
        console.log(buyNft.data);
        setTimeout(() => {
          navigate("/my-nft");
        }, 5000);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error while buying this NFT', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000 // 5 seconds
      });
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
