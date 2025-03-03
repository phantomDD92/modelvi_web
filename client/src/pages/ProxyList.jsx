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
  changeBulkProxiesStatus
} from "@/redux/proxy/actions";
import {
  ProxyTable,
  ProxyAppendDialog
} from "@/components/proxy";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { Modal } from "antd";

export const ProxyListPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appendOpen, setAppendOpen] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const proxyProps = useSelector(state => state.proxy)
  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadProxiesCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadProxies(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadProxiesCallback();
  }, [loadProxiesCallback])

  useEffect(() => {
    const interval = setInterval(() => {
      loadProxiesCallback();
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangeProxyStatus = (proxy, status) => {
    dispatch(changeProxyStatus(proxy, status, () => loadProxiesCallback()))
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
      onOk: () => dispatch(clearProxies(() => loadProxiesCallback())),
    });
  }

  const handleDeleteProxy = (proxy) => {
    Modal.confirm({
      title: `Are you sure to delete the proxy (${proxy.url})?`,
      onOk: () => dispatch(deleteProxy(proxy, () => loadProxiesCallback())),
    });
  }

  const handleDeleteBulkProxies = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} proxies?`,
      onOk: () => dispatch(deleteBulkProxies(selectedRowKeys, () => { setSelectedRowKeys([]); loadProxiesCallback(); })),
    });
  }

  const handleAppendProxies = (proxies, expiredAt) => {
    dispatch(appendProxies(proxies, expiredAt, () => { setAppendOpen(false); loadProxiesCallback(); }))
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  return (
    <>
      <ProxyTable
        dataSource={proxyProps.proxies}
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
