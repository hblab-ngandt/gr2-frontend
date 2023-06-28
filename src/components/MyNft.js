import { React, useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

import CreateNft from "./CreateNft";
import SellNft from "./SellNft";
import CancelSellNft from "./CancelSellNft";

import axios from "axios";

export default function MyNft (props) {
  
  const [myNft, setMyNft] = useState([]);
  const [sellNft, setSellNft] = useState([]);
  
  let address = props.address;
  const fetchMyNft = async () => {
    try {
      const result = await axios.post(
        "http://localhost:8626/api/nft/my-nft", {
          walletAddress: address,
        }
      );
      setMyNft(result.data.nfts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMyNft();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
  <>
    <section>
      <div className="container py-5">
        <div className="row">
        <CreateNft address={address}/>
          {myNft.map((item, i) =>(
            <div className="col-md-3 col-lg-3 mb-3" key={i}>
            <div className="card">
              <div className="d-flex justify-content-between p-3">
                <p className="lead mb-0">{item.name}</p>
                <div
                  className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                  style={{ width: '35px', height: '35px' }}>
                  <p className="text-white mb-0 small">x4</p>
                </div>
              </div>
              <img src={item.url}
                className="card-img-top" alt="img-url" />
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <h5 className="mb-0">Price</h5>
                    <div className="form-group">
                      <input 
                        type="text"
                        className="form-control"
                        style={{width: '9rem'}}
                        onChange={(e) =>
                          setSellNft({
                            nftId: item.nftId,
                            price: e.target.value,
                          })}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <SellNft price={sellNft.price} nftId={item.nftId} address={address}/>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
  );
}
