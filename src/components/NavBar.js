import { React, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { ethers } from "ethers";
import axios from 'axios';

import '../css/NotFound.css';
import MyNft from './MyNft';
import Marketplace from './Marketplace';
import Home from './Home';
import Logo from '../assets/Logo.svg'
import Footer from "./Footer";

const provider = new ethers.providers.Web3Provider(window.ethereum);


export default function NavBar(props) {

  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState();

  const reloadPage = async () => {
    window.location.reload()
  }

  const connectWallet = async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const acc = ethers.utils.getAddress(accounts[0]);
      setAccountAddress(acc);
      let balanceAddress = await provider.getBalance(accounts[0]);
      setBalance(ethers.utils.formatEther(balanceAddress));
      setIsConnected(true);
      axios.post('http://localhost:8626/api/login', {
        walletAddress: acc,
      }).then(function(response) {
        setUsername(response.data.data.username);
      }).catch(function(error) {
        console.log(error);
      });
    } catch (err) {
      setIsConnected(false);
    }
  };
  return (
    <>
    <div class="bg-purple">
      <div class="stars">
        <div class="custom-navbar">
          <div class="brand-logo">
              <img src={Logo} width="100px" alt='navbar' onClick={() => reloadPage()} />
          </div>
          <Router>
          <div class="navbar-links">
            <ul>
              <li><Link to={'/'} className='btn-request'>Home</Link></li>
              <li><Link to={'/marketplaces'} >Marketplace</Link></li>
              <li><Link to={'/my-nft'} >My NFT</Link></li>
              { isConnected ? 
                (<li>
                  <img src="https://mdbcdn.b-cdn.net/img/new/avatars/8.webp"
                    class="rounded-circle mb-1"
                    style={{width: '60px', alignContent: 'center'}}
                    alt="avatar"
                  />
                  <a href="/#">{username}</a>
                </li>
                )
              : (<li><Link onClick={() => connectWallet()} to={'/'}>Connect Wallet</Link></li>)}
            </ul>
          </div>
          <Routes>
              <Route  path='/' element={<Home />} />
              <Route  path='/my-nft' element={<MyNft address={accountAddress} />} />
              <Route  path='/marketplaces' element={<Marketplace balance={balance} address={accountAddress} />} />
            </Routes>
          </Router>
        </div>
        <div class="central-body">
        </div>
        <div class="objects">
          <img class="object_rocket" src="http://salehriaz.com/404Page/img/rocket.svg" width="40px" alt='navbar' />
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
}
