import { ethers } from "ethers";

import ImageToken from "./ImageToken.json";
import ImageMarketplace from "./ImageMarketplace.json";

const {
  REACT_APP_IPFS_PROJECT_ID,
  REACT_APP_IPFS_PROJECT_KEY,
  REACT_APP_NFT_ADDRESS,
  REACT_APP_MARKETPLACE_ADDRESS,
} = process.env;

const baseImage = "https://ngandt.infura-ipfs.io/ipfs/";

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

export {
  invalidAddress,
  nftAddress,
  nftContract,
  marketplaceContract,
  authorization,
  provider,
  signer,
  baseImage
};
