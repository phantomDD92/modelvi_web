import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { loadTransactions } from "@/redux/v2/actions";
import TransactionTable from "@/components/settings/TransactionTable";


const BillingTransactionPage = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const transactions = useSelector(state => state.v2.transactions);

  const loadTransactionsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadTransactions(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadTransactionsCallback();
  }, [loadTransactionsCallback])

  useEffect(() => {
    const interval = setInterval(() => {
      loadTransactionsCallback();
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }
  return (
    <div>
      <TransactionTable
        dataSource={transactions}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: handleChangePagination
        }}
      />
    </div>
  )
}

export default BillingTransactionPage;
