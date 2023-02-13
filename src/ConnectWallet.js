import { React, useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Box, Tab, Tabs } from "@mui/material";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@mui/material/Grid";
import Web3 from "web3";

import ImageToken from "./ImageToken.json";
import ImageMarketplace from "./ImageMarketplace.json";
import NavBar from "./components/NavBar";
import CreateNft from "./components/CreateNft";
import MyNft from "./components/MyNft";


const {
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


function ConnectWallet() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [tabIndex, setTabIndex] = useState(0);

  const [isConnected, setIsConnected] = useState(false);
  const [marketplaces, setMarketplaces] = useState([]);

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
                chainName: 'Binance Smart Chain Testnet',
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
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccountAddress(ethers.utils.getAddress(accounts[0]));
      let balanceAddress = await provider.getBalance(accounts[0]);
      setBalance(ethers.utils.formatEther(balanceAddress));
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
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
    fetchMarketplace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <NavBar address={accountAddress}/>
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
                          <CreateNft address={accountAddress}/>
                          <MyNft address={accountAddress} />
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
