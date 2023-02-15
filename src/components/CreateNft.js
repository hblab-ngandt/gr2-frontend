import { React, useState } from "react";
import { create } from "ipfs-http-client";
import { Button } from "@mui/material";

import noImage from '../assets/no-image-available.png'
import {
  nftContract,
  authorization,
  baseImage
} from "../settings/Constant";
import ListItem from "@material-ui/core/ListItem";

export default function CreateNft (props) {
  
  const [images, setImages] = useState([]);
  const [demo, setDemo] = useState({ preview: "", raw: "" });
  
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

  const handleChange = (e) => {
    if (e.target.files.length) {
      setDemo({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  return (
    <>
    <ListItem></ListItem>
      <form onSubmit={createNft}>
        <label htmlFor="upload-button">
          {demo.preview ? (
            <img src={demo.preview} alt="img-upload" width="150" height="250" />
          ) : (
            <img src={noImage} alt="img-not-availabel" width="150" height="250" />
          )}
        </label>
        <input
          type="file"
          multiple
          hidden
          accept="image/*"
          id="upload-button"
          onChange={handleChange}
        />
        <br />
        <Button variant="contained" type="submit">
          Create
        </Button>
      </form>
    </>
  );
}
