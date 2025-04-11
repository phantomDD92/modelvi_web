import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import { Col, Row } from "antd";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { StatisticCard } from "@/components/comment";
import { PageMetaData } from "@/components/common";
import { AffiliateAdminTable } from "@/components/affiliate";

const AdminAffiliatePage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  useEffect(() => {

  }, []);

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  return (
    <>
      <PageMetaData title="Affiliates" admin />
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <StatisticCard title="Referrers" />
        </Col>
        <Col span={4}>
          <StatisticCard title="Referees" />
        </Col>
        <Col span={4}>
          <StatisticCard title="Total Commissions" />
        </Col>
        <Col span={4}>
          <StatisticCard title="Total Clicks" />
        </Col>
        <Col span={4}>
          <StatisticCard title="Total Attempts" />
        </Col>
        <Col span={4}>
          <StatisticCard title="Total Registrations" />
        </Col>
        <Col span={24}>
          <AffiliateAdminTable
            dataSource={[]}
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

