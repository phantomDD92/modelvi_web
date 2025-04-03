import { cryptoNetworkColors } from '@/data/crypto';
import { Button, QRCode } from 'antd';
import { LuCopy } from 'react-icons/lu';

const DepositAddress = ({ address, currency, minAmount, minFiat }) => {

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
      .then(() => { }).catch(() => { })
  }

  const getNetworkColor = (network) => cryptoNetworkColors[`${network}`] || "bg-zinc-500";
  return (
    <div className='flex items-center gap-8'>
      <QRCode
        errorLevel='H'
        value={address}
        icon={`https://nowpayments.io${currency?.logo_url}`}
      />
      <div className='flex-col gap-8'>
        <div className="p-2 flex justify-start items-center">
          <img src={`https://nowpayments.io${currency?.logo_url}`} className="w-8 h-8" />
          <div className="mx-3">
            <div className="leading-5">
              <span className="mr-2 font-medium">{currency?.ticker}</span>
              <span className={`uppercase py-[1px] px-[8px] text-xs text-white rounded-sm ${getNetworkColor(currency?.network)}`}>{currency?.network}</span>
            </div>
            <div className="leading-5">{currency?.name}</div>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <span className='font-medium'>{address}</span>
          <Button icon={<LuCopy />} type='text' onClick={handleCopyAddress} />
        </div>
        <div>
          {`Minimum amount: ${(minAmount || 0).toFixed(5)} ${currency?.ticker} ($${(minFiat || 0).toFixed(5)})`}
        </div>
      </div>
    </div>
  )
}

export default DepositAddress;