import { Card, Statistic } from "antd";
import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

const AffiliateLink = ({ referralCode }) => {

  const [copied, setCopied] = useState(false);
  const getReferralLink = (code) => code ? `https://modelvi.com?ref=${code}` : 'https://modelvi.com'
  const handleCopyClick = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard.writeText(getReferralLink(referralCode))
      .then(() => { })
      .catch(() => { })
  }

  return (
    <Card>
      <Statistic
        title={<h3 className="text-xl">Affiliate Link</h3>}
        value={referralCode}
        formatter={value =>
          <div className="flex gap-4 items-center">
            <span className="text-lg">{getReferralLink(value)}</span>
            <button
              onClick={handleCopyClick}
              className="p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={copied ? "Copied!" : "Copy to clipboard"}
              disabled={copied}
            >
              {copied ? (
                <LuCheck className="text-base text-green-500" />
              ) : (
                <LuCopy className="text-base text-gray-600 hover:text-gray-900" />
              )}
            </button>
          </div>}
      />
    </Card>
  )
}

export default AffiliateLink;