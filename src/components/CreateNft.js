import { React, useState } from "react";
import { create } from "ipfs-http-client";

import noImage from '../assets/no-image-available.png'
import {
  nftContract,
  authorization,
  baseImage
} from "../settings/Constant";

export default function CreateNft (props) {
  
  const [images, setImages] = useState([]);
  const [demo, setDemo] = useState({ preview: "", raw: "" });
  let address = props.address;
  
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

      let nftTx = await nftContract.safeMint(address, url);
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
    <div className="col-md-3 col-lg-3 mb-3 mb-lg-0">
    <div className="card">
      <div className="d-flex justify-content-between p-3">
        <p className="lead mb-0"></p>
        <div
          className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
          style={{ width: '35px', height: '35px' }}>
          <p className="text-white mb-0 small">x4</p>
        </div>
      </div>
      <form onSubmit={createNft}>
        <label htmlFor="upload-button">
          {demo.preview ? (
            <img src={demo.preview} alt="img-upload" className="card-img-top" />
          ) : (
            <img src={noImage} alt="img-not-availabel" className="card-img-top" />
          )}
        </label>
        <div className="form-group">
          <input
            className="mb-0"
            type="file"
            multiple
            hidden
            accept="image/*"
            id="upload-button"
            onChange={handleChange}
          />
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h5 className="mb-0">Title</h5>
            <div className="form-group mb-0">
              {/* <input type="text" className="form-control" style={{width: '9rem'}}/> */}
            </div>
          </div>

          <div className="d-flex justify-content-between">
          </div>

          <div className="d-flex justify-content-between mb-2">
            <div className=""></div>
            <div className="mb-0">
              <button className="btn btn-primary" type="submit" >
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
}
