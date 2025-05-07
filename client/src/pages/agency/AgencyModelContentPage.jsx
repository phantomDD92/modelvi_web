import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import {
  appendModelContent,
  clearModelContents,
  deleteModelContents,
  deleteModelContent,
  getModelContents,
  syncModel,
  updateModelContentsPlatform,
  updateModelContent
} from "@/redux/v2/actions";
import {
  ModelContentTable,
  ModelContentDialog
} from "@/components/model";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "@/utils/const";
import { Modal } from "antd";
import ModelPlatformDialog from "@/components/model/ModelPlatformDialog";

export const AgencyModelContentPage = () => {

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [content, setContent] = useState()
  const [editOpen, setEditOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const routeParams = useParams()

  const page = parseInt(qs.parse(location.search).page) || DEFAULT_CURRENT_PAGE;
  const pageSize = parseInt(qs.parse(location.search).size) || DEFAULT_PAGE_SIZE;

  const model = useSelector(state => state.v2.contentModel);
  const loadModelContentCallback = useCallback(() => {
    setLoading(true);
    dispatch(getModelContents(routeParams.modelId, () => setLoading(false)))
  }, [dispatch]);

  useEffect(() => {
    loadModelContentCallback()
  }, [loadModelContentCallback])


  const handleUpdateContent = (params) => {
    console.log(params)
    // if (content) {
    //   dispatch(updateModelContent(model, content, params, () => setEditOpen(false)));
    // } else {
    //   dispatch(appendModelContent(model, params, () => setEditOpen(false)));
    // }
  }

  const handleDeleteContent = (content) => {
    Modal.confirm({
      title: `Are you sure to delete a model's content?`,
      onOk: () => dispatch(deleteModelContent(model, content)),
    });
  }

  const handleDeleteBulkContents = () => {
    Modal.confirm({
      title: `Are you sure to delete ${selectedRowKeys.length} model's contents?`,
      onOk: () => dispatch(deleteModelContents(model, selectedRowKeys, () => setSelectedRowKeys([]))),
    });
  }

  const handleUpdateBulkPlatforms = (params) => {
    dispatch(updateModelContentsPlatform(model, selectedRowKeys, params, () => { setPlatformOpen(false); setSelectedRowKeys([]) }))
  }


  const handleClearContents = () => {
    Modal.confirm({
      title: `Are you sure to clear model's all contents?`,
      onOk: () => dispatch(clearModelContents(model)),
    });
  }

  const handleSyncContents = () => {
    dispatch(syncModel(model, () => loadModelContentCallback()));
  }

  const handleChangePagination = (pageValue, pageSizeValue) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pageValue, size: pageSizeValue }).toString()
    }, { replace: true });
  }

  return (
    <div>
      <ModelContentTable
        model={model}
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
          onCreate: () => { setContent(); setEditOpen(true); },
          onEdit: (content) => { setContent(content); setEditOpen(true) },
          onClear: handleClearContents,
          onSync: handleSyncContents,
          onDelete: handleDeleteContent,
          onBack: () => navigate(-1),
          onBulkDelete: handleDeleteBulkContents,
          onBulkPlatform: () => setPlatformOpen(true),
        }}
      />
      <ModelContentDialog
        open={editOpen}
        content={content}
        onCancel={() => setEditOpen(false)}
        onUpdate={handleUpdateContent}
      />
      <ModelPlatformDialog
        open={platformOpen}
        onCancel={() => setPlatformOpen(false)}
        onUpdate={handleUpdateBulkPlatforms}
      />
    </div>
  );
};

export default AgencyModelContentPage;
