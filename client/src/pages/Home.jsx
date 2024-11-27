import React, { useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "@/redux/dashboard/actions";
import { TeamOutlined, UserOutlined, UserDeleteOutlined, UserSwitchOutlined, UsergroupDeleteOutlined, SyncOutlined, DisconnectOutlined } from '@ant-design/icons';
import DisabledAccountTable from "@/components/dashboard/DisabledAccountTable";
import { setAccountStatus } from "@/redux/model/actions";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homeProps = useSelector(state => state.home)
  useEffect(() => {
    dispatch(getStats());
  }, [getStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getStats());
    }, 60000);
    return () => clearInterval(interval);
  });

  const handleReloadData = () => {
    dispatch(getStats());
  }

  const handleHistoryButtonClick = (account) => {
    navigate(`/account/${account.platform}/${account._id}`);
  }

  const handleSetStatus = (account, status) => {
    dispatch(setAccountStatus(account, status, handleReloadData))
  }

  return (
    <Card title="Dashboard">
      <Row gutter={[16, 16]}>
        <Col md={8} sm={12} >
          <Card >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Total Models" value={homeProps.stats.actorCount} prefix={<TeamOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Unsynced Models" value={homeProps.stats.actorUpdatedCount} prefix={<UsergroupDeleteOutlined />} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={8} sm={12} >
          <Card >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Total Proxies" value={homeProps.stats.proxyCount} prefix={<SyncOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Expired Proxies" value={homeProps.stats.proxyExpiredCount} prefix={<DisconnectOutlined />} />
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
                <Statistic title="F2F Accounts" value={homeProps.stats.f2fCount} prefix={<UserOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="F2F Runnings" value={homeProps.stats.f2fRunningCount} prefix={<UserSwitchOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="F2F Disables" value={homeProps.stats.f2fDisabledCount} prefix={<UserDeleteOutlined />} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={8} sm={12}>
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Fancentro Accounts" value={homeProps.stats.fncCount} prefix={<UserOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Fancentro Runnings" value={homeProps.stats.fncRunningCount} prefix={<UserSwitchOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Fancentro Disables" value={homeProps.stats.fncDisabledCount} prefix={<UserDeleteOutlined />} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={8} sm={12}>
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Fansly Accounts" value={homeProps.stats.fanCount} prefix={<UserOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Fansly Runnings" value={homeProps.stats.fanRunningCount} prefix={<UserSwitchOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Fansly Disables" value={homeProps.stats.fanDisabledCount} prefix={<UserDeleteOutlined />} />
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
        />
      </Row>
    </Card>
  );
};

export default Home;
