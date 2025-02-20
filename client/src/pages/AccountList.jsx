import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";
import { createAccount, deleteAccount, loadAccounts, loadAllChatTeams, loadAllModels, setAccountStatus, startAllAccount, stopAllAccount, updateAccount, updateAccountParams } from "@/redux/model/actions";
import {
  AccountTable,
  AccountDialog,
  AccountParamDialog
} from "@/components/account";
import { Platform } from "@/utils/const";

export const AccountList = () => {

  const [visible, setVisible] = useState(false);
  const [paramShow, setParamShow] = useState(false);
  const [account, setAccount] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const { platform } = useParams()

  const page = parseInt(qs.parse(location.search).page) || 1;
  const pageSize = parseInt(qs.parse(location.search).size) || 10;
  const modelProps = useSelector(state => state.model)
  const homeProps = useSelector(state => state.home)

  useEffect(() => {
    dispatch(loadAllModels())
  }, [loadAllModels])

  useEffect(() => {
    setLoading(true);
    dispatch(loadAccounts(platform, { page, pageSize }, () => setLoading(false)));
  }, [loadAccounts, platform, page, pageSize])

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      dispatch(loadAccounts(platform, { page, pageSize }, () => setLoading(false)));
    }, 60000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    dispatch(loadAllChatTeams())
  }, [loadAllChatTeams])

  const handleSetStatus = (account, status) => {
    dispatch(setAccountStatus(account, status, handleReloadData))
  }

  const handleUpdateAccount = (account, params) => {
    dispatch(updateAccount(platform, account, params, handleReloadData))
  }

  const handleCreateAccount = (params) => {
    dispatch(createAccount(platform, params, handleReloadData));
  }

  const handleCreateButtonClick = () => {
    setAccount();
    setVisible(true)
  }

  const handleDeleteAccount = (account) => {
    Modal.confirm({
      title: "Are you sure to delete this account?",
      onOk: () => { dispatch(deleteAccount(platform, account, handleReloadData)); },
    });
  }

  const handleEditButtonClick = (account) => {
    setAccount(account);
    setVisible(true);
  }

  const handleHistoryButtonClick = (account) => {
    navigate(`/account/${platform}/${account._id}`);
  }

  const handleParamsButtonClick = (account) => {
    setAccount(account);
    setParamShow(true);
  }

  const handleUpdateParams = (account, params) => {
    dispatch(updateAccountParams(platform, account, params, handleReloadData));
  }


  const handleReloadData = () => {
    setParamShow(false);
    setVisible(false);
    setLoading(true);
    dispatch(loadAccounts(platform, { page, pageSize }, () => setLoading(false)))
  }

  const handleStartAll = () => {
    dispatch(startAllAccount(platform, handleReloadData))
  }

  const handleStopAll = () => {
    dispatch(stopAllAccount(platform, handleReloadData))
  }

  const handlePageChange = (pg, pgSize) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg,
        size: pgSize,
      }).toString()
    }, { replace: true });
  }

  const handlePlatformChange = (plat) => {
    navigate({
      pathname: `/account/${plat}`
    }, { replace: true });
  }

  return (
    <div>
      <AccountTable
        auth={homeProps.auth}
        accounts={modelProps.accounts}
        accountsCount={modelProps.accountsCount}
        loading={loading}
        page={page}
        pageSize={pageSize}
        platform={platform}
        onPageChange={handlePageChange}
        onPlatformChange={handlePlatformChange}
        onCreate={handleCreateButtonClick}
        onDelete={handleDeleteAccount}
        onEdit={handleEditButtonClick}
        onHistory={handleHistoryButtonClick}
        onParameter={handleParamsButtonClick}
        onStartAll={handleStartAll}
        onStopAll={handleStopAll}
        onStatusChange={handleSetStatus}
      />
      <AccountDialog
        open={visible}
        platform={platform}
        account={account}
        models={modelProps.allModels}
        chatTeams={modelProps.chatTeams}
        onCancel={() => setVisible(false)}
        onCreate={handleCreateAccount}
        onUpdate={handleUpdateAccount}
      />
      <AccountParamDialog
        open={paramShow}
        account={account}
        onCancel={() => setParamShow(false)}
        onUpdate={handleUpdateParams}
      />
    </div>
  );
};

export default AccountList;
