import { React } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      console.log(cancelNft.data);
      navigate("/my-nft");
      
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
