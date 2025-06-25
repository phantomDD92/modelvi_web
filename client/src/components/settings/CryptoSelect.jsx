import { cryptoCurrencies, cryptoNetworkColors } from "@/data/crypto";
import { Select } from "antd";

const CryptoSelect = (params) => {
  const getNetworkColor = (network) => cryptoNetworkColors[`${network}`] || "bg-zinc-500";
  const getOptions = () => cryptoCurrencies.map(currency => ({
    value: currency.code,
    label: <div className="p-2 flex justify-start items-center">
      <img src={`https://nowpayments.io${currency.logo_url}`} className="w-8 h-8" />
      <div className="mx-3">
        <div className="leading-5">
          <span className="mr-2 font-medium">{currency.ticker}</span>
          <span className={`uppercase py-[1px] px-[8px] text-xs text-white rounded-sm ${getNetworkColor(currency.network)}`}>{currency.network}</span>
        </div>
        <div className="leading-5">{currency.name}</div>
      </div>
    </div>
  }));
  return (
    <Select
      {...params}
      className="min-h-[60px]"
      options={getOptions()}
      
    />
  )
}

export default CryptoSelect;
