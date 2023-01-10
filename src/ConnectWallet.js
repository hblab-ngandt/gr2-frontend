import { React, useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import "./App.css";
import { Button, Box, Tab, Tabs, Typography } from "@mui/material";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { create } from "ipfs-http-client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Web3 from "web3";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import ImageToken from "./ImageToken.json";
import ImageMarketplace from "./ImageMarketplace.json";
import { db } from "./Firebase";

const {
  REACT_APP_IPFS_PROJECT_ID,
  REACT_APP_IPFS_PROJECT_KEY,
  REACT_APP_NFT_ADDRESS,
  REACT_APP_MARKETPLACE_ADDRESS,
} = process.env;

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
  const [tabIndex, setTabIndex] = useState(0);

  const [isConnected, setIsConnected] = useState(false);

  const [arrayListNFT, setArrayListNFT] = useState([]);
  const [uri, setUri] = useState("");

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

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const [marketplaces, setMarketplaces] = useState([]);
  const [nfts, setNfts] = useState([]);

  const fetchData = async () => {
    try {
      const MPRef = collection(db, "marketplaces");
      const docsSnap = await getDocs(MPRef);
      const documents = docsSnap.docs.map((doc) => ({
        ...doc.data(), // destructure
        id: doc.id,
      }));
      setMarketplaces(documents);

      const NFTRef = collection(db, "nfts");
      const docsSnapNft = await getDocs(NFTRef);
      const documentsNft = docsSnapNft.docs.map((doc) => ({
        ...doc.data(), // destructure 
        id: doc.id,
      }));
      setNfts(documentsNft);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await provider.send("eth_requestAccounts", []);
      // let balanceAcc = await provider.getBalance(accounts[0]);
      // let balance = ethers.utils.formatEther(balanceAcc);

      setAccountAddress(accounts[0]);
      // setAccountBalance(balance);
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

    const url = "https://ngandt.infura-ipfs.io/ipfs/" + result.path;
    console.log(url);
    setUri(url);
    form.reset();
  };

  const safeMint = async (event) => {
    try {
      let nftTx = await nftContract.safeMint(accountAddress, uri);

      let tx = await nftTx.wait();
      console.log(
        `Mintes successfully, see transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`
      );
      const tokenId = Web3.utils.hexToNumber(tx.logs[0].topics[3]);
      console.log(tokenId);

      let approveTx = await nftContract.approve(marketplaceAddress, tokenId);
      console.log(
        `Approved successfully, see transaction: https://testnet.bscscan.com/tx/${approveTx.hash}`
      );

      const data = {
        address: accountAddress,
        tokenId: tokenId,
        tokenURI: uri,
      };

      await addDoc(collection(db, "nfts"), data);

      event.target.value = null;
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const listNft = async (event) => {
    try {
      let marketTx = await marketplaceContract.listImageNFT(
        nftAddress,
        arrayListNFT.tokenId,
        arrayListNFT.price
      );

      let tx = await marketTx.wait();
      console.log(
        `Listed successfully , see transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`
      );

      const data = ethers.utils.defaultAbiCoder.decode(
        ["uint256", "address", "address"],
        tx.logs[1].data
      );
      const price = Web3.utils.hexToNumber(data[0]);
      const marketId = Web3.utils.hexToNumber(tx.logs[1].topics[1]);
      const tokenId = Web3.utils.hexToNumber(tx.logs[1].topics[2]);

      const marketItem = {
        marketId: marketId,
        tokenId: tokenId,
        tokenUri: arrayListNFT.uri,
        price: price,
        seller: data[1],
        owner: data[2],
      };

      // add to firestore
      const newDoc = await addDoc(collection(db, "marketplaces"), marketItem);
      console.log("new document list id: ", newDoc.id);

      const q = query(collection(db, "nfts"), where("tokenId", "==", tokenId));
      const querySnapshot = await getDocs(q);
      let docId = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
      const docRef = doc(db, "nfts", docId[0].id);
      deleteDoc(docRef)
        .then(() => {
          console.log("Deleted your nft successfully")
        })
        .catch((err) => console.log(err));
      
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const buyNft = async (item) => {
    try {
      let buyTx = await marketplaceContract.buyImageNFT(item.marketId);

      let tx = await buyTx.wait();
      console.log(
        `Buyed successfully, see transaction: https://testnet.bscscan/tx/${tx.transactionHash}`
      );
      console.log(tx);

      const dataNft = {
        address: item.seller,
        tokenId: item.tokenId,
        tokenUri: item.tokenUri,
      }

      await addDoc(collection(db, "nfts"), dataNft);

      const newNfts = marketplaces.filter(ele => ele.id !== item.id)
      setMarketplaces(newNfts);
      const docRef = doc(db, "marketplaces", item.id);
      deleteDoc(docRef)
        .then(() => {
          console.log("Bought Successfully")
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  const cancelNft = async (item) => {
    try {
      let cancelTx = await marketplaceContract.cancelListImageNFT(item.marketId);

      let tx = await cancelTx.wait();
      console.log(
        `Cancelled successfully, see transaction: https://testnet.bscscan.com/tx/${tx.transactionHash}`
      );

      if (tx.transactionHash) {
        const dataNft = {
          address: item.seller,
          tokenId: item.tokenId,
          tokenUri: item.tokenUri,
        }

        await addDoc(collection(db, "nfts"), dataNft);

        const newNfts = marketplaces.filter(ele => ele.id !== item.id)
        setMarketplaces(newNfts);
        const docRef = doc(db, "marketplaces", item.id);
        deleteDoc(docRef)
          .then(() => {
            console.log("Deleted Successfully")
          })
          .catch((err) => console.log(err));
        
      } else {
        console.log(
          "Transaction hash not found, transaction cancelled"
        );
      }
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
                          {nfts.map((item) => (
                            <>
                            {item.address === accountAddress ? (
                              <Grid item xs={3} key={item.tokenId}>
                                <ListItem>
                                                            <img
                                                              src={item.tokenURI}
                                                              alt="imge"
                                                              style={{ width: 150, height: 250 }}
                                                            />
                                 </ListItem>
                            
                                  <ListItem>
                                                            <TextField
                                                              id="outlined-basic"
                                                              label="Price"
                                                              variant="outlined"
                                                              style={{ display: "inline" }}
                                                              onChange={(e) =>
                                                                setArrayListNFT({
                                                                  tokenId: item.tokenId,
                                                                  price: e.target.value,
                                                                  uri: item.tokenURI,
                                                                })
                                                              }
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
                                  `</ListItem>
                              </Grid>
                            ) : null}
                            </>
                          ))}
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
                                      <img
                                        src={item.tokenUri}
                                        alt="imge"
                                        style={{
                                          width: 150,
                                          height: 250,
                                          paddingRight: 60,
                                        }}
                                      />
                                    </ListItem>

                                    {accountAddress ===
                                    item.seller.toLowerCase() ? (
                                      <ListItem>Seller : You</ListItem>
                                    ) : (
                                      <ListItem>
                                        Seller : {item.seller}
                                      </ListItem>
                                    )}
                                    <ListItem>Owner : Marketplace</ListItem>
                                    <ListItem>Price : {item.price}</ListItem>

                                    {accountAddress ===
                                    item.seller.toLowerCase() ? (
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
