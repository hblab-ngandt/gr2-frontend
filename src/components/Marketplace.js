import { React, useEffect, useState } from "react";
import CancelSellNft from "./CancelSellNft";
import BuyNft from "./BuyNft";

import {
  marketplaceAddress,
} from "../settings/Constant";
import axios from "axios";

export default function Marketplace(props) {

  const [marketplaces, setMarketplaces] = useState([]);
  let address = props.address;
  let balance = props.balance;

  const fetchMarketplace = async () => {
    try {
      const market = await axios.post(
        "http://localhost:8626/api/nft/marketplaces", {
          marketplace: marketplaceAddress,
        },
      );
      setMarketplaces(market.data.marketplaces);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div class="container py-5">
        <div class="row">
          {marketplaces.length > 0 ? (
            <>
            {marketplaces.map((item, i) => (
              <div class="col-md-3 col-lg-3 mb-3 mb-lg-5" key={i}>
                <div class="card">
                  <div class="d-flex justify-content-between p-3">
                    <p class="lead mb-0">{item.name}</p>
                  </div>
                  <img src={item.url}
                    class="card-img-top" alt="Laptop" />
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <p class=""><a href="#!" class="text-muted" style={{ textDecoration: 'none'}}>Seller</a></p>
                      {address === item.created_by
                      ? (<p class="small">You{item.marketId}</p>) 
                      : (<p class="small">{item.seller.slice(0, 5) + '... ' + item.seller.slice(item.seller.length - 3, item.seller.length)}</p>)}
                    </div>
        
                    <div class="d-flex justify-content-between mb-3">
                      <h5 class="mb-0">Price</h5>
                      <h5 class="text-dark mb-0">{item.price}</h5>
                    </div>
        
                    <div class="d-flex justify-content-between mb-2">
                    {address === item.created_by ? (
                      <CancelSellNft marketId={item.marketId}/>
                    ) : (
                      <BuyNft price={item.price} marketId={item.marketId} balance={balance} address={address} />
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