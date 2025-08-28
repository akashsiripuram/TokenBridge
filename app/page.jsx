"use client";
import Button from "@/components/ui/button";
import SwapField from "@/components/ui/SwapModel";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import "@solana/wallet-adapter-react-ui/styles.css";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { toast, Toaster } from "sonner";

export default function Home() {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tokens, setTokens] = useState([]);
  const [sellToken, setSellToken] = useState();
  const [buyToken, setBuyToken] = useState();
  const [qouteResponse, setQuoteResponse] = useState();
  const [userBalance, setUserBalance] = useState();

  //wallet object
  const wallet = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    if (sellToken && wallet.publicKey) {
      checkUserBalance(sellToken).then(setUserBalance);
    }
  }, [sellToken, wallet.publicKey]);
  useEffect(() => {
    fetchTokens();
  }, []);
  //fetching tokens
  async function fetchTokens() {
    const response = await axios.get(
      "https://tokens.jup.ag/tokens?tags=verified"
    );
    setTokens(response.data);
  }

  //balances
  //@ts-ignore
  const tokenBalance = async (sellToken) => {
    try {
      if (sellToken.symbol == "SOL") {
        //@ts-ignore
        const balanceLamports = await connection.getBalance(wallet.publicKey);
        return balanceLamports / LAMPORTS_PER_SOL;
      } else {
        const tokenAddress = await getAssociatedTokenAddress(
          new PublicKey(sellToken.address),
          //@ts-ignore
          wallet.publicKey
        );
        const tokenAccountInfo = await getAccount(connection, tokenAddress);

        const balanceInToken =
          Number(tokenAccountInfo.amount) / Math.pow(10, sellToken.decimals);
        return balanceInToken;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  };

  //user balances
  //@ts-ignore
  async function checkUserBalance(token) {
    const userBalance = await tokenBalance(token);
    return userBalance;
  }

  useEffect(() => {
    if (tokens.length > 0 && !sellToken && !buyToken) {
      const sol = tokens.find((t) => t.symbol === "SOL");
      const usdc = tokens.find((t) => t.symbol === "USDC");

      if (sol) setSellToken(sol);
      if (usdc) setBuyToken(usdc);
    }
  }, [tokens]);
  const fetchQouteResponses = useCallback(async () => {
    if (!sellToken || !buyToken) return;

    const parsedSellAmount = parseFloat(sellAmount);
    const slippageBps = 0.5 * 100;
    const apiUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${
      sellToken.address
    }&outputMint=${buyToken.address}&amount=${Math.floor(
      parsedSellAmount * Math.pow(10, sellToken.decimals)
    )}&slippageBps=${slippageBps}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.data) {
        setQuoteResponse(response.data);
        const outputAmount = calculateOutputAmout(
          response.data.outAmount,
          buyToken
        );
        setBuyAmount(outputAmount.toFixed(6));
        return response.data;
      }
    } catch (err) {
      console.log(err);
    }
  }, [sellToken, buyToken, sellAmount]);
  //@ts-ignore
  const calculateOutputAmout = (amt, token) => {
    if (
      (token.symbol === "USDC" || token.symbol === "USDT") &&
      token.address.startsWith("EPj")
    ) {
      return amt / Math.pow(10, 6);
    }

    return amt / Math.pow(10, token.decimals);
  };
  const handleSwap = async () => {
    if (
      !sellToken ||
      !buyToken ||
      !wallet.publicKey ||
      !wallet.signTransaction
    ) {
      return;
    }

    if (
      parseFloat(sellToken.balance) <= 0 ||
      parseFloat(sellAmount) > parseFloat(userBalance)
    ) {
      toast.error("Insuffiecient funds");
      return;
    }

    try {
      // Fetch the quote response for the swap
      const quoteResponse = await fetchQouteResponses();

      if (!quoteResponse) {
        return;
      }

      // Request the swap transaction from Jupiter API
      const {
        data: { swapTransaction },
      } = await axios.post("https://quote-api.jup.ag/v6/swap", {
        quoteResponse,
        userPublicKey: wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
      });

      // Deserialize the swap transaction from base64
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign the transaction with the connected wallet
      const signedTransaction = await wallet.signTransaction(transaction);

      // Serialize the signed transaction
      const rawTransaction = signedTransaction.serialize();

      // Send the signed transaction to the Solana blockchain
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm the transaction
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );
    } catch (error) {
      console.error("Error signing or sending the transaction:", error);
    }
  };
  useEffect(() => {
    fetchQouteResponses();
  }, [sellAmount, sellToken, buyToken]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster />
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
          <Button
            variant="secondary"
            size="md"
            text="Swap"
            onClick={handleSwap}
          />
        </div>
      </div>
    </div>
  );
}
