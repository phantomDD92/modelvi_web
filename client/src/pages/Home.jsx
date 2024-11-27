import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "@/redux/dashboard/actions";
import { TeamOutlined, UserOutlined, UserDeleteOutlined } from '@ant-design/icons';
import StatsBox from "@/components/dashboard/StatsBox";

export const Home = () => {
  const dispatch = useDispatch()
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

  return (
    <Card title="Dashboard">
      <Row gutter={[16, 16]}>
        <Col md={8} sm={12} >
          <Card >
            <Statistic title="Models Count" value={homeProps.stats.actorCount} />
          </Card>
        </Col>
        <Col md={8} sm={12} >
          <Card >
            <Statistic title="Proxies Count" value={homeProps.stats.proxyCount} />
          </Card>
        </Col>
        <Col md={8} sm={0} >
        </Col>
        <Col md={8} sm={12}>
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="F2F Accounts" value={homeProps.stats.f2fCount} prefix={<TeamOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="F2F Runnings" value={homeProps.stats.f2fRunningCount} prefix={<UserOutlined />} />
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
                <Statistic title="Fancentro Accounts" value={homeProps.stats.fncCount} prefix={<TeamOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Fancentro Runnings" value={homeProps.stats.fncRunningCount} prefix={<UserOutlined />} />
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
                <Statistic title="Fansly Accounts" value={homeProps.stats.fanCount} prefix={<TeamOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Fansly Runnings" value={homeProps.stats.fanRunningCount} prefix={<UserOutlined />} />
              </Col>
              <Col span={8}>
                <Statistic title="Fansly Disables" value={homeProps.stats.fanDisabledCount} prefix={<UserDeleteOutlined />} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Home;
