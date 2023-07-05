import { React } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";

import {
  nftAddress,
  marketplaceContract
} from "../settings/Constant";

export default function SellNft (props) {

  let priceInHex = props.price;
  let nftId = props.nftId;
  let address = props.address;
  const navigate = useNavigate();

  const sellNft = async () => {
    try {
      let price = ethers.utils.parseUnits(priceInHex, "ether");
      let marketTx = await marketplaceContract.listImageNFT(
        nftAddress,
        nftId,
        price
      );

      let tx = await marketTx.wait();
      console.log(`Sell transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      const marketId = Web3.utils.hexToNumber(tx.logs[1].topics[1]);
      if (tx.transactionHash){
        const data = {
          nftId: nftId,
          walletAddress: address,
          txHash: tx.transactionHash,
          seller: address,
          price: priceInHex,
          marketId: marketId
        };
        const sellNft = await axios.post(
          "http://localhost:8626/api/nft/sell-nft",
          data,
        );
        console.log(sellNft.data);
      }
      navigate("/marketplaces");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div class=""></div>
      <div class="pt-3">
        <button className="btn btn-primary mb-0" onClick={() => sellNft()}>
          Sell
        </button>
      </div>
    </>
  );
}
