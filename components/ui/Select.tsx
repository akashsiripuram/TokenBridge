interface Token {
  symbol: string;
  logoURI: string;
  address: string;
}
interface TokenProps {
  tokens: Token[];
}
export default function Select({ tokens }: TokenProps) {
  return (
    <div className="overflow-y-scroll h-[100px]">
      {tokens.map((token) => (
        <div id={token.address} className="flex flex-row">
          <img className="h-10 w-10 rounded-full mr-2" src={token.logoURI} />
          <p>{token.symbol}</p>
        </div>
      ))}
    </div>
  );
}
