import { React, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Box, Tab, Tabs } from "@mui/material";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@mui/material/Grid";
import "./App.css";

import NavBar from "./components/NavBar";
import CreateNft from "./components/CreateNft";
import MyNft from "./components/MyNft";
import Marketplace from "./components/Marketplace";
const provider = new ethers.providers.Web3Provider(window.ethereum);

function ConnectWallet() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [tabIndex, setTabIndex] = useState(0);

  const [isConnected, setIsConnected] = useState(false);

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
                        <section style={{backgroundColor: 'eee'}}>
                          <div class="container py-5">
                            <div class="row">
                              <CreateNft address={accountAddress}/>
                              <MyNft address={accountAddress} />
                            </div>
                          </div>
                        </section>
                      )}
                      {tabIndex === 1 && (
                          <Marketplace balance={balance} address={accountAddress} />
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
