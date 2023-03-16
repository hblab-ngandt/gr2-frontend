import { React, useEffect, useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@mui/material/Grid";
import Web3 from "web3";
import { ethers } from "ethers";

import CancelSellNft from "./CancelSellNft";
import BuyNft from "./BuyNft";

import {
  invalidAddress,
  nftContract,
  marketplaceContract
} from "../settings/Constant";

export default function Marketplace (props) {

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
    <>
      {marketplaces.length > 0 ? (
        <>
          {marketplaces.map((item) => (
            <Grid item xs={3} key={item.tokenId}>
              <ListItem>
                <a
                  href={item.tokenUri}
                  target="_blank"
                  rel="noreferrer"
                >
                <img
                  src={item.tokenUri}
                  alt="imge"
                  style={{
                    width: 150,
                    height: 250,
                    paddingRight: 100
                  }}
                />
                </a>
              </ListItem>

              {address === item.seller ? (
                // eslint-disable-next-line no-template-curly-in-string
                <ListItem> 
                  <a 
                    style={{ textDecoration: "none"}}
                    href={`https://testnet.bscscan.com/address/${item.seller}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Seller : You 
                  </a> 
                </ListItem>
              ) : (
                <ListItem>
                  <a 
                    style={{ textDecoration: "none"}}
                    href={`https://testnet.bscscan.com/address/${item.seller}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                  Seller : {item.seller.slice(0, 5) + '... ' + item.seller.slice(item.seller.length - 3, item.seller.length)}
                  </a>
                </ListItem>
              )}
              <ListItem>Price : {ethers.utils.formatEther(item.price)}</ListItem>

              {address === item.seller ? (
                <CancelSellNft marketItemId={item.marketItemId}/>
              ) : (
                <BuyNft price={item.price} marketItemId={item.marketItemId} balance={balance} />
              )}
          </Grid>
          ))}
        </>
      ) : (
        <span> Marketplace not available </span>
      )}
    </>
  );
}
