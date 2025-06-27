import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";
import {
  createAccount,
  deleteAccount,
  loadAccounts,
  loadModels,
  updateAccountStatus,
  changeAccount,
  updateAccountSettings,
  deleteAccounts,
  updateAccountsStatus,
  loadChatTeams
} from "@/redux/v2/actions";
import {
  AccountParamDialog,
  AgencyAccountDialog,
  AgencyAccountTable
} from "@/components/account";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import PageMetaData from "@/components/common/PageMetaData";

export const AgencyAccountPage = () => {

  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [account, setAccount] = useState();
  const [settingOpen, setSettingOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const { platform } = useParams()

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;
  const search = qs.parse(location.search)?.search || "";

  const models = useSelector(state => state.v2.models);
  const accounts = useSelector(state => state.v2.accounts);
  const teams = useSelector(state => state.v2.chatTeams)
  const loadAccountsCallback = useCallback((platform, search) => {
    setLoading(true);
    dispatch(loadAccounts(platform, search, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadModels(""))
  }, [loadModels])

  useEffect(() => {
    loadAccountsCallback(platform, search);
  }, [loadAccountsCallback, platform, search])

  useEffect(() => {
    const interval = setInterval(() => {
      loadAccountsCallback(platform, search);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    dispatch(loadChatTeams());
  }, [loadChatTeams]);

  const handleChangeStatus = (account, status) => {
    dispatch(updateAccountStatus(account, status, () => loadAccountsCallback(platform, search)))
  }

  const handleUpdateAccount = (account, params) => {
    dispatch(changeAccount(platform, account, params, () => { setEditOpen(false); loadAccountsCallback(platform, search) }))
  }

  const handleCreateAccount = (params) => {
    dispatch(createAccount(platform, params, () => { setEditOpen(false); loadAccountsCallback(platform, search) }));
  }

  const handleDeleteAccount = (account) => {
    Modal.confirm({
      title: `Are you sure to delete the account(${account.platform} - ${account.alias})?`,
      onOk: () => { dispatch(deleteAccount(platform, account, () => loadAccountsCallback(platform, search))); },
    });
  }

  const handleUpdateSetting = (account, params) => {
    dispatch(updateAccountSettings(platform, account, params, () => { setSettingOpen(false); loadAccountsCallback(platform, search); }));
  }

  const handleChangeBulkAccountsStatus = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} accounts?`,
      onOk: () => dispatch(updateAccountsStatus(platform, selectedRowKeys, status, () => { setSelectedRowKeys([]); loadAccountsCallback(platform, search) })),
    });
  }

  const handleDeleteBulkAccounts = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} accounts?`,
      onOk: () => dispatch(deleteAccounts(platform, selectedRowKeys, () => { setSelectedRowKeys([]); loadAccountsCallback(platform, search) })),
    });
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ search, page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const handleChangePlatform = (plat) => {
    navigate({
      pathname: `/account/${plat}`
    }, { replace: true });
  }

  return (
    <>
      <PageMetaData title="Accounts" />
      <AgencyAccountTable
        platform={platform}
        dataSource={accounts}
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
        filters={{
          search,
          onSearchChange: value => {
            navigate({
              pathname: location.pathname,
              search: createSearchParams({ search: value, page: 1, size: pageSize }).toString()
            }, { replace: true });
          },
        }}
        actions={{
          onPlatform: handleChangePlatform,
          onCreate: () => { setAccount(); setEditOpen(true) },
          onEdit: (account) => { setAccount(account); setEditOpen(true) },
          onDelete: handleDeleteAccount,
          onHistory: (account) => navigate(`/history/${platform}/${account._id}`),
          onSetting: (account) => { setAccount(account); setSettingOpen(true) },
          onStatus: handleChangeStatus,
          onBulkDelete: handleDeleteBulkAccounts,
          onBulkStatus: handleChangeBulkAccountsStatus,
        }}
      />
      <AgencyAccountDialog
        open={editOpen}
        platform={platform}
        account={account}
        models={models}
        chatTeams={teams}
        onCancel={() => setEditOpen(false)}
        onCreate={handleCreateAccount}
        onUpdate={handleUpdateAccount}
      />
      <AccountParamDialog
        open={settingOpen}
        account={account}
        onCancel={() => setSettingOpen(false)}
        onUpdate={handleUpdateSetting}
      />
    </>
  );
};

export default AgencyAccountPage;
