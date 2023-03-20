import { React, useEffect, useState } from "react";

import "./App.css";
import NavBar from "./components/NavBar";

function ConnectWallet() {
  const [haveMetamask, sethaveMetamask] = useState(true);

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

  return (
    <div>
      <header className="head">
        {haveMetamask ? (
          <div>
            <NavBar />
          </div>
        ) : (
          <h3>Please install Metamask to continue</h3>
        )}
      </header>
    </div>
  );
}

export default ConnectWallet;
