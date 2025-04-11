import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "@/redux/dashboard/actions";
import { TeamOutlined, UserOutlined, UserDeleteOutlined, UserSwitchOutlined, UsergroupDeleteOutlined, SyncOutlined, DisconnectOutlined } from '@ant-design/icons';
import DisabledAccountTable from "@/components/dashboard/DisabledAccountTable";
import { updateAccountStatus } from "@/redux/model/actions";
import { useNavigate } from "react-router-dom";
import PageMetaData from "@/components/common/PageMetaData";

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homeProps = useSelector(state => state.home)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getStats(() => setLoading(false)));
  }, [getStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      dispatch(getStats(() => setLoading(false)));
    }, 60000);
    return () => clearInterval(interval);
  });

  const handleReloadData = () => {
    setLoading(true);
    dispatch(getStats(() => setLoading(false)));
  }

  const handleHistoryButtonClick = (account) => {
    navigate(`/account/${account.platform}/${account._id}`);
  }

  const handleSetStatus = (account, status) => {
    dispatch(updateAccountStatus(account, status, handleReloadData))
  }

  return (
    <>
      <PageMetaData title="Dashboard" />
      <Card title="Dashboard">
        <Row gutter={[16, 16]}>
          <Col md={8} sm={12} >
            <Card >
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Total Models" loading={loading} value={homeProps.stats.actorCount} prefix={<TeamOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Unsynced Models" loading={loading} value={homeProps.stats.actorUpdatedCount} prefix={<UsergroupDeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={8} sm={12} >
            <Card >
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Total Proxies" loading={loading} value={homeProps.stats.proxyCount} prefix={<SyncOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Expired Proxies" loading={loading} value={homeProps.stats.proxyExpiredCount} prefix={<DisconnectOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={8} sm={0} >
          </Col>
          <Col md={8} sm={12}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="F2F Accounts" loading={loading} value={homeProps.stats.f2fCount} prefix={<UserOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="F2F Runnings" loading={loading} value={homeProps.stats.f2fRunningCount} prefix={<UserSwitchOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="F2F Disables" loading={loading} value={homeProps.stats.f2fDisabledCount} prefix={<UserDeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={8} sm={12}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Fancentro Accounts" loading={loading} value={homeProps.stats.fncCount} prefix={<UserOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Fancentro Runnings" loading={loading} value={homeProps.stats.fncRunningCount} prefix={<UserSwitchOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Fancentro Disables" loading={loading} value={homeProps.stats.fncDisabledCount} prefix={<UserDeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={8} sm={12}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Fansly Accounts" loading={loading} value={homeProps.stats.fanCount} prefix={<UserOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Fansly Runnings" loading={loading} value={homeProps.stats.fanRunningCount} prefix={<UserSwitchOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Fansly Disables" loading={loading} value={homeProps.stats.fanDisabledCount} prefix={<UserDeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={8} sm={12}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Fanvue Accounts" loading={loading} value={homeProps.stats.fanvueCount} prefix={<UserOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Fanvue Runnings" loading={loading} value={homeProps.stats.fanvueRunningCount} prefix={<UserSwitchOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Fanvue Disables" loading={loading} value={homeProps.stats.fanvueDisabledCount} prefix={<UserDeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={8} sm={12}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Knky Accounts" loading={loading} value={homeProps.stats.knkyCount} prefix={<UserOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Knky Runnings" loading={loading} value={homeProps.stats.knkyRunningCount} prefix={<UserSwitchOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Knky Disables" loading={loading} value={homeProps.stats.knkyDisabledCount} prefix={<UserDeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={8} sm={12}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Maloum Accounts" loading={loading} value={homeProps.stats.maloumCount} prefix={<UserOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Maloum Runnings" loading={loading} value={homeProps.stats.maloumRunningCount} prefix={<UserSwitchOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="Maloum Disables" loading={loading} value={homeProps.stats.maloumDisabledCount} prefix={<UserDeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="mt-8">
          <DisabledAccountTable
            accounts={homeProps.disabledAccounts}
            onHistory={handleHistoryButtonClick}
            onStatusChange={handleSetStatus}
            loading={loading}
          />
        </Row>
      </Card>
    </>
  );
};

export default AdminDashboardPage;
