import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { ethers } from "ethers";
import axios from 'axios';

import '../css/NotFound.css';
import MyNft from './MyNft';
import Marketplace from './Marketplace';
import Home from './Home';
import Logo from '../assets/Logo.svg'
import Footer from "./Footer";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import Metamask from "./Metamask";


export default function NavBar(props) {

  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState([]);
  const [token, setToken] = useState();
  const [haveMetamask, sethaveMetamask] = useState(true);
  let provider = null;

  const reloadPage = async () => {
    window.location.reload()
  }
  
  useEffect(() => {
    if (window.ethereum) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      provider = new ethers.providers.Web3Provider(window.ethereum);
      if (haveMetamask || provider !== null) {
        connectWallet();
        return;
      }
    } else {
      sethaveMetamask(false);
    }
  }, []);
  
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
        setUser(response.data.result.user);
        setToken(response.data.result.accessToken);
      }).catch(function(error) {
        console.log(error);
      });
    } catch (err) {
      console.log(err);
      setIsConnected(false);
    }
  };

  localStorage.setItem('tokenData', token);
  const wholeToken = localStorage.getItem('token');

  const userdata = {
    name: user.username,
    address: user.walletAddress,
    birthday: user.birthday,
    profile: user.profile,
    token: wholeToken,
    phone: user.phone,
    about: user.about,
    addressUser: user.address
  };
  
  return (
    <>
    {haveMetamask ? (
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
                  (<li><Link to={'/profile'} >
                    <img src={user.profile}
                      className="rounded-circle mb-1"
                      style={{borderRadius: '50%',
                      width: 50,
                      height: 50,
                      display: "block"}}
                      alt="avatar"
                    />
                    </Link>
                  </li>
                  )
                : (<li><Link onClick={() => connectWallet()} to={'/'}>Connect Wallet</Link></li>)}
              </ul>
            </div>
            <Routes>
                <Route  path='/' element={<Home />} />
                <Route  path='/my-nft' element={<MyNft address={accountAddress} />} />
                <Route  path='/marketplaces' element={<Marketplace balance={balance} address={accountAddress} />} />
                <Route  path='/profile' element={<Profile user={userdata} />} />
                <Route path='/update' element={<UpdateProfile user={userdata} />} />
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
      ) : (
        <Metamask />
      )}
    </>
  );
}
