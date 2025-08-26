// components/TokenModal.tsx
"use client";
import { useState } from "react";

interface Token {
  symbol: string;
  logoURI: string;
  address: string;
}

interface TokenModalProps {
  tokens: Token[];
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export default function TokenModal({ tokens, onSelect, onClose }: TokenModalProps) {
  const [search, setSearch] = useState("");

  const filtered = tokens.filter((t) =>
    t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1b1f2a] rounded-xl w-[400px] max-h-[80vh] p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-white">Select a token</h2>
          <button onClick={onClose} className="text-white text-2xl">×</button>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search token..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 px-3 py-2 rounded-md bg-[#0e131b] text-white outline-none"
        />

        {/* Token list area */}
        <div className="overflow-y-scroll flex-1 min-h-[250px]">
          {filtered.length > 0 ? (
            filtered.map((token) => (
              <div
                key={token.address}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2f3c] rounded-md cursor-pointer"
              >
                <img src={token.logoURI} className="h-8 w-8 rounded-full" />
                <span className="text-white font-medium">{token.symbol}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No tokens found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
