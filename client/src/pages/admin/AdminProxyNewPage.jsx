import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";

import {
  ProxyAppendDialog,
  AdminProxyNewTable,
  AdminProxyDialog
} from "@/components/proxy";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import { PageMetaData } from "@/components/common";
import {
  appendProxiesNewForAdmin,
  changeProxyStatusNewForAdmin,
  clearProxiesNewForAdmin,
  deleteProxyNewForAdmin,
  loadProxiesNewForAdmin,
} from "@/redux/admin/actions";

export const AdminProxyNewPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appendOpen, setAppendOpen] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  const proxies = useSelector(state => state.admin.proxies)

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadProxiesCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadProxiesNewForAdmin(() => setLoading(false)));
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
    dispatch(changeProxyStatusNewForAdmin(proxy, status, () => loadProxiesCallback()))
  }

  const handleChangeBulkProxiesStatus = (status) => {
    // Modal.confirm({
    //   title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} proxies?`,
    //   onOk: () => dispatch(changeBulkProxiesStatusForAdmin(agencyId, selectedRowKeys, status, () => { setSelectedRowKeys([]); loadProxiesCallback(agencyId); })),
    // });
  }

  const handleClearProxies = () => {
    Modal.confirm({
      title: `Are you sure to clear all proxies?`,
      onOk: () => dispatch(clearProxiesNewForAdmin(() => loadProxiesCallback())),
    });
  }

  const handleDeleteProxy = (proxy) => {
    Modal.confirm({
      title: `Are you sure to delete the proxy (${proxy.url})?`,
      onOk: () => dispatch(deleteProxyNewForAdmin(proxy, () => loadProxiesCallback())),
    });
  }

  const handleDeleteBulkProxies = () => {
    // Modal.confirm({
    //   title: `Are you sure to delete ${selectedRowKeys.length} proxies?`,
    //   onOk: () => dispatch(deleteBulkProxiesForAdmin(agencyId, selectedRowKeys, () => { setSelectedRowKeys([]); loadProxiesCallback(agencyId); })),
    // });
  }

  const handleAppendProxies = (proxies) => {
    dispatch(appendProxiesNewForAdmin(proxies, () => { setAppendOpen(false); loadProxiesCallback(); }))
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }


  return (
    <>
      <PageMetaData title="Proxies" admin />
      <AdminProxyNewTable
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
          onBack: () => navigate(-1)
        }}
      />
      <AdminProxyDialog
        open={appendOpen}
        onCancel={() => setAppendOpen(false)}
        onAppend={handleAppendProxies}
      />
    </>
  );
};

export default AdminProxyNewPage;
