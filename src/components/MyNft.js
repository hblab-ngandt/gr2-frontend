import { React, useEffect, useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@mui/material/Grid";
import Web3 from "web3";
import { ethers } from "ethers";
import TextField from "@mui/material/TextField";

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
    fetchMyNft();
    fetchMarketplace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {myNft.map((item) => (
        <>
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
              style={{ width: 150, height: 250 }}
            />
            </a>
          </ListItem>

          <ListItem>
            <TextField
              id="list-nft"
              label="Price"
              variant="outlined"
              style={{ display: "inline" }}
              onChange={(e) =>
                setArrayListNFT({
                  tokenId: item.tokenId,
                  price: e.target.value,
                  uri: item.tokenUri,
                })}
            />
          </ListItem>

          <SellNft price={arrayListNFT.price} tokenId={item.tokenId} />
        </Grid>
      </>
      ))}

      {marketplaces.length > 0 ? (
        <>
        {marketplaces.filter((item) => item.seller === props.address).map((item) => (
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
                  paddingRight: 100,
                }}
              />
              </a>
            </ListItem>
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
            
            <ListItem>Price : {ethers.utils.formatEther(item.price)}</ListItem>

            <CancelSellNft marketItemId={item.marketItemId} />
          </Grid>
        ))}
      </>
      ) : null} 
    </>
  );
}
