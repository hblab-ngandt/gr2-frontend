import { React } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

import { marketplaceContract } from "../settings/Constant";

export default function CancelSellNft (props) {

  const marketId = props.marketId;
  const navigate = useNavigate();
  
  const cancelNft = async () => {
    try {
      let cancelTx = await marketplaceContract.cancelListImageNFT(marketId);
      let tx = await cancelTx.wait();
      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      
      const cancelNft = await axios.post(
        "http://localhost:8626/api/nft/cancel-nft", {
          marketId: marketId,
        }
      );
      toast.success('Cancel selling NFT successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000 // 5 seconds
      });
      console.log(cancelNft.data);
      setTimeout(() => {
        navigate("/my-nft");
      }, 5000);
    } catch (err) {
      console.log(err);
      toast.error('Error while canceling this NFT on marketplaces', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000 // 5 seconds
      });
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
