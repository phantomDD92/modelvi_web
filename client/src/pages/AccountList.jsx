import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAccount, deleteAccount, loadAccounts, loadAllModels, setAccountStatus, startAllAccount, stopAllAccount, updateAccount, updateAccountParams } from "@/redux/model/actions";
import { Platform } from "@/utils/const";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import qs from 'query-string';
import AccountTable from "@/components/account/AccountTable";
import AccountDialog from "@/components/account/AccountDialog";
import F2FParamDialog from "@/components/account/F2FParamDialog";
import FNCParamDialog from "@/components/account/FNCParamDialog";

export const AccountList = () => {
  const [visible, setVisible] = useState(false);
  const [f2fShow, setF2FShow] = useState(false);
  const [fncShow, setFNCShow] = useState(false);
  const [account, setAccount] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;
  const { platform } = useParams()
  const modelProps = useSelector(state => state.model)
  const homeProps = useSelector(state => state.home)

  useEffect(() => {
    dispatch(loadAllModels())
  }, [loadAllModels])

  useEffect(() => {
    dispatch(loadAccounts(platform, { page, pageSize: 10 }));
  }, [loadAccounts, platform, page])


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
    dispatch(deleteAccount(platform, account, handleReloadData));
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
    if (platform == Platform.F2F) {
      setF2FShow(true);
    } else if (platform == Platform.FNC) {
      setFNCShow(true);
    }
  }

  const handleUpdateParams = (account, params) => {
    dispatch(updateAccountParams(platform, account, params, handleReloadData));
  }

  const handleReloadData = () => {
    setF2FShow(false);
    setFNCShow(false);
    setVisible(false);
    dispatch(loadAccounts(platform, { page, pageSize: 10 }))
  }

  const handleStartAll = () => {
    dispatch(startAllAccount(platform, handleReloadData))
  }

  const handleStopAll = () => {
    dispatch(stopAllAccount(platform, handleReloadData))
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        page: pg,
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
        page={page}
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
        account={account}
        models={modelProps.allModels}
        onCancel={() => setVisible(false)}
        onCreate={handleCreateAccount}
        onUpdate={handleUpdateAccount}
      />
      <F2FParamDialog
        open={f2fShow}
        account={account}
        onCancel={() => setF2FShow(false)}
        onUpdate={handleUpdateParams}
      />
      <FNCParamDialog
        open={fncShow}
        account={account}
        onCancel={() => setFNCShow(false)}
        onUpdate={handleUpdateParams}
      />
    </div>
  );
};

export default AccountList;
