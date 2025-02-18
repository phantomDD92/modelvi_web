import React from "react";
import { Select } from "antd";

const PlatformSelect = ({ value, onChange }) => {
  const options = [
    
  ]
  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: '100%' }}
      placeholder="Select Platforms"
      value={value}
      onChange={onChange}
      options={options}
    />
  )
}

export default PlatformSelect