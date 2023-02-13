import { React, useState } from "react";
import { create } from "ipfs-http-client";
import { Button } from "@mui/material";
import ListItem from "@material-ui/core/ListItem";

import {
  nftContract,
  authorization,
  baseImage
} from "../settings/Constant";

export default function CreateNft (props) {
  const [images, setImages] = useState([]);
  
  const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  const createNft = async (event) => {
    try {
      event.preventDefault();
      const form = event.target;
  
      const files = form[0].files;
  
      if (!files === 0) {
        return alert("No files were selected");
      }
  
      const file = files[0];
      // upload files
      const result = await ipfs.add(file);
      setImages([
        ...images,
        {
          cid: result.cid,
          path: result.path
        }
      ]);
      let url = baseImage + result.path;

      let nftTx = await nftContract.safeMint(props.address, url);
      let tx = await nftTx.wait();

      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      form.reset();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ListItem>Create your NFT</ListItem>
      <ListItem>
        <form onSubmit={createNft}>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*" />
          <Button variant="contained" type="submit">
            Mint
          </Button>
        </form>
      </ListItem>
    </>
  )
}
