import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "@/redux/dashboard/actions";

export const Home = () => {
  const dispatch = useDispatch()
  const homeProps = useSelector(state => state.home)
  useEffect(() => {
    dispatch(getStats())
  }, [getStats]);

  return (
    <Card title="Dashboard">
      <Row gutter={16}>
        <Col md={6} sm={12} >
          <Card >
            <Statistic title="Models Count" value={homeProps.stats.actorCount} />
          </Card>
        </Col>
        {/* <Col md={6} sm={12}>
          <Card >
            <Statistic title="Total Discord" value={homeProps.stats.discordCount} />
          </Card>
        </Col> */}
        <Col md={6} sm={12} >
          <Card >
            <Statistic title="Proxies Count" value={homeProps.stats.proxyCount} />
          </Card>
        </Col>
        <Col md={6} sm={12}>
          <Card>
            <Statistic title="F2F Accounts" value={homeProps.stats.f2fCount} />
          </Card>
        </Col>
        <Col md={6} sm={12}>
          <Card>
            <Statistic title="FNC Accounts" value={homeProps.stats.fncCount} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Home;
