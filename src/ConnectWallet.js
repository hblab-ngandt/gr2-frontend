import { React, useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button } from "@mui/material";
import ListItem from "@material-ui/core/ListItem";
import { Link } from "@mui/material";
import { create } from "ipfs-http-client";
import Web3 from "web3";


import ImageToken from './ImageToken.json';
// import Upload from "./Upload";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const nftAddress = '0x2AbFFce583123258D9e39cfdd52EAdf3f86432e9';

const signer = provider.getSigner();

const nftContract = new ethers.Contract(nftAddress, ImageToken.abi, signer);
const readContract = new ethers.Contract(nftAddress, ImageToken.abi, provider);

const { REACT_APP_IPFS_PROJECT_ID, REACT_APP_IPFS_PROJECT_KEY } = process.env

const projectId = REACT_APP_IPFS_PROJECT_ID;
const projectKey = REACT_APP_IPFS_PROJECT_KEY;
const authorization = "Basic " + btoa(projectId + ":" + projectKey);


function ConnectWallet() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState();
  const [accountBalance, setAccountBalance] = useState();

  const [isConnected, setIsConnected] = useState(false);

  const [imageUploaded, setImageUploaded] = useState('');

  // const [toAddress, setToAddress] = useState('');
  const [uri, setUri] = useState('');
  
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
    };
    checkAvailableMetamask();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await provider.send("eth_requestAccounts", []);
      let balanceAcc = await provider.getBalance(accounts[0]);
      let balance = ethers.utils.formatEther(balanceAcc);

      setAccountAddress(accounts[0]);
      setAccountBalance(balance);
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
    }
  };

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

    setImageUploaded([
      ...imageUploaded,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);
    const url = "https://ngandt.infura-ipfs.io/ipfs/" + result.path;
    console.log(url);
    setUri(url);
    form.reset();
  }

  const safeMint = async (event) => {
    try {
      let nftTx = await nftContract.safeMint(accountAddress, uri);
      console.log('Mining ... ',nftTx.hash);

      let tx = await nftTx.wait();
      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      const tokenId = Web3.utils.hexToNumber(tx.logs[0].topics[3]);
      console.log(tokenId);
      event.target.value = null;
    } catch (err) {
      console.log(err);
    }
  }

  const getMyTokens = async () => {
    try {
      let nftTx = await readContract.totalSupply();
      console.log(nftTx);

    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div>
      <header className="">
        {haveMetamask ? (
          <div>
            {isConnected ? (
              <div className="marketplace">
                
                <div>
                  <Link style={{textDecoration: 'none'}} target="_blank" href={`https://testnet.bscscan.com/address/${accountAddress}`} ><ListItem>Your address : {accountAddress}</ListItem></Link>
                  <ListItem>Your balance : {accountBalance}</ListItem>
                </div>
              
                <div>
                  <h2>Mint your image</h2>
                  <form onSubmit={uploadToIPFS}>
                    <input id="file-upload" type="file" multiple accept="image/*" />
                    <Button variant="contained" type="submit">Upload image</Button>
                  </form>
                  
                  <Button variant="contained" onClick={safeMint}>
                    Mint
                  </Button>
                </div>
                
                <div>
                <Button variant="contained" onClick={getMyTokens}>
                  My Tokens
                  </Button>
                </div>
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
