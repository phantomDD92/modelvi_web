import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appendModelContent, clearModelContents, deleteModelContent, getModelContent, syncModelContents, updateModelContent } from "@/redux/model/actions";
import { useNavigate, useParams } from "react-router-dom";
import ModelContentTable from "@/components/model/ModelContentTable";
import ModelContentDialog from "@/components/model/ModelContentDialog";

export const ModelContent = () => {
  const dispatch = useDispatch()
  const modelProps = useSelector(state => state.model)
  const homeProps = useSelector(state => state.home)
  const [content, setContent] = useState()
  const [visible, setVisible] = useState(false);
  const routeParams = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getModelContent(routeParams.modelId))
  }, [getModelContent, routeParams.modelId])

  const handleReloadData = () => {
    dispatch(getModelContent(routeParams.modelId));
    setVisible(false)
  }

  const handleUpdateContent = (params) => {
    if (content) {
      dispatch(updateModelContent(routeParams.modelId, content, params, handleReloadData));
    } else {
      dispatch(appendModelContent(routeParams.modelId, params, handleReloadData));
    }
  }

  const handleDeleteContent = (content) => {
    dispatch(deleteModelContent(routeParams.modelId, content))
  }

  const handleCreateButtonClick = () => {
    setContent();
    setVisible(true)
  }

  const handleEditButtonClick = (content) => {
    setContent(content);
    setVisible(true)
  }

  const handleClearContents = () => {
    dispatch(clearModelContents(routeParams.modelId));
  }

  const handleSyncContents = () => {
    dispatch(syncModelContents(routeParams.modelId));
  }

  return (
    <div>
      <ModelContentTable
        auth={homeProps.auth}
        model={modelProps.contentModel}
        onCreate={handleCreateButtonClick}
        onEdit={handleEditButtonClick}
        onClear={handleClearContents}
        onSync={handleSyncContents}
        onDelete={handleDeleteContent}
        onBack={() => navigate(-1)}
      />
      <ModelContentDialog
        open={visible}
        content={content}
        onCancel={() => setVisible(false)}
        onUpdate={handleUpdateContent}
      />
    </div>
  );
};

export default ModelContent;
