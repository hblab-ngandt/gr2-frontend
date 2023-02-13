import { React } from "react";
import ListItem from "@material-ui/core/ListItem";
import { ethers } from "ethers";
import { Button } from "@mui/material";

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
    <ListItem>
    <Button
      variant="contained"
      style={{ display: "inline" }}
      onClick={() => buyNft()}
    >
      Buy
    </Button>
  </ListItem>
  );
}
