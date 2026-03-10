import { useCallback, useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import qs from 'query-string';
import { Button, Card, Col, Result, Row, Select, Steps, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { DepositAddress } from "@/components/settings";
import CryptoSelect from "@/components/settings/CryptoSelect";
import PaymentTable from "@/components/settings/PaymentTable";
import { cryptoCurrencies } from "@/data/crypto";
import { cancelPayment, createPayment, getPayment, loadPayments } from "@/redux/v2/actions";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/const";
import { LuCircleCheck, LuCircleGauge, LuCircleX, LuSmile } from "react-icons/lu";
import { PricePlansView } from "@/components/finance";

const BillingNowpaymentPage = ({ }) => {
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
        return <LuCircleGauge />
      case "confirmed":
        return <LuCircleCheck />
      case "finished":
        return <LuSmile />
      case "failed":
        return <LuCircleX />
      default:
        return <LuCircleX />
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


  return (
    <Card>
      <Row>
        <Col span={12}>
          <PricePlansView />
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

export default BillingNowpaymentPage;
