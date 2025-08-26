"use client";
import Button from "@/components/ui/button";
import SwapField from "@/components/ui/SwapModel";
import axios from "axios";
import { useEffect, useState } from "react";

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
    <div className="flex flex-1 items-center justify-center h-screen">
      <div className="flex flex-col gap-2 border-[1px] rounded-lg p-4 border-gray-600">
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
        <Button variant="secondary" size="md" text="Swap" />
      </div>
    </div>
  );
}
