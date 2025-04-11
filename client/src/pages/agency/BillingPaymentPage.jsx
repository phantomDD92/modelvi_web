import { useCallback, useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import qs from 'query-string';
import { Button, Card, Col, Result, Row, Select, Steps, Typography } from "antd";
import { LoadingOutlined, ClockCircleOutlined, CheckCircleOutlined, SmileOutlined, SyncOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { DepositAddress } from "@/components/settings";
import CryptoSelect from "@/components/settings/CryptoSelect";
import PaymentTable from "@/components/settings/PaymentTable";
import { cryptoCurrencies } from "@/data/crypto";
import { cancelPayment, createPayment, getPayment, loadPayments } from "@/redux/v2/actions";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/const";

const pricingPlans = [
  { key: "0", price: 50.00, earnings: "$0 ~ $1000" },
  { key: "1", price: 75.00, earnings: "$1000 ~ $2500" },
  { key: "2", price: 100.00, earnings: "$2500 ~ $5000" },
  { key: "3", price: 150.00, earnings: "$5000 ~ $7500" },
  { key: "4", price: 175.00, earnings: "$7500 ~ $10000" },
  { key: "5", price: 200.00, earnings: "$10000 ~ $15000" },
  { key: "6", price: 225.00, earnings: "$15000 ~ $20000" },
  { key: "7", price: 250.00, earnings: "$20000 +" }
];

const vipPricingPlans = [
  { key: "0", price: 50.00, earnings: "$0 ~ $1000" },
  { key: "1", price: 75.00, earnings: "$1000 ~ $2500" },
  { key: "2", price: 80.00, earnings: "$2500 ~ $5000" },
  { key: "3", price: 120.00, earnings: "$5000 ~ $7500" },
  { key: "4", price: 140.00, earnings: "$7500 ~ $10000" },
  { key: "5", price: 160.00, earnings: "$10000 ~ $15000" },
  { key: "6", price: 180.00, earnings: "$15000 ~ $20000" },
  { key: "7", price: 200.00, earnings: "$20000 +" }
];

const BillingPaymentPage = ({ vip }) => {
  const [planKey, setPlanKey] = useState("0");
  const [coin, setCoin] = useState("usdttrc20")
  const [step, setStep] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState();

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentPayment = useSelector(state => state.v2.currentPayment);
  const payments = useSelector(state => state.v2.payments);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const getStatusIcon = (status) => {
    switch (status) {
      case "waiting":
        return <LoadingOutlined />
      case "confirming":
        return <SyncOutlined />
      case "confirmed":
        return <CheckCircleOutlined />
      case "finished":
        return <SmileOutlined />
      case "failed":
        return <CloseCircleOutlined />
      default:
        return <ClockCircleOutlined />
    }
  }

  const loadPaymentsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadPayments(() => setLoading(false)));
  }, [dispatch]);

  const getPaymentCallback = useCallback(() => {
    if (paymentId)
      dispatch(getPayment(paymentId));
  }, [dispatch, paymentId]);

  useEffect(() => {
    loadPaymentsCallback()
  }, [loadPaymentsCallback])

  // useEffect(() => {
  //   if (paymentId)
  //     loadPaymentsCallback();
  // }, [paymentId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (step == 2)
        getPaymentCallback()
      loadPaymentsCallback();
    }, 10000);
    return () => clearInterval(interval);
  });

  const getCurrency = (coin) => {
    const currency = cryptoCurrencies.find(item => item.code == coin)
    return currency;
  }



  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const handleAssetSelected = () => {
    setWaiting(true);
    dispatch(createPayment(coin, (id) => {
      setWaiting(false);
      setStep(1);
      if (id)
        setPaymentId(id);
    }))
  }

  const handleCancelDeposit = () => {
    if (paymentId) {
      setWaiting(true);
      dispatch(cancelPayment(paymentId, () => { setWaiting(false); setStep(0) }))
    }
  }

  const handleCheckDeposit = () => {
    getPaymentCallback();
    setStep(2);
  }

  const getPricePlanOptions = (vip) =>
    vip
      ? vipPricingPlans.map(plan => ({ value: plan.key, label: plan.earnings }))
      : pricingPlans.map(plan => ({ value: plan.key, label: plan.earnings }));

  const getPrice = (key, vip) => {
    const item = vip
      ? vipPricingPlans.find(plan => plan.key == key)
      : pricingPlans.find(plan => plan.key == key);
    return (item?.price || 50.00).toFixed(2);
  }

  return (
    <Card>
      <Row>
        <Col span={12}>
          <div className="p-4">
            <Typography className="text-xl font-medium mb-4 uppercase text-primary">Pay Monthly</Typography>
            <p className="text-secondary" >*Price Per Platform</p>
            <h6 className="my-2 font-medium text-lg">Enter you Creator's monthly earnings:</h6>
            <Select
              className="w-full my-2"
              value={planKey}
              onChange={value => setPlanKey(value)}
              options={getPricePlanOptions(vip)}
            />
            <p>Starting at just</p>
            <div className="flex text-default-950">
              <span className="text-xl font-semibold">$</span>
              <span className="text-3xl font-semibold">{getPrice(planKey, vip)}</span>
              <span className="text-xl font-semibold self-end">/mo</span>
            </div>
          </div>
        </Col>
        <Col span={12} >
          <div className="p-4 flex flex-col gap-4">
            <Steps
              className="mb-8"
              current={step}
              items={[{ title: "Choose asset" }, { title: "Send deposit" }, { title: "Check deposit" }]}
            />
            {step == 0 &&
              <div className="flex flex-col gap-8">
                <CryptoSelect
                  value={coin}
                  onChange={value => setCoin(value)}
                />
                <Button
                  type="primary"
                  loading={waiting}
                  onClick={handleAssetSelected}>
                  Next
                </Button>
              </div>
            }
            {step == 1 &&
              <div className="flex flex-col gap-8">
                <DepositAddress
                  address={currentPayment?.payAddress}
                  currency={getCurrency(currentPayment?.payCurrency)}
                  payAmount={currentPayment?.payAmount}
                  priceAmount={currentPayment?.priceAmount}
                />
                <div className="flex gap-8">
                  <Button
                    type="primary"
                    className="w-full"
                    loading={waiting}
                    onClick={handleCheckDeposit}
                  >
                    Next
                  </Button>
                  <Button
                    danger
                    className="w-full"
                    loading={waiting}
                    onClick={handleCancelDeposit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            }
            {step == 2 &&
              <Result
                title={currentPayment?.status}
                icon={getStatusIcon(currentPayment?.status)}
              />
            }
          </div>
        </Col>
      </Row>
      <PaymentTable
        dataSource={payments}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: handleChangePagination
        }}
      />
    </Card>
  )
}

export default BillingPaymentPage;
