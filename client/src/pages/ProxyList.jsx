import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProxies, clearProxies, deleteProxy, loadProxies, setProxyStatus } from "@/redux/proxy/actions";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import ProxyTable from "@/components/proxy/ProxyTable";
import ProxyDialog from "@/components/proxy/ProxyDialog";

export const ProxyList = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch()
  const proxyProps = useSelector(state => state.proxy)
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;

  useEffect(() => {
    dispatch(loadProxies({ page, pageSize: 10 }))
  }, [loadProxies, page])

  const handleReloadData = () => {
    dispatch(loadProxies({ page, pageSize: 10 }))
    setVisible(false)
  }

  const handleSetProxyStatus = (proxy, status) => {
    dispatch(setProxyStatus(proxy, status, handleReloadData))
  }

  const handleClearProxies = () => {
    dispatch(clearProxies(handleReloadData))
  }

  const handleDeleteProxy = (proxy) => {
    dispatch(deleteProxy(proxy, handleReloadData));
  }

  const handleAppendProxies = (proxies, expiredAt) => {
    dispatch(addProxies(proxies, expiredAt, handleReloadData))

  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg
      }).toString()
    }, { replace: true });
  }

  return (
    <div>
      <ProxyTable
        proxies={proxyProps.proxies}
        proxiesCount={proxyProps.proxiesCount}
        page={page}
        onPageChange={handlePageChange}
        onStatusChange={handleSetProxyStatus}
        onDelete={handleDeleteProxy}
        onClear={handleClearProxies}
        onAppend={() => setVisible(true)}
      />
      <ProxyDialog
        open={visible}
        onCancel={() => setVisible(false)}
        onAppend={handleAppendProxies}
      />
    </div>
  );
};

export default ProxyList;
