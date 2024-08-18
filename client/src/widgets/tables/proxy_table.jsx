import React from "react";
import { Table } from "antd";
import moment from "moment";

export const ProxyTable = ({ proxies }) => {
    const columns = [
        {
            key: 'url',
            title: 'Proxy',
            dataIndex: 'url'
        },
        {
            key: 'expiry',
            title: 'Expiry',
            dataIndex: 'deadline',
            render: (value) => moment(value).format("YYYY-MM-DD")
        },
        {
            key: 'status',
            title: 'Expiry',
            dataIndex: 'deadline',
            render: (value) => moment(value).format("YYYY-MM-DD")
        },
    ]
    return (
        <Table
            pagination={{ position: ["topRight", "bottomRight"] }}
            rowKey={row => row._id}
            columns={columns}
            dataSource={proxies}
        />
    )
}

export default ProxyTable