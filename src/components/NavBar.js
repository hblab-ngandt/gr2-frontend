import { React, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { ethers } from "ethers";

import '../css/NotFound.css';
import MyNft from './MyNft';
import Marketplace from './Marketplace';
import Logo from '../assets/Logo.svg'

const provider = new ethers.providers.Web3Provider(window.ethereum);


export default function NavBar(props) {

  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [isConnected, setIsConnected] = useState(false);


  const reloadPage = async () => {
    window.location.reload()
  }

  const connectWallet = async () => {
    try {
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
    <div class="bg-purple">
      <div class="stars">
        <div class="custom-navbar">
          <div class="brand-logo">
              <img src={Logo} width="100px" alt='navbar' onClick={() => reloadPage()} />
          </div>
          <Router>
          <div class="navbar-links">
            <ul>
              <li><Link exact to={'/'} className='btn-request'>Home</Link></li>
              <li><Link exact to={'/marketplaces'} >Marketplace</Link></li>
              <li><Link exact to={'/my-nft'} >My NFT</Link></li>
              { isConnected ? 
                (<li><Link exact to={'/'} >{balance}</Link></li>) 
              : (<li><Link onClick={() => connectWallet()} to={'/marketplaces'}>Connect Wallet</Link></li>)}
            </ul>
          </div>
          <Routes>
              <Route  path='/' element={<NavBar />} />
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
    </div>
  );
}
