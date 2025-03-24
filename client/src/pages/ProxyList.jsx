import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate
} from "react-router-dom";
import qs from 'query-string';
import {
  appendProxies,
  clearProxies,
  deleteProxy,
  loadProxies,
  changeProxyStatus,
  deleteBulkProxies,
  changeBulkProxiesStatus,
  resetProxy
} from "@/redux/proxy/actions";
import {
  ProxyTable,
  ProxyAppendDialog
} from "@/components/proxy";
import { AdminRole, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { Modal } from "antd";
import { loadAgencies } from "@/redux/dashboard/actions";
import { useAuth } from "@/contexts";

export const ProxyListPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appendOpen, setAppendOpen] = useState(false);
  const [agency, setAgency] = useState(0);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const proxies = useSelector(state => state.proxy.proxies)
  const managers = useSelector(state => state.home.managers);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadProxiesCallback = useCallback((agency) => {
    setLoading(true);
    dispatch(loadProxies(agency, () => setLoading(false)));
  }, [dispatch,]);

  useEffect(() => {
    loadProxiesCallback(agency);
  }, [loadProxiesCallback, agency])

  useEffect(() => {
    if (session?.role == AdminRole.MANAGER)
      dispatch(loadAgencies());
  }, [loadAgencies]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadProxiesCallback(agency);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangeProxyStatus = (proxy, status) => {
    dispatch(changeProxyStatus(proxy, status, () => loadProxiesCallback(agency)))
  }

  const handleChangeBulkProxiesStatus = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} proxies?`,
      onOk: () => dispatch(changeBulkProxiesStatus(selectedRowKeys, status, () => { setSelectedRowKeys([]); loadProxiesCallback(); })),
    });
  }

  const handleClearProxies = () => {
    Modal.confirm({
      title: `Are you sure to clear all proxies?`,
      onOk: () => dispatch(clearProxies(() => loadProxiesCallback(agency))),
    });
  }

  const handleDeleteProxy = (proxy) => {
    Modal.confirm({
      title: `Are you sure to delete the proxy (${proxy.url})?`,
      onOk: () => dispatch(deleteProxy(proxy, () => loadProxiesCallback(agency))),
    });
  }

  const handleDeleteBulkProxies = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} proxies?`,
      onOk: () => dispatch(deleteBulkProxies(selectedRowKeys, () => { setSelectedRowKeys([]); loadProxiesCallback(agency); })),
    });
  }

  const handleAppendProxies = (proxies, expiredAt) => {
    dispatch(appendProxies(proxies, expiredAt, () => { setAppendOpen(false); loadProxiesCallback(agency); }))
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const handleResetProxy = (proxy, platform) => {
    // console.log(proxy, platform);
    dispatch(resetProxy(proxy, platform, () => loadProxiesCallback(agency)));
  }

  return (
    <>
      <ProxyTable
        filters={{
          agencies: session?.role == AdminRole.MANAGER ? managers : [],
          current: agency,
          onChange: value => setAgency(value),
        }}
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

export default ProxyListPage;
