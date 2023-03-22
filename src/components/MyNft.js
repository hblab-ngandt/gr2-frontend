import { React, useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

import CreateNft from "./CreateNft";
import SellNft from "./SellNft";
import CancelSellNft from "./CancelSellNft";

import {
  invalidAddress,
  nftContract,
  marketplaceContract
} from "../settings/Constant";

export default function MyNft (props) {
  
  const [myNft, setMyNft] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);
  const [arrayListNFT, setArrayListNFT] = useState([]);
  
  let address = props.address;

  const fetchMyNft = async () => {
    try {
      let txNftContract = await nftContract.getCounterToken();
      let numberToken = Web3.utils.hexToNumber(txNftContract);
      let temp = [];

      for (let i = 0; i < numberToken; i++) {
        let owners = await nftContract.ownerOf(i);
        if (props.address === owners) {
          let uri = await nftContract.tokenURI(i);
          
          const data = {
            tokenId: i,
            tokenUri: uri
          }
          temp.push(data);
        }
      }
      setMyNft(temp);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMarketplace = async () => {
    try {
      let tx = await marketplaceContract.getListedNFT();
      let temp = [];

      for (let i = 1; i < tx.length; i++) {
        if (tx[i].owner !== invalidAddress) {
          let tokenId = Web3.utils.hexToNumber(tx[i].tokenId);
          let uri = await nftContract.tokenURI(tokenId);
  
          const data = {
            marketItemId: Web3.utils.hexToNumber(tx[i].marketItemId),
            nftContract: tx[i].nftContract,
            owner: tx[i].owner,
            price: Web3.utils.hexToNumberString(tx[i].price),
            seller: tx[i].seller,
            tokenId: tokenId,
            tokenUri: uri
          }
          temp.push(data);
        }
      }
      setMarketplaces(temp);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMyNft();
    fetchMarketplace();
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
                <p className="lead mb-0">Name Item</p>
                <div
                  className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                  style={{ width: '35px', height: '35px' }}>
                  <p className="text-white mb-0 small">x4</p>
                </div>
              </div>
              <img src={item.tokenUri}
                className="card-img-top" alt="Laptop" />
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <h5 className="mb-0">Price</h5>
                    <div className="form-group">
                      <input 
                        type="text"
                        className="form-control"
                        style={{width: '9rem'}}
                        onChange={(e) =>
                          setArrayListNFT({
                            tokenId: item.tokenId,
                            price: e.target.value,
                            uri: item.tokenUri
                          })}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <SellNft price={arrayListNFT.price} tokenId={item.tokenId}/>
                </div>
              </div>
            </div>
            </div>
          ))}

          {marketplaces.length > 0 ? (
            <>
            {marketplaces.filter((item) => item.seller === address).map((item, i) => (
              <div className="col-md-3 col-lg-3 mb-3 mb-lg-0" key={i}>
                <div className="card">
                  <div className="d-flex justify-content-between p-3">
                    <p className="lead mb-0">Name Item</p>
                    <div
                      className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                      style={{ width: '35px', height: '35px' }}>
                      <p className="text-white mb-0 small">x4</p>
                    </div>
                  </div>
                  <img src={item.tokenUri}
                    className="card-img-top" alt="Laptop" />
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <p className=""><a href="#!" className="text-muted" style={{ textDecoration: 'none'}}>Seller</a></p>
                      <p className="small">You</p>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="mb-0">Price</h5>
                      <h5 className="text-dark mb-0">{ethers.utils.formatEther(item.price)}</h5>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                    {address === item.seller ? (
                      <CancelSellNft marketItemId={item.marketItemId}/>
                    ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </>
          ) : null}
        </div>
      </div>
    </section>
  </>
  );
}
