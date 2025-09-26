import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { clearAccountError, clearAccountHistory, loadAccountHistory } from "@/redux/v2/actions";
import { PageMetaData } from "@/components/common";
import { DEFAULT_CURRENT_PAGE, LARGE_PAGE_SIZE } from "@/utils/const";
import { LogTable } from "@/components/account";

export const AgencyAccountHistoryPage = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const { platform, accountId } = useParams()
  const { failedOnly, setFailedOnly } = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const page = parseInt(qs.parse(location.search)?.page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search)?.size) || LARGE_PAGE_SIZE;


  const logs = useSelector(state => state.v2.logs);
  const logsCount = useSelector(state => state.v2.logsCount);
  const logAccount = useSelector(state => state.v2.logAccount);

  useEffect(() => {
    setLoading(true);
    dispatch(loadAccountHistory(platform, accountId, { page, pageSize }, () => setLoading(false)))
  }, [loadAccountHistory, platform, accountId, page])

  const handleClearHistory = () => {
    dispatch(clearAccountHistory(platform, accountId, handleReloadData))
  }

  const handleClearError = () => {
    dispatch(clearAccountError(platform, accountId));
  }

  const handleReloadData = () => {
    setLoading(true);
    dispatch(loadAccountHistory(platform, accountId, { page, pageSize }, () => setLoading(false)))
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  return (
    <>
      <PageMetaData title="History" admin />
      <LogTable
        pagination={{
          current: page,
          pageSize: pageSize,
          total: logsCount,
          onChange: handleChangePagination
        }}
        dataSource={logs}
        loading={loading}
        account={logAccount}
        actions={{
          failedOnly,
          onFailed: value => setFailedOnly(value),
          onClear: handleClearHistory,
          onError: handleClearError,
          onReturn: () => navigate(-1)
        }}
      />
    </>
  );
};

export default AgencyAccountHistoryPage;
