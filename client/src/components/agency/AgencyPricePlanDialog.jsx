import { Modal, Form, Input, Row, Col, InputNumber } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StyledInput from "../common/StyledInput";
import AgencyPricePlanTable from "./AgencyPricePlanTable";
import { Platform } from "@/utils/const";

const DEFAULT_PRICE_PLANS = [
    { "key": "0", price: 50.00, revenue: "$0 ~ $1000" },
    { "key": "1", price: 75.00, revenue: "$1000 ~ $2500" },
    { "key": "2", price: 75.00, revenue: "$2500 ~ $5000" },
    { "key": "3", price: 100.00, revenue: "$5000 ~ $7500" },
    { "key": "4", price: 100.00, revenue: "$7500 ~ $10000" },
    { "key": "5", price: 125.00, revenue: "$10000 ~ $15000" },
    { "key": "6", price: 150.00, revenue: "$15000 ~ $20000" },
    { "key": "7", price: 200.00, revenue: "$20000 +" }
];

const AgencyPricePlanDialog = ({
    open,
    agency,
    onUpdate,
    onCancel,
}) => {

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const pricePlans = agency?.pricePlans;
        const newDataSource = DEFAULT_PRICE_PLANS.map((plan, index) => ({
            ...plan,
            [Platform.F2F]: pricePlans && pricePlans[Platform.F2F] ? pricePlans[Platform.F2F][index] : plan.price,
            [Platform.FNC]: pricePlans && pricePlans[Platform.FNC] ? pricePlans[Platform.FNC][index] : plan.price,
            [Platform.FAN]: pricePlans && pricePlans[Platform.FAN] ? pricePlans[Platform.FAN][index] : plan.price,
            [Platform.KNKY]: pricePlans && pricePlans[Platform.KNKY] ? pricePlans[Platform.KNKY][index] : plan.price,
            [Platform.MALOUM]: pricePlans && pricePlans[Platform.MALOUM] ? pricePlans[Platform.MALOUM][index] : plan.price,
        }))
        setDataSource(newDataSource);
    }, [agency]);

    const getPricePlans = (source) => {
        const plans = {
            [Platform.F2F]: Array(8).fill(0),
            [Platform.FNC]: Array(8).fill(0),
            [Platform.FAN]: Array(8).fill(0),
            [Platform.KNKY]: Array(8).fill(0),
            [Platform.MALOUM]: Array(8).fill(0),
        }
        for (var i = 0; i < source.length; i++) {
            plans[Platform.F2F][i] = source[i][Platform.F2F];
            plans[Platform.FNC][i] = source[i][Platform.FNC]
            plans[Platform.FAN][i] = source[i][Platform.FAN]
            plans[Platform.KNKY][i] = source[i][Platform.KNKY]
            plans[Platform.MALOUM][i] = source[i][Platform.MALOUM]
        }
        return plans;
    };

    const handleOkClick = () => {
        const plans = getPricePlans(dataSource);
        onUpdate && onUpdate(plans);
    }


    return (
        <Modal
            title={`${agency?.name || "Agency"}'s Price Plans`}
            open={open}
            width={800}
            onOk={handleOkClick}
            onCancel={onCancel}>
            <AgencyPricePlanTable
                dataSource={dataSource}
                onChange={value => setDataSource(value)}
            />
        </Modal>
    )
}

export default AgencyPricePlanDialog;