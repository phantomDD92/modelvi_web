import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";

import {
  ProxyAppendDialog,
  AgencyProxyTable
} from "@/components/proxy";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { PageMetaData } from "@/components/common";
import {
  appendAgencyProxiesForAdmin,
  changeBulkProxiesStatusForAdmin,
  changeProxyStatusForAdmin,
  clearAgencyProxiesForAdmin,
  deleteBulkProxiesForAdmin,
  deleteProxyForAdmin,
  loadAgencyProxiesForAdmin,
  resetProxyForAdmin
} from "@/redux/admin/actions";

export const AdminProxyAgencyPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appendOpen, setAppendOpen] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const { agencyId } = useParams()

  const proxies = useSelector(state => state.admin.agencyProxies)
  const proxyAgency = useSelector(state => state.admin.proxyAgency);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadProxiesCallback = useCallback((agencyId) => {
    setLoading(true);
    dispatch(loadAgencyProxiesForAdmin(agencyId, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    agencyId && loadProxiesCallback(agencyId);
  }, [loadProxiesCallback, agencyId])

  useEffect(() => {
    const interval = setInterval(() => {
      agencyId && loadProxiesCallback(agencyId);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangeProxyStatus = (proxy, status) => {
    agencyId &&
      dispatch(changeProxyStatusForAdmin(agencyId, proxy, status, () => loadProxiesCallback(agencyId)))
  }

  const handleChangeBulkProxiesStatus = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} proxies?`,
      onOk: () => dispatch(changeBulkProxiesStatusForAdmin(agencyId, selectedRowKeys, status, () => { setSelectedRowKeys([]); loadProxiesCallback(agencyId); })),
    });
  }

  const handleClearProxies = () => {
    Modal.confirm({
      title: `Are you sure to clear all proxies?`,
      onOk: () => dispatch(clearAgencyProxiesForAdmin(agencyId, () => loadProxiesCallback(agencyId))),
    });
  }

  const handleDeleteProxy = (proxy) => {
    Modal.confirm({
      title: `Are you sure to delete the proxy (${proxy.url})?`,
      onOk: () => dispatch(deleteProxyForAdmin(agencyId, proxy, () => loadProxiesCallback(agencyId))),
    });
  }

  const handleDeleteBulkProxies = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} proxies?`,
      onOk: () => dispatch(deleteBulkProxiesForAdmin(agencyId, selectedRowKeys, () => { setSelectedRowKeys([]); loadProxiesCallback(agencyId); })),
    });
  }

  const handleAppendProxies = (proxies, expiredAt) => {
    dispatch(appendAgencyProxiesForAdmin(agencyId, proxies, expiredAt, () => { setAppendOpen(false); loadProxiesCallback(agencyId); }))
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const handleResetProxy = (proxy, platform) => {
    dispatch(resetProxyForAdmin(agencyId, proxy, platform, () => loadProxiesCallback(agencyId)));
  }

  return (
    <>
      <PageMetaData title="Proxies" />
      <AgencyProxyTable
        agency={proxyAgency}
        dataSource={proxies}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: handleChangePagination
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
        }}
        actions={{
          onStatus: handleChangeProxyStatus,
          onDelete: handleDeleteProxy,
          onClear: handleClearProxies,
          onAppend: () => setAppendOpen(true),
          onBulkDelete: handleDeleteBulkProxies,
          onBulkStatus: handleChangeBulkProxiesStatus,
          onReset: handleResetProxy,
          onBack: () => navigate(-1)
        }}
      />
      <ProxyAppendDialog
        open={appendOpen}
        onCancel={() => setAppendOpen(false)}
        onAppend={handleAppendProxies}
      />
    </>
  );
};

export default AdminProxyAgencyPage;
