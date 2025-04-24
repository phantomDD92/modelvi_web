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
  changeAllStatus,
  changeAccount,
  updateAccountSettings,
  updateBulkAccountsStatus,
  deleteBulkAccounts
} from "@/redux/model/actions";
import {
  AccountTable,
  AccountDialog,
  AccountParamDialog
} from "@/components/account";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import PageMetaData from "@/components/common/PageMetaData";

export const AccountListPage = () => {

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

  const modelProps = useSelector(state => state.model)
  const models = useSelector(state => state.model.models);

  const loadAccountsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadAccounts(platform, () => setLoading(false)));
  }, [dispatch, platform]);

  useEffect(() => {
    dispatch(loadModels())
  }, [loadModels])

  useEffect(() => {
    loadAccountsCallback();
  }, [loadAccountsCallback])

  useEffect(() => {
    const interval = setInterval(() => {
      loadAccountsCallback();
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangeStatus = (account, status) => {
    dispatch(updateAccountStatus(account, status, () => loadAccountsCallback()))
  }

  const handleUpdateAccount = (account, params) => {
    dispatch(changeAccount(platform, account, params, () => { setEditOpen(false); loadAccountsCallback() }))
  }

  const handleCreateAccount = (params) => {
    dispatch(createAccount(platform, params, () => { setEditOpen(false); loadAccountsCallback() }));
  }

  const handleDeleteAccount = (account) => {
    Modal.confirm({
      title: `Are you sure to delete the account(${account.alias})?`,
      onOk: () => { dispatch(deleteAccount(platform, account, () => loadAccountsCallback())); },
    });
  }

  const handleUpdateSetting = (account, params) => {
    dispatch(updateAccountSettings(platform, account, params, () => { setSettingOpen(false); loadAccountsCallback(); }));
  }

  const handleChangeAllStatus = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} all accounts?`,
      onOk: () => dispatch(changeAllStatus(platform, status, () => loadAccountsCallback())),
    });
  }

  const handleChangeBulkAccountsStatus = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} accounts?`,
      onOk: () => dispatch(updateBulkAccountsStatus(platform, selectedRowKeys, status, () => { setSelectedRowKeys([]); loadAccountsCallback() })),
    });
  }

  const handleDeleteBulkAccounts = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} accounts?`,
      onOk: () => dispatch(deleteBulkAccounts(platform, selectedRowKeys, () => { setSelectedRowKeys([]); loadAccountsCallback() })),
    });
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
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
      <AccountTable
        platform={platform}
        dataSource={modelProps.accounts}
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
          onPlatform: handleChangePlatform,
          onCreate: () => { setAccount(); setEditOpen(true) },
          onEdit: (account) => { setAccount(account); setEditOpen(true) },
          onDelete: handleDeleteAccount,
          onHistory: (account) => navigate(`/account/${platform}/${account._id}`),
          onSetting: (account) => { setAccount(account); setSettingOpen(true) },
          onAllStatus: handleChangeAllStatus,
          onStatus: handleChangeStatus,
          onBulkDelete: handleDeleteBulkAccounts,
          onBulkStatus: handleChangeBulkAccountsStatus,
        }}
      />
      <AccountDialog
        open={editOpen}
        platform={platform}
        account={account}
        models={models}
        chatTeams={modelProps.chatTeams}
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

export default AccountListPage;
