import { Modal } from "antd";
import { useEffect, useState } from "react";
import AgencyPricePlanTable from "./AgencyPricePlanTable";
import { Platform } from "@/utils/const";

const DEFAULT_PRICE_PLANS = [
    { "key": "0", price: 50.00, revenue: "$0 ~ $2500" },
    { "key": "1", price: 65.00, revenue: "$2500 ~ $5000" },
    { "key": "2", price: 85.00, revenue: "$5000 ~ $7500" },
    { "key": "3", price: 100.00, revenue: "$7500 ~ $15000" },
    { "key": "4", price: 125.00, revenue: "$15000 ~ $20000" },
    { "key": "5", price: 150.00, revenue: "$20000 +" }
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
            [Platform.KNKY]: pricePlans && pricePlans[Platform.KNKY] ? pricePlans[Platform.KNKY][index] : plan.price,
            [Platform.FNC]: pricePlans && pricePlans[Platform.FNC] ? pricePlans[Platform.FNC][index] : plan.price,
            [Platform.FAN]: pricePlans && pricePlans[Platform.FAN] ? pricePlans[Platform.FAN][index] : plan.price,
            [Platform.LOYALFANS]: pricePlans && pricePlans[Platform.LOYALFANS] ? pricePlans[Platform.LOYALFANS][index] : plan.price,
            [Platform.MALOUM]: pricePlans && pricePlans[Platform.MALOUM] ? pricePlans[Platform.MALOUM][index] : plan.price,
            [Platform.FANVUE]: pricePlans && pricePlans[Platform.FANVUE] ? pricePlans[Platform.FANVUE][index] : plan.price,
            [Platform.FOURBASED]: pricePlans && pricePlans[Platform.FOURBASED] ? pricePlans[Platform.FOURBASED][index] : plan.price,
            [Platform.MYMFANS]: pricePlans && pricePlans[Platform.MYMFANS] ? pricePlans[Platform.MYMFANS][index] : plan.price,
        }))
        setDataSource(newDataSource);
    }, [agency]);

    const getPricePlans = (source) => {
        const plans = {
            [Platform.F2F]: Array(8).fill(0),
            [Platform.KNKY]: Array(8).fill(0),
            [Platform.FNC]: Array(8).fill(0),
            [Platform.FAN]: Array(8).fill(0),
            [Platform.LOYALFANS]: Array(8).fill(0),
            [Platform.MALOUM]: Array(8).fill(0),
            [Platform.FANVUE]: Array(8).fill(0),
            [Platform.FOURBASED]: Array(8).fill(0),
            [Platform.MYMFANS]: Array(8).fill(0),
        }
        for (var i = 0; i < source.length; i++) {
            plans[Platform.F2F][i] = source[i][Platform.F2F];
            plans[Platform.KNKY][i] = source[i][Platform.KNKY]
            plans[Platform.FNC][i] = source[i][Platform.FNC]
            plans[Platform.FAN][i] = source[i][Platform.FAN]
            plans[Platform.LOYALFANS][i] = source[i][Platform.LOYALFANS]
            plans[Platform.MALOUM][i] = source[i][Platform.MALOUM]
            plans[Platform.FANVUE][i] = source[i][Platform.FANVUE]
            plans[Platform.FOURBASED][i] = source[i][Platform.FOURBASED]
            plans[Platform.MYMFANS][i] = source[i][Platform.MYMFANS]
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
            width={1000}
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