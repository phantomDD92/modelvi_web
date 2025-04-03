import React from "react";
import { Card, Form, Input, Row, Col, Switch, InputNumber, Button, Avatar, Typography, Tag, Alert, Divider, Tabs } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { AdminRole } from "@/utils/const";
import { LuCircleDollarSign, LuReceipt, LuUser, LuUsers, LuWallet } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import SettingsPayment from "./SettingsPayment";
import SettingsTransaction from "./SettingsTransaction";
import PageMetaData from "@/components/common/PageMetaData";

const FeatureItem = ({ icon, label, value }) =>
  <div className="flex gap-2 justify-center items-center mx-4">
    {icon}
    <div className="flex flex-col">
      <div className="text-lg font-medium">{value}</div>
      <div className="text-md">{label}</div>
    </div>
  </div>

const DetailItem = ({ label, value }) =>
  <div className="flex">
    <span className="min-w-[80px] font-medium">{`${label} :`}</span>
    <span>{value}</span>
  </div>

const profileTabs = [
  { key: "payments", label: "Payments" },
  { key: "transactions", label: "Transactions" },
]

export const SettingsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const profile = useSelector(state => state.v2.profile);
  const key = params?.key || "payments";

  const handleTabChange = (item) => {
    navigate(`/billing/${item}`);
  }

  return (
    <>
      <PageMetaData title="Billing" />
      <Row className="p-4">
        <Col span={6}>
          <Card className="m-4">
            <div className="flex flex-col justify-center items-center gap-2">
              <Avatar
                size={120}
                className="bg-green-400"
                shape="square"
                src={profile?.role == AdminRole.MANAGER ? "/img/manager.png" : "/img/agency.png"} />
              <Typography.Title level={4}>{profile.name}</Typography.Title>
              <Tag className="text-lg" color={profile?.role == AdminRole.MANAGER ? 'success' : 'info'}>{profile?.role == AdminRole.MANAGER ? "Manager" : "Agency"}</Tag>
              {/* <Tag className="text-lg" color="warning">{`Available balance : $${profile?.balance || 0}`}</Tag> */}
              <div className="flex justify-center my-2">
                <FeatureItem
                  icon={<LuWallet size={30} />}
                  label="Balance"
                  value={`$${profile.balance || 0}`}
                />
                <FeatureItem
                  icon={<LuReceipt size={30} />}
                  label="Monthly Estimate"
                  value={`$${profile.monthlyFee}`}
                />
                {/* <FeatureItem
                icon={<LuUser size={30} />}
                label="Proxies"
                value={profile.proxyCount || "-"}
              /> */}
              </div>
              <div className="flex justify-center my-2">
                <FeatureItem
                  icon={<LuUsers size={30} />}
                  label="Models"
                  value={profile.modelCount || "-"}
                />
                <FeatureItem
                  icon={<LuUser size={30} />}
                  label="Accounts"
                  value={profile.accountCount || "-"}
                />
                <FeatureItem
                  icon={<LuUser size={30} />}
                  label="Proxies"
                  value={profile.proxyCount || "-"}
                />
              </div>
              <div className="flex flex-col justify-start w-full gap-2">
                <div className="text-xl font-semibold">Details</div>
                <Divider className="my-2" />
                <DetailItem label="Name" value={profile?.name} />
                <DetailItem label="Role" value={profile?.role == AdminRole.MANAGER ? "Manager" : "Agency"} />
                <DetailItem label="Email" value={profile?.email} />
                <DetailItem label="Telegram" value={profile?.telegram} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <div className="m-4">
            <Tabs
              type="card"
              activeKey={key}
              items={profileTabs}
              onChange={handleTabChange}
            />
            {
              key == "payments"
                ? <SettingsPayment />
                : key == "transactions"
                  ? <SettingsTransaction />
                  // : key == "overview"
                  //   ? <SettingsOverview />
                  : <></>
            }
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SettingsPage;
