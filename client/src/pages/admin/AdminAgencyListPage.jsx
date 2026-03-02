import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";
import {
  AgencyTable,
  AgencyBalanceDialog,
  AgencyPricePlanDialog,
  AgencyReferrerDialog
} from "@/components/agency";
import { AgencyRole, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";
import PageMetaData from "@/components/common/PageMetaData";
import {
  appendAgencyBalanceForAdmin,
  changeAgenciesStatusForAdmin,
  changeAgencyDueDateForAdmin,
  changeAgencyPricePlanModeForAdmin,
  changeAgencyPricePlansForAdmin,
  changeAgencyReferrerForAdmin,
  changeAgencyStatusForAdmin,
  deleteAgenciesForAdmin,
  deleteAgencyForAdmin,
  loadAgenciesForAdmin
} from "@/redux/admin/actions";
import AgencyDueDateDialog from "@/components/agency/AgencyDueDateDialog";

export const AdminAgencyListPage = () => {

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [referrerOpen, setReferrerOpen] = useState(false);
  const [duedateOpen, setDuedateOpen] = useState(false);
  const [agency, setAgency] = useState();

  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();
  const agencies = useSelector(state => state.admin.agencies);

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const loadAgenciesCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadAgenciesForAdmin(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadAgenciesCallback();
  }, [loadAgenciesCallback])

  useEffect(() => {
    const interval = setInterval(() => {
      loadAgenciesCallback();
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleDeleteAgency = (agency) => {
    Modal.confirm({
      title: `Are you sure to delete the agency (${agency.name})?`,
      onOk: () => { dispatch(deleteAgencyForAdmin(agency, () => { loadAgenciesCallback() })); },
    });
  }

  const handleChangeStatus = (agency, status) => {
    dispatch(changeAgencyStatusForAdmin(agency, status, () => { loadAgenciesCallback() }));
  }

  const handleStatusBulkAgencies = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} agencies?`,
      onOk: () => { dispatch(changeAgenciesStatusForAdmin(selectedRowKeys, status, () => { setSelectedRowKeys([]); loadAgenciesCallback() })); },
    });
  }

  const handleAddBalance = (balance) => {
    if (agency)
      dispatch(appendAgencyBalanceForAdmin(agency, balance, () => { setBalanceOpen(false); loadAgenciesCallback(); }))
  }

  const handleChangePricePlanMode = (agency, mode) => {
    dispatch(changeAgencyPricePlanModeForAdmin(agency, mode, () => { loadAgenciesCallback(); }))
  }

  const handleDeleteBulkAgencies = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} agencies?`,
      onOk: () => { dispatch(deleteAgenciesForAdmin(selectedRowKeys, () => { setSelectedRowKeys([]); loadAgenciesCallback() })); },
    });
  }

  const handleUpdatePricePlans = (plans) => {
    if (agency)
      dispatch(changeAgencyPricePlansForAdmin(agency, plans, () => { setPlanOpen(false); loadAgenciesCallback() }))
  }

  const handleChangeReferrer = (referrer) => {
    if (agency)
      dispatch(changeAgencyReferrerForAdmin(agency, referrer, () => { setReferrerOpen(false); loadAgenciesCallback() }))
  }

  const handleUpdateDueDate = (duedate) => {
    if (agency)
      dispatch(changeAgencyDueDateForAdmin(agency, duedate, () => { setDuedateOpen(false); loadAgenciesCallback() }))
  }

  return (
    <>
      <PageMetaData title="Agencies" />
      <AgencyTable
        dataSource={agencies.filter(agency => agency.role == AgencyRole.AGENCY)}
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
          onBulkDelete: handleDeleteBulkAgencies,
          onBulkStatus: (status) => handleStatusBulkAgencies(status),
          onDelete: handleDeleteAgency,
          onStatusChange: handleChangeStatus,
          onBalance: (agency) => { setAgency(agency); setBalanceOpen(true) },
          onPricePlans: (agency) => { setAgency(agency); setPlanOpen(true) },
          onReferrer: (agency) => { setAgency(agency); setReferrerOpen(true) },
          onPricePlanMode: handleChangePricePlanMode,
          onDueDate: (agency) => { setAgency(agency); setDuedateOpen(true); },
        }} />
      {/* <AgencyDialog
        agency={agency}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onCreate={handleCreateAgency}
        onUpdate={handleUpdateAgency}
      /> */}
      <AgencyBalanceDialog
        agency={agency}
        open={balanceOpen}
        onCancel={() => setBalanceOpen(false)}
        onAppend={handleAddBalance}
      />
      <AgencyPricePlanDialog
        open={planOpen}
        agency={agency}
        onUpdate={handleUpdatePricePlans}
        onCancel={() => setPlanOpen(false)}
      />
      <AgencyReferrerDialog
        open={referrerOpen}
        agency={agency}
        agencies={agencies}
        onUpdate={handleChangeReferrer}
        onCancel={() => setReferrerOpen(false)}
      />
      <AgencyDueDateDialog
        open={duedateOpen}
        agency={agency}
        onUpdate={handleUpdateDueDate}
        onCancel={() => setDuedateOpen(false)}
      />
      {/* <PasswordDialog
        agency={agency}
        open={passwordOpen}
        onCancel={() => setPasswordOpen(false)}
        onUpdate={handleResetPassword}
      /> */}
    </>
  );
};

export default AdminAgencyListPage;
