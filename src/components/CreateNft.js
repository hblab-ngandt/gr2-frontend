import { React, useState } from "react";
import axios from "axios";
import Web3 from "web3";

import noImage from '../assets/no-image-available.png'
import {
  nftContract,
  marketplaceAddress
} from "../settings/Constant";

export default function CreateNft (props) {
  
  const [demo, setDemo] = useState({ preview: "", raw: "" });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const address = props.address;

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDemo({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };
  const token = localStorage.getItem('token');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const createNft = async (event) => {
    event.preventDefault();
    const dataForm = new FormData();
    dataForm.append('images', demo.raw);
    try {
      const uploadFile = await axios.post(
        "http://localhost:8626/api/nft/upload",
        dataForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let nftTx = await nftContract.mint(name, description, uploadFile.data.image, marketplaceAddress);
      let tx = await nftTx.wait();
      const nftId = Web3.utils.hexToNumber(tx.logs[0].topics[3]);

      const dataNft = {
        nftId: nftId,
        name: name,
        owner: address,
        description: description,
        url: uploadFile.data.image
      }
      const createNft = await axios.post(
        "http://localhost:8626/api/nft/create",
        dataNft,
      );
      console.log(createNft.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-md-3 col-lg-3 mb-3 mb-lg-0">
      <div className="card">
        <div className="d-flex justify-content-between p-3">
          <p className="lead mb-0"></p>
          <div
            className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
            style={{ width: '35px', height: '35px' }}
          >
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
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '9rem' }}
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <h5 className="mb-0">Description</h5>
              <div className="form-group mb-0">
                <input
                  type="text"
                  className="form-control"
                  rows="3"
                  placeholder="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <div className=""></div>
              <div className="mb-0">
                <button className="btn btn-primary" type="submit">
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
