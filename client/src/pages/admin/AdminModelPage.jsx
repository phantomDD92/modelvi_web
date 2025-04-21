import React, { useCallback, useEffect, useState } from "react";
import { PageMetaData } from "@/components/common";
import { useDispatch, useSelector } from "react-redux";
import { loadAgencyListForAdmin, loadModelsForAdmin } from "@/redux/admin/actions";
import { AdminModelTable } from "@/components/model";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

const AdminModelPage = () => {

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [agency, setAgency] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const agencyList = useSelector(state => state.admin.agencyList);
  const models = useSelector(state => state.admin.models);

  const loadModelStatsCallback = useCallback((agency, search) => {
    setLoading(true);
    dispatch(loadModelsForAdmin(agency, search, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAgencyListForAdmin());
  }, [loadAgencyListForAdmin]);

  useEffect(() => {
    loadModelStatsCallback(agency, search)
  }, [loadModelStatsCallback, agency, search])

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  return (
    <>
      <PageMetaData title="Models" admin />
      <AdminModelTable
        dataSource={models}
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
          onAgencyChange: value => setAgency(value)
        }}
      />
    </>
  )
}

export default AdminModelPage;
