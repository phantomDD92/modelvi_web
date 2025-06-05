import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import qs from 'query-string';
import { Modal } from "antd";
import { PageMetaData } from "@/components/common";
import { AdminModelEditDialog, AdminModelTable } from "@/components/model";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/const";
import { changeModelForAdmin, createModelForAdmin, deleteModelForAdmin, deleteModelsForAdmin, loadAgencyListForAdmin, loadModelsForAdmin, syncModelForAdmin, syncModelsForAdmin } from "@/redux/admin/actions";

const AdminModelPage = () => {

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [model, setModel] = useState();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;
  const search = qs.parse(location.search)?.search || ''
  const agency = qs.parse(location.search)?.agency || ''
  const agencyList = useSelector(state => state.admin.agencyList);
  const models = useSelector(state => state.admin.models);

  const loadModelsCallback = useCallback((agency, search) => {
    setLoading(true);
    dispatch(loadModelsForAdmin(agency, search, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAgencyListForAdmin());
  }, [loadAgencyListForAdmin]);

  useEffect(() => {
    loadModelsCallback(agency, search)
  }, [loadModelsCallback, agency, search])

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  const handleDeleteModel = (model) => {
    if (model.accounts && model.accounts.length > 0) {
      toast.error(`Model (${model.name}) has some associated accounts`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete the model(${model.name})?`,
      onOk: () => dispatch(deleteModelForAdmin(model, () => loadModelsCallback(agency, search))),
    });
  }

  const handleDeleteBulkModels = () => {
    const nonEmptyModels = models.filter(model => selectedRowKeys.includes(model._id) && model.accounts?.length > 0);
    if (nonEmptyModels.length > 0) {
      toast.error(`${nonEmptyModels.length} models have some associated accounts`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} models?`,
      onOk: () => dispatch(deleteModelsForAdmin(selectedRowKeys, () => { setSelectedRowKeys([]); loadModelsCallback(agency, search) })),
    });
  }

  const handleCreateModel = (params) => {
    dispatch(createModelForAdmin(params, () => { setEditOpen(false); loadModelsCallback(agency, search); }))
  }

  const handleUpdateModel = (params) => {
    dispatch(changeModelForAdmin(model, params, () => { setEditOpen(false); loadModelsCallback(agency, search); }));
  }

  const handleSyncBulkModels = () => {
    Modal.confirm({
      title: `Are you sure to sync ${selectedRowKeys.length} models' content?`,
      onOk: () => dispatch(syncModelsForAdmin(selectedRowKeys, () => { setSelectedRowKeys([]); loadModelsCallback(agency, search) })),
    });
  }

  const handleSyncModel = (model) => {
    dispatch(syncModelForAdmin(model, () => { loadModelsCallback(agency, search); }))
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
          onSearchChange: value => {
            navigate({
              pathname: location.pathname,
              search: createSearchParams({ search: value, agency, page: 1, size: pageSize }).toString()
            }, { replace: true });
          },
          onAgencyChange: value => {
            navigate({
              pathname: location.pathname,
              search: createSearchParams({ search, agency: value, page: 1, size: pageSize }).toString()
            }, { replace: true });
          },
        }}
        actions={{
          onDelete: handleDeleteModel,
          onBulkDelete: handleDeleteBulkModels,
          onCreate: () => { setModel(); setEditOpen(true); },
          onEdit: (model) => { setModel(model); setEditOpen(true); },
          onSync: handleSyncModel,
          onBulkSync: handleSyncBulkModels,
          onContent: (model) => navigate(`/admin/model/${model._id}`),
        }}
      />
      <AdminModelEditDialog
        model={model}
        agencies={agencyList}
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onCreate={handleCreateModel}
        onUpdate={handleUpdateModel}
      />
    </>
  )
}

export default AdminModelPage;
