import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAgencyStatus, createAgency as createAgency, deleteAgency, loadAgencies, updateAgency } from "@/redux/dashboard/actions";
import AgencyTable from "@/components/manager/AgencyTable";
import AgencyDialog from "@/components/manager/AgencyDialog";

export const ManagerList = () => {
  const dispatch = useDispatch()
  const homeProps = useSelector(state => state.home)
  const [visible, setVisible] = useState(false);
  const [agency, setAgency] = useState();

  useEffect(() => {
    dispatch(loadAgencies());
  }, [loadAgencies])

  const handleReloadData = () => {
    dispatch(loadAgencies());
    setVisible(false)
  }
  const handleDeleteAgency = (user) => {
    dispatch(deleteAgency(user, handleReloadData));
  }

  const handleCreateClicked = () => {
    setAgency();
    setVisible(true)
  }

  const handleEditClicked = (agency) => {
    setAgency(agency)
    setVisible(true)
  }

  const handleUpdateAgency = (agency, params) => {
    dispatch(updateAgency(agency, params, handleReloadData))
  }

  const handleCreateAgency = (agency) => {
    dispatch(createAgency(agency, handleReloadData))
  }

  const handleChangeStatus = (agency, status) => {
    dispatch(changeAgencyStatus(agency, status, handleReloadData));
  }
  return (
    <div>
      <AgencyTable
        agencies={homeProps.managers}
        onCreate={handleCreateClicked}
        onDelete={handleDeleteAgency}
        onEdit={handleEditClicked}
        onStatusChange={handleChangeStatus}
      />
      <AgencyDialog
        agency={agency}
        open={visible}
        onCancel={() => setVisible(false)}
        onCreate={handleCreateAgency}
        onUpdate={handleUpdateAgency}
      />
    </div>
  );
};

export default ManagerList;
