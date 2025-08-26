"use client";
import Button from "@/components/ui/button";
import SwapField from "@/components/ui/SwapModel";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import '@solana/wallet-adapter-react-ui/styles.css';
interface Token {
  symbol: string;
  logoURI: string;
  address: string;
}

export default function Home() {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sellToken, setSellToken] = useState<Token | undefined>();
  const [buyToken, setBuyToken] = useState<Token | undefined>();
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  useEffect(() => {
    fetchTokens();
  }, []);

  async function fetchTokens() {
    const response = await axios.get(
      "https://tokens.jup.ag/tokens?tags=verified"
    );
    setTokens(response.data);
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col gap-2 border-[1px] rounded-lg py-4 border-gray-600">
              <div className="flex flex-row justify-between p-2 pt-0 border-b-[1px] border-gray-600 px-4">
                <p className="text-2xl p-2 font-semibold">Connect Wallet</p>
                <WalletMultiButton />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <SwapField
                  label="Selling"
                  value={sellAmount}
                  onChange={setSellAmount}
                  placeholder="0"
                  variant="primary"
                  tokens={tokens}
                  selected={sellToken}
                  setSelected={setSellToken}
                  disable={false}
                />
                <SwapField
                  label="Buying"
                  value={buyAmount}
                  onChange={setBuyAmount}
                  placeholder="0"
                  variant="secondary"
                  tokens={tokens}
                  selected={buyToken}
                  setSelected={setBuyToken}
                  disable={true}
                />
              </div>
              <div className="flex items-center justify-center w-full">
                <Button variant="secondary" size="md" text="Swap" />
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
