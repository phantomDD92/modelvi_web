import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import qs from 'query-string';
import { Modal } from "antd";

import { PageMetaData } from "@/components/common";
import {
  createModel,
  deleteModel,
  loadModels,
  changeModel,
  syncModel,
  deleteModels,
  syncModels,
} from "@/redux/v2/actions";
import {
  AgencyModelTable,
  AgencyModelEditDialog,
} from "@/components/model";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_REFRESH_TIMEOUT
} from "@/utils/const";

export const AgencyModelPage = () => {

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [model, setModel] = useState();
  // const [search, setSearch] = useState('');

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  const models = useSelector(state => state.v2.models);
  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;
  const search = qs.parse(location.search)?.search || '';

  const loadModelsCallback = useCallback((search) => {
    setLoading(true);
    dispatch(loadModels(search, () => setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    loadModelsCallback(search);
  }, [loadModelsCallback, search])

  useEffect(() => {
    const interval = setInterval(() => {
      loadModelsCallback(search);
    }, DEFAULT_REFRESH_TIMEOUT);
    return () => clearInterval(interval);
  });

  const handleDeleteModel = (model) => {
    if (model.accounts && model.accounts.length > 0) {
      toast.error(`Model (${model.name}) has some associated accounts`);
      return;
    }
    Modal.confirm({
      title: `Are you sure to delete the model(${model.name})?`,
      onOk: () => dispatch(deleteModel(model, () => loadModelsCallback(search))),
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
      onOk: () => dispatch(deleteModels(selectedRowKeys, () => { setSelectedRowKeys([]); loadModelsCallback(search) })),
    });
  }

  const handleSyncBulkModels = () => {
    Modal.confirm({
      title: `Are you sure to sync ${selectedRowKeys.length} models' content?`,
      onOk: () => dispatch(syncModels(selectedRowKeys, () => { setSelectedRowKeys([]); loadModelsCallback(search) })),
    });
  }

  const handleSyncModel = (model) => {
    dispatch(syncModel(model, () => { loadModelsCallback(search); }))
  }

  const handleUpdateModel = (params) => {
    dispatch(changeModel(model, params, () => { setEditOpen(false); loadModelsCallback(search); }))
  }

  const handleCreateModel = (params) => {
    dispatch(createModel(params, () => { setEditOpen(false); loadModelsCallback(search); }));
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ search, page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }
  return (
    <>
      <PageMetaData title="Models" />
      <AgencyModelTable
        filters={{
          search,
          onSearchChange: value => {
            navigate({
              pathname: location.pathname,
              search: createSearchParams({ search: value, page:1, size:pageSize }).toString()
            }, { replace: true });
          }
        }}
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
        actions={{
          onCreate: () => { setModel(); setEditOpen(true); },
          onEdit: (model) => { setModel(model); setEditOpen(true); },
          onDelete: handleDeleteModel,
          onContent: (model) => navigate(`/model/${model._id}`),
          onBulkDelete: handleDeleteBulkModels,
          onBulkSync: handleSyncBulkModels,
          onSync: handleSyncModel,
        }}
      />
      <AgencyModelEditDialog
        open={editOpen}
        model={model}
        onCancel={() => setEditOpen(false)}
        onCreate={handleCreateModel}
        onUpdate={handleUpdateModel}
      />
    </>
  );
};

export default AgencyModelPage;
