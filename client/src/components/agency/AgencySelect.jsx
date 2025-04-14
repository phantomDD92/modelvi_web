import { Select } from "antd";

const AgencySelect = ({ dataSource, ...props }) => {
  return (
    <Select
      className="min-w-[200px]"
      options={dataSource.map(agency => ({
        value: agency._id,
        label: `${agency.name}`,
      }))}
      {...props}
    />
  )
};

export default AgencySelect;