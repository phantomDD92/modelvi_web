import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessagesSquare, User, Users, UserCog } from "lucide-react";
import { Card, Row, Col } from "antd";

import { PageMetaData } from "@/components/common";
import { StatsBox, DisabledAccountTable } from "@/components/dashboard";
import { getStatistics, updateAccountStatus } from "@/redux/v2/actions";
import { getPlatformName } from "@/utils/string";

export const AgencyDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stats = useSelector(state => state.v2.stats);
  const disabledAccounts = useSelector(state => state.v2.disabledAccounts);

  const [loading, setLoading] = useState(false);

  const getStatsCallback = useCallback(() => {
    setLoading(true);
    dispatch(getStatistics(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    getStatsCallback();
  }, [getStatsCallback]);

  useEffect(() => {
    const interval = setInterval(() => {
      getStatsCallback();
    }, 60000);
    return () => clearInterval(interval);
  });

  const handleHistoryButtonClick = (account) => {
    navigate(`/account/${account.platform}/${account._id}`);
  }

  const handleSetStatus = (account, status) => {
    dispatch(updateAccountStatus(account, status, () => getStatsCallback()))
  }

  return (
    <>
      <PageMetaData title="Dashboard" />
      <Card title="Dashboard">
        <Row gutter={[16, 16]}>
          <Col md={8} sm={12} >
            <StatsBox
              key="model"
              loading={loading}
              items={[
                { label: "Total Models", icon: <User />, value: stats.modelStats?.totalModels || 0 },
                { label: "Unsynced Models", icon: <UserCog />, value: stats.modelStats?.updatedModels || 0 },
              ]}
            />
          </Col>
          <Col md={8} sm={0} >
            <StatsBox
              key="account"
              loading={loading}
              items={[
                { label: `Total Accounts`, icon: <Users />, value: (stats.accountStats || []).reduce((sum, item) => sum += (item.totalAccounts || 0), 0) },
                { label: `Running Accounts`, icon: <Users />, value: (stats.accountStats || []).reduce((sum, item) => sum += (item.runningAccounts || 0), 0) },
                { label: `Disabled Accounts`, icon: <Users />, value: (stats.accountStats || []).reduce((sum, item) => sum += (item.disabledAccounts || 0), 0) },
              ]}
            />
          </Col>
          <Col md={8} sm={12} >
            <StatsBox
              key="chat"
              loading={loading}
              items={[
                { label: "Chat Teams", icon: <MessagesSquare />, value: stats.teamCount || 0 },
              ]}
            />
          </Col>
          {(stats.accountStats || []).map(stat =>
            <Col md={8} sm={12} >
              <StatsBox
                key={stat.platform}
                loading={loading}
                items={[
                  { label: `${getPlatformName(stat.platform)} Accounts`, icon: <Users />, value: stat.totalAccounts || 0 },
                  { label: `${getPlatformName(stat.platform)} Runnings`, icon: <Users />, value: stat.runningAccounts || 0 },
                  { label: `${getPlatformName(stat.platform)} Disables`, icon: <Users />, value: stat.disabledAccounts || 0 },
                ]}
              />
            </Col>
          )}

        </Row>
        <Row className="mt-8">
          <DisabledAccountTable
            accounts={disabledAccounts}
            onHistory={handleHistoryButtonClick}
            onStatusChange={handleSetStatus}
            loading={loading}
          />
        </Row>
      </Card>
    </>
  );
};

export default AgencyDashboardPage;
