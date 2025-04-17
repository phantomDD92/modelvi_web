import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";
import { AdminProxyAppendDialog, AdminProxyTable } from "@/components/proxy";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import PageMetaData from "@/components/common/PageMetaData";
import { appendAgencyProxiesForAdmin, clearAgencyProxiesForAdmin, clearAllProxiesForAdmin, loadAgenciesForAdmin, loadProxiesForAdmin } from "@/redux/admin/actions";

export const AdminAccountStatPage = () => {
  const [loading, setLoading] = useState(false);
  const [createShow, setCreateShow] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  const proxyStats = useSelector(state => state.admin.proxyStats)
  const agencies = useSelector(state => state.admin.agencies);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadAccountStatsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadProxiesForAdmin(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadAccountStatsCallback();
  }, [loadAccountStatsCallback])

  useEffect(() => {
    dispatch(loadAgenciesForAdmin());
  }, [loadAgenciesForAdmin]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadAccountStatsCallback(agency);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const handleViewAgencyProxy = (agency) => {
    navigate(`/admin/proxy/${agency._id}`);
  }

  const handleDeleteAgencyProxies = (agency) => {
    Modal.confirm({
      title: `Are you sure to delete ${agency?.agencyName || "unknown agency"}'s proxies?`,
      onOk: () => dispatch(clearAgencyProxiesForAdmin(agency._id, () => loadAccountStatsCallback())),
    });
  }

  const handleAppendProxies = (agencyId, proxies, deadline) => {
    dispatch(appendAgencyProxiesForAdmin(agencyId, proxies, deadline, () => { setCreateShow(false); loadAccountStatsCallback(); }))
  }

  const handleClearProxies = () => {
    Modal.confirm({
      title: `Are you sure to delete all proxies?`,
      onOk: () => dispatch(clearAllProxiesForAdmin(() => loadAccountStatsCallback())),
    });
  }

  return (
    <>
      <PageMetaData title="Proxies" admin />
      <AdminProxyTable
        dataSource={proxyStats}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: handleChangePagination
        }}
        actions={{
          onView: handleViewAgencyProxy,
          onClear: handleClearProxies,
          onAppend: () => setCreateShow(true),
          onDelete: handleDeleteAgencyProxies,
        }}
      />
      <AdminProxyAppendDialog
        open={createShow}
        agencies={agencies}
        onAppend={handleAppendProxies}
        onCancel={() => setCreateShow(false)}
      />
    </>
  );
};

export default AdminAccountStatPage;
