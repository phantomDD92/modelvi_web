import { capitalize, getLogAction } from "@/utils/string";
import { Select } from "antd";

const LogSelect = ({ dataSource, all, ...props }) => {
    const getOptions = (allValue, source) => {
        return allValue
            ? [{ value: -1, label: "All History" }].concat(source.map(action => ({
                key: `log${action}`,
                value: action,
                label: capitalize(getLogAction(action)),
            })))
            : source.map(action => ({
                key: `log${action}`,
                value: action,
                label: capitalize(getLogAction(action)),
            }))
    }
    return (
        <Select
            className="min-w-[200px]"
            options={getOptions(all, dataSource)}
            // showSearch
            // filterOption={(input, option) =>
            //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            // }
            {...props}
        />
    )
};

export default LogSelect;