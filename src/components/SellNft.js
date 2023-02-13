import { React } from "react";
import ListItem from "@material-ui/core/ListItem";
import { ethers } from "ethers";
import { Button } from "@mui/material";

import {
  nftAddress,
  marketplaceContract
} from "../settings/Constant";

export default function SellNft (props) {

  let priceInHex = props.price;
  let tokenId = props.tokenId;

  const listNft = async () => {
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
    <ListItem>
      <Button
        variant="contained"
        style={{ display: "inline" }}
        onClick={listNft}
      >
        List
      </Button>
    </ListItem>
  );
}
