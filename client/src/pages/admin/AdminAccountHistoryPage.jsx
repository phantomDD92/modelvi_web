import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { clearAccountErrorForAdmin, clearAccountHistoryForAdmin, loadAccountHistoryForAdmin } from "@/redux/admin/actions";
import { PageMetaData } from "@/components/common";

import { DEFAULT_CURRENT_PAGE, LARGE_PAGE_SIZE } from "@/utils/const";
import { LogTable } from "@/components/account";

export const AdminAccountHistoryPage = () => {
  const [loading, setLoading] = useState(false);
  const { platform, accountId } = useParams()
  const [failedOnly, setFailedOnly] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  const page = parseInt(qs.parse(location.search)?.page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search)?.size) || LARGE_PAGE_SIZE;
  const log = parseInt(qs.parse(location.search)?.log);

  const logs = useSelector(state => state.admin.logs)
  const logsCount = useSelector(state => state.admin.logsCount);
  const logAccount = useSelector(state => state.admin.logAccount);

  useEffect(() => {
    setLoading(true);
    dispatch(loadAccountHistoryForAdmin(platform, accountId, { failedOnly, page, pageSize, log }, () => setLoading(false)))
  }, [loadAccountHistoryForAdmin, platform, accountId, failedOnly, page, log])


  const handleClearHistory = () => {
    dispatch(clearAccountHistoryForAdmin(platform, accountId, handleReloadData))
  }

  const handleClearError = () => {
    dispatch(clearAccountErrorForAdmin(platform, accountId));
  }

  const handleReloadData = () => {
    setLoading(true);
    dispatch(loadAccountHistoryForAdmin(platform, accountId, { failedOnly, page, pageSize, log }, () => setLoading(false)))
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue, failedOnly, log }).toString()
    }, { replace: true });
  }
  return (
    <>
      <PageMetaData title="History" />
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
          onReturn: () => navigate(-1),
          logType: log,
          onLogTypeChange: value => {
            navigate({
              pathname: location.pathname,
              search: createSearchParams({ page, pageSize, failedOnly, log: value }).toString()
            }, { replace: true });
          }
        }}
      />
      {/* <HistoryTable
        pagination={{
          current: page,
          pageSize: pageSize,
          total: historyCount,
          onChange: handleChangePagination
        }}
        dataSource={history}
        loading={loading}
        account={historyAccount}
        actions={{
          onClear: handleClearHistory,
          onError: handleClearError,
          onReturn: () => navigate(-1)
        }}
      /> */}
    </>
  );
};

export default AdminAccountHistoryPage;
