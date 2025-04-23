import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";
import {
  loadAccountsForAdmin,
  loadModelsForAdmin,
  updateAccountSettingsForAdmin,
  deleteAccountForAdmin,
  createAccountForAdmin,
  changeAccountForAdmin,
  updateAccountStatusForAdmin,
  updateAccountsStatusForAdmin,
  deleteAccountsForAdmin,
  loadChatTeamsForAdmin,
  loadAgencyListForAdmin
} from "@/redux/admin/actions";
import {
  AccountParamDialog,
  AdminAccountTable
} from "@/components/account";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import PageMetaData from "@/components/common/PageMetaData";
import AdminAccountDialog from "@/components/account/AdminAccountDialog";

export const AdminAccountPage = () => {

  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [account, setAccount] = useState();
  const [settingOpen, setSettingOpen] = useState(false);
  const [agency, setAgency] = useState('');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const { platform } = useParams()

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const models = useSelector(state => state.admin.models);
  const accounts = useSelector(state => state.admin.accounts);
  const chatTeams = useSelector(state => state.admin.chatTeams);
  const agencyList = useSelector(state => state.admin.agencyList);

  const loadAccountsCallback = useCallback((platform, agency, search) => {
    setLoading(true);
    dispatch(loadAccountsForAdmin(platform, agency, search, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadModelsForAdmin("", ""))
  }, [loadModelsForAdmin])

  useEffect(() => {
    dispatch(loadChatTeamsForAdmin())
  }, [loadChatTeamsForAdmin])

  useEffect(() => {
    dispatch(loadAgencyListForAdmin())
  }, [loadAgencyListForAdmin]);

  useEffect(() => {
    loadAccountsCallback(platform, agency, search);
  }, [loadAccountsCallback, platform, agency, search])

  useEffect(() => {
    const interval = setInterval(() => {
      loadAccountsCallback(platform, agency, search);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleChangeStatus = (account, status) => {
    dispatch(updateAccountStatusForAdmin(account, status, () => loadAccountsCallback(platform, agency, search)))
  }

  const handleUpdateAccount = (account, params) => {
    dispatch(changeAccountForAdmin(platform, account, params, () => { setEditOpen(false); loadAccountsCallback(platform, agency, search) }))
  }

  const handleCreateAccount = (params) => {
    dispatch(createAccountForAdmin(platform, params, () => { setEditOpen(false); loadAccountsCallback(platform, agency, search) }));
  }

  const handleDeleteAccount = (account) => {
    Modal.confirm({
      title: `Are you sure to delete the account(${account.alias})?`,
      onOk: () => { dispatch(deleteAccountForAdmin(platform, account, () => loadAccountsCallback(platform, agency, search))); },
    });
  }

  const handleUpdateSetting = (account, params) => {
    dispatch(updateAccountSettingsForAdmin(platform, account, params, () => { setSettingOpen(false); loadAccountsCallback(platform, agency, search); }));
  }

  const handleChangeBulkAccountsStatus = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} accounts?`,
      onOk: () => dispatch(updateAccountsStatusForAdmin(platform, selectedRowKeys, status, () => { setSelectedRowKeys([]); loadAccountsCallback(platform, agency, search) })),
    });
  }

  const handleDeleteBulkAccounts = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} accounts?`,
      onOk: () => dispatch(deleteAccountsForAdmin(platform, selectedRowKeys, () => { setSelectedRowKeys([]); loadAccountsCallback(platform, agency, search) })),
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
      pathname: `/admin/account/${plat}`
    }, { replace: true });
  }

  return (
    <>
      <PageMetaData title="Accounts" admin />
      <AdminAccountTable
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
          agency,
          agencyList,
          onSearchChange: value => setSearch(value),
          onAgencyChange: agency => setAgency(agency),
        }}
        actions={{
          onPlatform: handleChangePlatform,
          onCreate: () => { setAccount(); setEditOpen(true) },
          onEdit: (account) => { setAccount(account); setEditOpen(true) },
          onDelete: handleDeleteAccount,
          onHistory: (account) => navigate(`/admin/history/${platform}/${account._id}`),
          onSetting: (account) => { setAccount(account); setSettingOpen(true) },
          onStatus: handleChangeStatus,
          onBulkDelete: handleDeleteBulkAccounts,
          onBulkStatus: handleChangeBulkAccountsStatus,
        }}
      />
      <AdminAccountDialog
        open={editOpen}
        platform={platform}
        account={account}
        models={models}
        agencies={agencyList}
        chatTeams={chatTeams}
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

export default AdminAccountPage;
