import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "antd";
import { AffiliateLink, AffiliateRevenueChart, AffiliateTrackingChart } from "@/components/affiliate";
import { StatisticCard } from "@/components/comment";
import { PageMetaData } from "@/components/common"
import { getAffiliate } from "@/redux/v2/actions";

const AffiliatePage = () => {
  const dispatch = useDispatch();
  const referralCode = useSelector(state => state.v2.referralCode);
  const affiliate = useSelector(state => state.v2.affiliate);
  useEffect(() => {
    dispatch(getAffiliate());
  }, [getAffiliate]);

  return (
    <>
      <PageMetaData title="Affiliate" />
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <AffiliateLink
            referralCode={referralCode} />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Affiliate Earnings"
            value={affiliate.earnings?.totalEarnings}
            prefix="$"
          />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Clicks"
            value={affiliate.referrals?.totalClicks || 0}
          />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Attempted Registrations"
            value={affiliate.referrals?.totalAttempts || 0}
          />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Finalized Registrations"
            value={affiliate.referrals?.totalCompletions || 0}
          />
        </Col>
        <Col span={12}>
          <AffiliateTrackingChart
            dataSource={affiliate.referralStats}
          />
        </Col>
        <Col span={12}>
          <AffiliateRevenueChart
            dataSource={affiliate.earningStats}
          />
        </Col>
      </Row>
    </>
  )
}

export default AffiliatePage;
