import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAgency, createModel, deleteModel, loadModels, updateModel, updateProfile } from "@/redux/model/actions";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import qs from 'query-string';
import ModelTable from "@/components/model/ModelTable";
import ModelDialog from "@/components/model/ModelDialog";
import ProfileDialog from "@/components/model/ProfileDialog";
import { Modal } from "antd";
import OwnerDialog from "@/components/account/OwnerDialog";

export const ModelList = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [agencyOpen, setAgencyOpen] = useState(false);
  const [model, setModel] = useState();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const page = parseInt(qs.parse(location.search).page) || 1;
  const pageSize = parseInt(qs.parse(location.search).size) || 10;
  const modelProps = useSelector(state => state.model)
  const homeProps = useSelector(state => state.home)

  useEffect(() => {
    dispatch(loadModels({ page, pageSize }));
  }, [loadModels, page, pageSize])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(loadModels({ page, pageSize }));
    }, 60000);
    return () => clearInterval(interval);
  });

  const handleProfileClick = (model) => {
    setModel(model)
    setProfileOpen(true);
  }

  const handleContentButtonClick = (model) => {
    navigate(`/model/${model._id}`);
  }


  const handleDeleteModel = (model) => {
    Modal.confirm({
      title: "Are you sure to delete this model?",
      onOk: () => { dispatch(deleteModel(model, handleReloadData)) },
    });
  }

  const handleReloadData = () => {
    dispatch(loadModels({ page, pageSize }));
    setVisible(false);
    setProfileOpen(false);
    setAgencyOpen(false);
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

  const handlePageChange = (pg, pgSize) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ page: pg, size: pgSize }).toString()
    }, { replace: true });
  }

  const handleChangeAgency = (model, params) => {
    dispatch(changeAgency(model, params, handleReloadData));
  }

  return (
    <div>
      <ModelTable
        page={page}
        pageSize={pageSize}
        auth={homeProps.auth}
        models={modelProps.models}
        modelsCount={modelProps.modelsCount}
        onCreate={handleCreateButtonClick}
        onPageChange={handlePageChange}
        onEdit={handleEditButtonClick}
        onDelete={handleDeleteModel}
        onContent={handleContentButtonClick}
        onProfile={handleProfileClick}
        onAgencyChange={(model) => {
          setModel(model);
          setAgencyOpen(true);
        }}
      />
      <ModelDialog
        open={visible}
        model={model}
        onCancel={() => setVisible(false)}
        onCreate={handleCreateModel}
        onUpdate={handleUpdateModel}
      />
      <OwnerDialog
        open={agencyOpen}
        model={model}
        onCancel={() => setAgencyOpen(false)}
        onUpdate={handleChangeAgency}
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
