import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";
import {
  changeAgencyStatus,
  createAgency,
  deleteAgency,
  updateAgency,
  loadAgencies,
  resetAgencyPassword,
  updateDB,
  deleteBulkAgencies,
  updateBulkAgenciesStatus
} from "@/redux/dashboard/actions";
import {
  AgencyTable,
  AgencyDialog,
  PasswordDialog
} from "@/components/agency";
import { AgencyRole, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_REFRESH_TIMEOUT } from "@/utils/const";

export const AgencyListPage = () => {

  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [agency, setAgency] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();
  const homeProps = useSelector(state => state.home)

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
    dispatch(loadAgencies(() => setLoading(false)));
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
      onOk: () => { dispatch(deleteAgency(agency, () => { loadAgenciesCallback() })); },
    });
  }

  const handleUpdateAgency = (agency, params) => {
    dispatch(updateAgency(agency, params, () => { loadAgenciesCallback(); setEditOpen(false); }))
  }

  const handleCreateAgency = (agency) => {
    dispatch(createAgency(agency, () => { loadAgenciesCallback(); setEditOpen(false); }))
  }

  const handleChangeStatus = (agency, status) => {
    dispatch(changeAgencyStatus(agency, status, () => { loadAgenciesCallback() }));
  }

  const handleUpdateDB = () => {
    dispatch(updateDB());
  }

  const handleResetPassword = (agency, password) => {
    dispatch(resetAgencyPassword(agency, password, () => setPasswordOpen(false)));
  }

  const handleStatusBulkAgencies = (status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} ${selectedRowKeys.length} agencies?`,
      onOk: () => { dispatch(updateBulkAgenciesStatus(selectedRowKeys, status, () => { setSelectedRowKeys([]); loadAgenciesCallback() })); },
    });
  }

  const handleDeleteBulkAgencies = () => {
    console.log(homeProps.modelStats)
    console.log(homeProps.accountStats)
    // Modal.confirm({
    //   title: `Are you sure to delete ${selectedRowKeys.length} agencies?`,
    //   onOk: () => { dispatch(deleteBulkAgencies(selectedRowKeys, () => { setSelectedRowKeys([]); loadAgenciesCallback() })); },
    // });
  }

  return (
    <>
      <AgencyTable
        dataSource={homeProps.managers.filter(manager => manager.role == AgencyRole.AGENCY)}
        modelStats={homeProps.modelStats}
        accountStats={homeProps.accountStats}
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
          onCreate: () => { setAgency(); setEditOpen(true); },
          onEdit: (agency) => { setAgency(agency); setEditOpen(true) },
          onDelete: handleDeleteAgency,
          onStatusChange: handleChangeStatus,
          onPasswordReset: (agency) => { setAgency(agency); setPasswordOpen(true) },
          // onUpdateDB: handleUpdateDB
        }} />
      <AgencyDialog
        agency={agency}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onCreate={handleCreateAgency}
        onUpdate={handleUpdateAgency}
      />
      <PasswordDialog
        agency={agency}
        open={passwordOpen}
        onCancel={() => setPasswordOpen(false)}
        onUpdate={handleResetPassword}
      />
    </>
  );
};

export default AgencyListPage;
