import { React } from "react";
import ListItem from "@material-ui/core/ListItem";
import { Button } from "@mui/material";

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
    <ListItem>
      <Button
        variant="contained"
        color="error"
        style={{ display: "inline" }}
        onClick={() => cancelNft()}
      >
        Cancel
      </Button>
  </ListItem>
  );
}
