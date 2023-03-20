import { React, useState } from "react";
import { ethers } from "ethers";

import '../css/NotFound.css';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export default function Connect () {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState();
  const [balance, setBalance] = useState();
  const [isConnected, setIsConnected] = useState(false);

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
  <body class="bg-purple">       
      <div class="stars">
          <div class="custom-navbar">
          </div>
          <div class="central-body">
              {/* <img class="image-404" src="http://salehriaz.com/404Page/img/404.svg" width="300px" alt="404" /> */}
              <span class="image-404" id="text-error">LOOK LIKE YOU DO NOT</span>
              <br></br>
              <span class="image-404">CONNECT METAMASK</span>
              <a href="/#" class="btn-connect" target="_blank" rel="noreferrer" onClick={connectWallet}>Connect Wallet</a>
          </div>
          <div class="objects">
              <img class="object_rocket" src="http://salehriaz.com/404Page/img/rocket.svg" width="40px" alt="404" />
              <div class="earth-moon">
                  <img class="object_earth" src="http://salehriaz.com/404Page/img/earth.svg" width="100px" alt="404" />
                  <img class="object_moon" src="http://salehriaz.com/404Page/img/moon.svg" width="80px" alt="404" />
              </div>
              <div class="box_astronaut">
                  <img class="object_astronaut" src="http://salehriaz.com/404Page/img/astronaut.svg" width="140px" alt="404" />
              </div>
          </div>
          <div class="glowing_stars">
              <div class="star"></div>
              <div class="star"></div>
              <div class="star"></div>
              <div class="star"></div>
              <div class="star"></div>
          </div>
      </div>
  </body>
  );
}
