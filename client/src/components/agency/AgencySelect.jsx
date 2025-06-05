import { Select } from "antd";

const AgencySelect = ({ dataSource, all, ...props }) => {
  const getOptions = (allValue, source) => {
    return allValue
      ? [{ value: '', label: "All Agencies" }].concat(source.map(agency => ({
        value: agency._id,
        label: `${agency.name}`,
      })))
      : source.map(agency => ({
        value: agency._id,
        label: `${agency.name}`,
      }))
  }
  return (
    <Select
      className="min-w-[200px]"
      options={getOptions(all, dataSource)}
      {...props}
    />
  )
};

export default AgencySelect;