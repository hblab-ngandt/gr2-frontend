import { React, useEffect, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

import CancelSellNft from "./CancelSellNft";
import BuyNft from "./BuyNft";

import {
  invalidAddress,
  nftContract,
  marketplaceContract
} from "../settings/Constant";

export default function Marketplace(props) {

  const [marketplaces, setMarketplaces] = useState([]);
  let address = props.address;
  let balance = props.balance;

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
            price: Web3.utils.hexToNumber(tx[i].price),
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
    fetchMarketplace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section style={{backgroundColor: 'eee'}}>
      <div class="container py-5">
        <div class="row">
          {marketplaces.length > 0 ? (
            <>
            {marketplaces.map((item) => (
              <div class="col-md-4 col-lg-4 mb-4 mb-lg-0">
                <div class="card">
                  <div class="d-flex justify-content-between p-3">
                    <p class="lead mb-0">Name Item</p>
                    <div
                      class="bg-info rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                      style={{ width: '35px', height: '35px' }}>
                      <p class="text-white mb-0 small">x4</p>
                    </div>
                  </div>
                  <img src={item.tokenUri}
                    class="card-img-top" alt="Laptop" />
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <p class=""><a href="#!" class="text-muted" style={{ textDecoration: 'none'}}>Seller</a></p>
                      <p class="small">{item.seller.slice(0, 5) + '... ' + item.seller.slice(item.seller.length - 3, item.seller.length)}</p>
                    </div>
        
                    <div class="d-flex justify-content-between mb-3">
                      <h5 class="mb-0">Price</h5>
                      <h5 class="text-dark mb-0">{ethers.utils.formatEther(item.price)}</h5>
                    </div>
        
                    <div class="d-flex justify-content-between mb-2">
                    {address === item.seller ? (
                <CancelSellNft marketItemId={item.marketItemId}/>
              ) : (
                <BuyNft price={item.price} marketItemId={item.marketItemId} balance={balance} />
              )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </>
            ) : (
              <span> Marketplace not available </span>
            )}
        </div>
      </div>
    </section>
  );
}