import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import { Modal } from "antd";
import {
  changeModelOwner,
  createModel,
  deleteModel,
  loadModels,
  changeModel,
  deleteBulkModels,
  syncBulkModels,
  syncModel,
  // updateModelProfile 
} from "@/redux/model/actions";
import {
  ModelTable,
  ModelEditDialog,
  ModelOwnerDialog,
} from "@/components/model";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_REFRESH_TIMEOUT
} from "@/utils/const";
import toast from "react-hot-toast";

export const ModelListPage = () => {

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [agencyOpen, setAgencyOpen] = useState(false);
  const [model, setModel] = useState();

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  const modelProps = useSelector(state => state.model)
  const homeProps = useSelector(state => state.home)
  const models = useSelector(state => state.model.models);
  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const loadModelsCallback = useCallback(() => {
    setLoading(true);
    dispatch(loadModels(() => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadModelsCallback();
  }, [loadModelsCallback])

  useEffect(() => {
    const interval = setInterval(() => {
      loadModelsCallback();
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  // const handleProfileClick = (model) => {
  //   setModel(model)
  //   setProfileOpen(true);
  // }

  const handleDeleteModel = (model) => {
    if (model.accounts && model.accounts.length > 0) {
      toast.error(`Model (${model.name}) has some associated accounts`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete the model(${model.name})?`,
      onOk: () => dispatch(deleteModel(model, () => loadModelsCallback())),
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
      onOk: () => dispatch(deleteBulkModels(selectedRowKeys, () => loadModelsCallback())),
    });
  }

  const handleSyncBulkModels = () => {
    Modal.confirm({
      title: `Are you sure to sync ${selectedRowKeys.length} models' content?`,
      onOk: () => dispatch(syncBulkModels(selectedRowKeys, () => loadModelsCallback())),
    });
  }

  const handleSyncModel = (model) => {
    dispatch(syncModel(model, () => { loadModelsCallback(); }))
  }

  const handleUpdateModel = (model, params) => {
    dispatch(changeModel(model, params, () => { setEditOpen(false); loadModelsCallback(); }))
  }

  const handleCreateModel = (params) => {
    dispatch(createModel(params, () => { setEditOpen(false); loadModelsCallback(); }));
  }

  const handleChangeAgency = (params) => {
    dispatch(changeModelOwner(model, params, () => { setAgencyOpen(false); loadModelsCallback(); }));
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }
  return (
    <>
      <ModelTable
        auth={homeProps.auth}
        dataSource={modelProps.models}
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
          onCreate: () => { setModel(); setEditOpen(true); },
          onEdit: (model) => { setModel(model); setEditOpen(true); },
          onDelete: handleDeleteModel,
          onContent: (model) => navigate(`/model/${model._id}`),
          onAgencyChange: (model) => { setModel(model); setAgencyOpen(true); },
          onBulkDelete: handleDeleteBulkModels,
          onBulkSync: handleSyncBulkModels,
          onSync: handleSyncModel,
          // onProfile: (model) => { setModel(model); setProfileOpen(true); },
        }}
      />
      <ModelEditDialog
        open={editOpen}
        model={model}
        onCancel={() => setEditOpen(false)}
        onCreate={handleCreateModel}
        onUpdate={handleUpdateModel}
      />
      <ModelOwnerDialog
        open={agencyOpen}
        model={model}
        onCancel={() => setAgencyOpen(false)}
        onUpdate={handleChangeAgency}
      />
      {/* <ProfileDialog
        open={profileOpen}
        model={model}
        onCancel={() => setProfileOpen(false)}
        onUpdate={handleProfileUpdate}
      /> */}
    </>
  );
};

export default ModelListPage;
