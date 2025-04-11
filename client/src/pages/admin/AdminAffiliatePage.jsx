import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import { Col, Row } from "antd";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { StatisticCard } from "@/components/comment";
import { PageMetaData } from "@/components/common";
import { AffiliateAdminTable } from "@/components/affiliate";
import { loadAffiliatesForAdmin } from "@/redux/admin/actions";
import AffiliateClickChart from "@/components/affiliate/AffiliateClickChart";
import AffiliateCommissionChart from "@/components/affiliate/AffiliateComissionChart";

const AdminAffiliatePage = () => {

  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("day");

  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();

  const affiliateAgencies = useSelector(state => state.admin.affiliateAgencies);
  const affiliateStatsByAgency = useSelector(state => state.admin.affiliateStatsByAgency);
  const affiliateStatsByTime = useSelector(state => state.admin.affiliateStatsByTime);
  const transactionStatsByAgency = useSelector(state => state.admin.transactionStatsByAgency);
  const transactionStatsByTime = useSelector(state => state.admin.transactionStatsByTime);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  useEffect(() => {
    setLoading(true);
    dispatch(loadAffiliatesForAdmin(time, () => setLoading(false)));
  }, [time]);

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const getTableSource = (agencies, affStatsByAgencies, tranStatsByAgencies) => {
    return agencies.map(agency => {
      const affStat = affStatsByAgencies.find(element => element._id == agency._id);
      const tranStat = tranStatsByAgencies.find(element => element._id == agency._id);
      const referees = agencies.filter(element => element.referrer?._id == agency._id);
      return ({ ...agency, clicks: affStat?.totalClicks || 0, attempts: affStat?.totalAttempts || 0, completions: affStat?.totalCompletions || 0, referees: referees.length, earnings: tranStat?.totalCommission || 0 })
    })
  }

  return (
    <>
      <PageMetaData title="Affiliates" admin />
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <StatisticCard
            title="Referrers"
            value={affiliateStatsByAgency.length}
          />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Referees"
            value={affiliateAgencies.filter(agency => agency.referrer != undefined).length}
          />
        </Col>
        <Col span={4}>
          <StatisticCard title="Total Commissions" />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Total Clicks"
            value={affiliateStatsByAgency.reduce((sum, value) => sum += value.totalClicks, 0)}
          />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Total Attempts"
            value={affiliateStatsByAgency.reduce((sum, value) => sum += value.totalAttempts, 0)}
          />
        </Col>
        <Col span={4}>
          <StatisticCard
            title="Total Registrations"
            value={affiliateStatsByAgency.reduce((sum, value) => sum += value.totalCompletions, 0)}
          />
        </Col>
        <Col span={12}>
          <AffiliateClickChart
            time={time}
            dataSource={affiliateStatsByTime}
            onTimeChange={value => setTime(value)}
          />
        </Col>
        <Col span={12}>
          <AffiliateCommissionChart
            time={time}
            dataSource={transactionStatsByTime}
            onTimeChange={value => setTime(value)}
          />
        </Col>
        <Col span={24}>
          <AffiliateAdminTable
            dataSource={getTableSource(affiliateAgencies, affiliateStatsByAgency, transactionStatsByAgency)}
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              onChange: handleChangePagination
            }}
            actions={{

            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default AdminAffiliatePage;

