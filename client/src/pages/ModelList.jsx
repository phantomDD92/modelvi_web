import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createModel, deleteModel, loadModels, updateModel, updateProfile } from "@/redux/model/actions";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import ModelTable from "@/components/model/ModelTable";
import ModelDialog from "@/components/model/ModelDialog";
import ProfileDialog from "@/components/model/ProfileDialog";

export const ModelList = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [model, setModel] = useState();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;
  const modelProps = useSelector(state => state.model)
  const homeProps = useSelector(state => state.home)

  useEffect(() => {
    dispatch(loadModels({ page, pageSize: 10 }));
  }, [loadModels, page])

  const handleProfileClick = (model) => {
    setModel(model)
    setProfileOpen(true);
  }

  const handleContentButtonClick = (model) => {
    navigate(`/model/${model._id}`);
  }


  const handleDeleteModel = (model) => {
    dispatch(deleteModel(model, handleReloadData));
  }

  const handleReloadData = () => {
    dispatch(loadModels({ page, pageSize: 10 }));
    setVisible(false)
    setProfileOpen(false)
  }

  const handleUpdateModel = (model, params) => {
    dispatch(updateModel(model, params, handleReloadData))
  }

  const handleCreateModel = (params) => {
    dispatch(createModel(params, handleReloadData));
  }

  const handleCreateButtonClick = () => {
    setModel();
    setVisible(true)
  }

  const handleEditButtonClick = (model) => {
    setModel(model);
    setVisible(true);
  }

  const handleProfileUpdate = (model, params) => {
    dispatch(updateProfile(model, params, handleReloadData));
  }

  const handlePageChange = (pg) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pg }).toString()
    }, { replace: true });
  }

  return (
    <div>
      <ModelTable
        page={page}
        auth={homeProps.auth}
        models={modelProps.models}
        modelsCount={modelProps.modelsCount}
        onCreate={handleCreateButtonClick}
        onPageChange={handlePageChange}
        onEdit={handleEditButtonClick}
        onDelete={handleDeleteModel}
        onContent={handleContentButtonClick}
        onProfile={handleProfileClick}
      />
      <ModelDialog
        open={visible}
        model={model}
        onCancel={() => setVisible(false)}
        onCreate={handleCreateModel}
        onUpdate={handleUpdateModel}
      />
      <ProfileDialog
        open={profileOpen}
        model={model}
        onCancel={() => setProfileOpen(false)}
        onUpdate={handleProfileUpdate}
      />
    </div>

  );
};

export default ModelList;
