import { React, useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Box, Tab, Tabs, Typography } from "@mui/material";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { create } from "ipfs-http-client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Web3 from "web3";

import ImageToken from "./ImageToken.json";
import ImageMarketplace from "./ImageMarketplace.json";

const {
  REACT_APP_IPFS_PROJECT_ID,
  REACT_APP_IPFS_PROJECT_KEY,
  REACT_APP_NFT_ADDRESS,
  REACT_APP_MARKETPLACE_ADDRESS,
} = process.env;

const invalidAddress = "0x0000000000000000000000000000000000000000";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const nftAddress = REACT_APP_NFT_ADDRESS;
const marketplaceAddress = REACT_APP_MARKETPLACE_ADDRESS;

const signer = provider.getSigner();

const nftContract = new ethers.Contract(
  nftAddress,
  ImageToken.abi,
  signer);

const marketplaceContract = new ethers.Contract(
  marketplaceAddress,
  ImageMarketplace.abi,
  signer
);

const projectId = REACT_APP_IPFS_PROJECT_ID;
const projectKey = REACT_APP_IPFS_PROJECT_KEY;
const authorization = "Basic " + btoa(projectId + ":" + projectKey);

function ConnectWallet() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [tabIndex, setTabIndex] = useState(0);

  const [isConnected, setIsConnected] = useState(false);

  const [arrayListNFT, setArrayListNFT] = useState([]);
  const [uri, setUri] = useState("");

  const [myNft, setMyNft] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);

  const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  useEffect(() => {
    const checkAvailableMetamask = async () => {
      if (!window.ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{
            chainId: "0x61",
          }]
        });
      } catch (e) {
        if (e.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: 'Polygon Mainnet',
                chainId: '0x61',
                nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545']
              }
            ]
          });
        }
      }
    };
    checkAvailableMetamask();
  }, []);

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        sethaveMetamask(false);
      }

      // await window.ethereum.request({
      //   method: "wallet_switchEthereumChain",
      //   params: [{
      //     chainId: "0x61",
      //     // rpcUrls: ["https://data-seed-prebsc-1-s3.binance.org:8545"],
      //     // chainName: "Binance Smart Chain Testnet",
      //     // nativeCurrency: {
      //     //   name: "BNB",
      //     //   symbol: "BNB",
      //     //   decimals: 18
      //     // },
      //     // blockExplorerUrls: ["https://testnet.bscscan.com/"]
      //   }]
      // });

      const accounts = await provider.send("eth_requestAccounts", []);
      setAccountAddress(ethers.utils.getAddress(accounts[0]));
      let balanceAddress = await provider.getBalance(accounts[0]);
      setBalance(ethers.utils.formatEther(balanceAddress));
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
    }
  };
  console.log('fsfsd')

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const form = event.target;

    const files = form[0].files;

    if (!files || files.length === 0) {
      return alert("No files were selected");
    }

    const file = files[0];
    // upload files
    const result = await ipfs.add(file);
    const url = "https://ngandt.infura-ipfs.io/ipfs/" + result.path;
    setUri(url);
    form.reset();
    
  };

  const fetchMyNft = async () => {
    try {
      let txNftContract = await nftContract.getCounterToken();
      let numberToken = Web3.utils.hexToNumber(txNftContract);
      let temp = [];

      for (let i = 0; i < numberToken; i++) {
        let owners = await nftContract.ownerOf(i);
        if (accountAddress === owners) {
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
  }

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
  }

  useEffect(() => {
    fetchMyNft();
    fetchMarketplace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeMint = async () => {
    try {      
      let nftTx = await nftContract.safeMint(accountAddress, uri);
      let tx = await nftTx.wait();

      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      window.location.reload();

    } catch (err) {
      console.log(err);
    }
  };

  const listNft = async (event) => {
    try {
      let price = ethers.utils.parseUnits(arrayListNFT.price, "ether");
      let marketTx = await marketplaceContract.listImageNFT(
        nftAddress,
        arrayListNFT.tokenId,
        price
      );

      let tx = await marketTx.wait();
      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const buyNft = async (item) => {
    try {
      let valueInBnb = ethers.utils.formatEther(item.price.toString());
      if (balance < valueInBnb)
        return;
      else {
        let buyTx = await marketplaceContract.buyImageNFT(item.marketItemId, {
          value: ethers.utils.parseEther(valueInBnb),
        });
  
        let tx = await buyTx.wait();
        console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
        
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelNft = async (item) => {
    try {
      let cancelTx = await marketplaceContract.cancelListImageNFT(item.marketItemId);
      let tx = await cancelTx.wait();
      
      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <header className="">
        {haveMetamask ? (
          <div>
            {isConnected ? (
              <div>
                <AppBar position="static">
                  <Toolbar>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ flexGrow: 1 }}
                    >
                      Account Address
                    </Typography>
                    <a
                      style={{ textDecoration: "none", color: "white" }}
                      target="_blank"
                      href={`https://testnet.bscscan.com/address/${accountAddress}`}
                      rel="noreferrer"
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        {accountAddress}
                      </Typography>
                    </a>
                  </Toolbar>
                </AppBar>

                <ListItem>
                  <Box>
                    <Box>
                      <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="My NFT" />
                        <Tab label="Marketplace" />
                      </Tabs>
                    </Box>
                    <Box sx={{ padding: 2 }}>
                      {tabIndex === 0 && (
                        <Grid
                          container
                          rowSpacing={1}
                          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                        >
                          <ListItem>Create your NFT</ListItem>
                          <ListItem>
                            <form onSubmit={uploadToIPFS}>
                              <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                              />

                              <Button variant="contained" type="submit">
                                Upload image
                              </Button>

                              <Button variant="contained" onClick={safeMint}>
                                Mint
                              </Button>
                            </form>
                          </ListItem>

                          <ListItem>My NFT</ListItem>
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
                            
                                <ListItem>
                                  <Button
                                    variant="contained"
                                    style={{ display: "inline" }}
                                    onClick={listNft}
                                  >
                                    List
                                  </Button>
                                </ListItem>
                              </Grid>
                            </>
                          ))}
                          
                          {/* Marketplace my nft */}
                          {marketplaces.length > 0 ? (
                            <>
                              {marketplaces.filter((item) => item.seller === accountAddress).map((item) => (
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
                                        paddingRight: 60,
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

                                  <ListItem>
                                    <Button
                                      variant="contained"
                                      style={{ display: "inline" }}
                                      onClick={() => cancelNft(item)}
                                      >
                                      Cancel
                                    </Button>
                                  </ListItem>
                                </Grid>
                              ))}
                            </>
                          ) : null}                          
                        </Grid>
                      )}
                      {tabIndex === 1 && (
                        <>
                          <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
                          >
                            <ListItem>Marketplace</ListItem>
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
                                          paddingRight: 60,
                                        }}
                                      />
                                      </a>
                                    </ListItem>

                                    {accountAddress === item.seller ? (
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
                                        Seller : {item.seller.slice(0, 7) + '... ' + item.seller.slice(item.seller.length - 3, item.seller.length)}
                                        </a>
                                      </ListItem>
                                    )}
                                    <ListItem>Price : {ethers.utils.formatEther(item.price)}</ListItem>

                                    {accountAddress === item.seller ? (
                                      <ListItem>
                                        <Button
                                          variant="contained"
                                          style={{ display: "inline" }}
                                          onClick={() => cancelNft(item)}
                                        >
                                          Cancel
                                        </Button>
                                      </ListItem>
                                    ) : (
                                      <ListItem>
                                        <Button
                                          variant="contained"
                                          style={{ display: "inline" }}
                                          onClick={() => buyNft(item)}
                                        >
                                          Buy
                                        </Button>
                                      </ListItem>
                                    )}
                                  </Grid>
                                ))}
                              </>
                            ) : (
                              <span> Marketplace not available </span>
                            )}
                          </Grid>
                        </>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              </div>
            ) : (
              <Button variant="contained" onClick={connectWallet}>
                Connect your wallet
              </Button>
            )}
          </div>
        ) : (
          <h3>Please install Metamask</h3>
        )}
      </header>
    </div>
  );
}

export default ConnectWallet;
