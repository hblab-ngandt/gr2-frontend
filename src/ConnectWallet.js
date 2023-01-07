import { React, useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Link} from "@mui/material";
import ListItem from "@material-ui/core/ListItem";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { create } from "ipfs-http-client";
import Web3 from "web3";

import ImageToken from './ImageToken.json';
import ImageMarketplace from './ImageMarketplace.json';

const { 
  REACT_APP_IPFS_PROJECT_ID, 
  REACT_APP_IPFS_PROJECT_KEY,
  REACT_APP_NFT_ADDRESS,
  REACT_APP_MARKETPLACE_ADDRESS
 } = process.env

const provider = new ethers.providers.Web3Provider(window.ethereum);

const nftAddress = REACT_APP_NFT_ADDRESS;
const marketplaceAddress = REACT_APP_MARKETPLACE_ADDRESS;

const signer = provider.getSigner();

const nftContract = new ethers.Contract(nftAddress, ImageToken.abi, signer);
const marketplaceContract = new ethers.Contract(marketplaceAddress, ImageMarketplace.abi, signer);
const readContract = new ethers.Contract(nftAddress, ImageToken.abi, provider);

const projectId = REACT_APP_IPFS_PROJECT_ID;
const projectKey = REACT_APP_IPFS_PROJECT_KEY;
const authorization = "Basic " + btoa(projectId + ":" + projectKey);


function ConnectWallet() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState();
  const [accountBalance, setAccountBalance] = useState();

  const [isConnected, setIsConnected] = useState(false);

  const [imageUploaded, setImageUploaded] = useState('');
  const [uriArrayUpload, setURIArrayUpload] = useState([]);

  const arrayToken = [];

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

  const uriArray = [];
  const getMyTokens = async () => {
    try {
      let nftTx = await readContract.totalSupply();
      const totalSupply = Web3.utils.hexToNumber(nftTx._hex);

      for (let i = 0; i < totalSupply; i++) {
        let owner = await readContract.ownerOf(i);
        if (owner.toLowerCase() === accountAddress){
          let uriToken = await readContract.tokenURI(i);
          // uriArray.push(uriToken);
          arrayToken.push({
            tokenId: i,
            tokenURI: uriToken,
          });
        }
      }
      setURIArrayUpload(arrayToken);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getMyTokens();
  }, [accountAddress]);

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


      let approveTx = await nftContract.approve(marketplaceAddress, tokenId);
      console.log(`See transaction: https://testnet.bscscan.com/tx/${approveTx.transactionHash}`);
      
      event.target.value = null;
    } catch (err) {
      console.log(err);
    }
  }

  const listNft = async (tokenId) => {
    try {
      let marketTx = await marketplaceContract.listImageNFT(nftAddress, tokenId);
      console.log(marketTx);
            
      let tx = await marketTx.wait();
      console.log(`See transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`);
      console.log(tx);
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
              <div>
                <div className="">
                  <div>
                    <Link style={{textDecoration: 'none'}} target="_blank" href={`https://testnet.bscscan.com/address/${accountAddress}`} ><ListItem>Your address : {accountAddress}</ListItem></Link>
                    <ListItem>Your balance : {accountBalance}</ListItem>

                    <ListItem><h3>Mint your image</h3></ListItem>

                    <ListItem>
                      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                          <ListItem>
                            <form onSubmit={uploadToIPFS}>
                                <ListItem>
                                  <input id="file-upload" type="file" multiple accept="image/*" />
                                </ListItem>

                                <ListItem>
                                  <Button variant="contained" type="submit">Upload image</Button>
                                </ListItem>

                                <ListItem>
                                  <Button variant="contained" onClick={safeMint}>
                                    Mint
                                  </Button>

                                </ListItem>
                            </form>
                        </ListItem>
                        
                        <ListItem><h3>MyNFT</h3></ListItem>
                        {uriArrayUpload.map((item) => (
                          <Grid item xs={3} key={item.tokenId} >
                            <ListItem>
                            <img src={item.tokenURI} alt="imge" style={{ width: 150, height: 250 }}/>
                            </ListItem>

                            <ListItem>
                              <TextField id="outlined-basic" label="Price" variant="outlined" style={{ display: "inline" }}/>
                            </ListItem>

                            <ListItem>
                              <Button variant="contained" style={{ display: "inline" }} onClick={() => listNft(item.tokenId)} >List</Button>
                            </ListItem>
                          </Grid>
                        ))}

                      </Grid>
                    </ListItem>

                  </div>
                
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
