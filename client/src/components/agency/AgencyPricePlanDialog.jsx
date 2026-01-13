import { InputNumber, Modal } from "antd";
import { useEffect, useState } from "react";
import AgencyPricePlanTable from "./AgencyPricePlanTable";
import { Platform, PricePlanMode } from "@/utils/const";
import AgencyModelPricePlanTable from "./AgencyModelPricePlanTable";

const DEFAULT_ACCOUNT_PRICE_PLANS = [
    { "key": "0", price: 50.00, revenue: "$0 ~ $2500" },
    { "key": "1", price: 65.00, revenue: "$2500 ~ $5000" },
    { "key": "2", price: 85.00, revenue: "$5000 ~ $7500" },
    { "key": "3", price: 100.00, revenue: "$7500 ~ $15000" },
    { "key": "4", price: 125.00, revenue: "$15000 ~ $20000" },
    { "key": "5", price: 150.00, revenue: "$20000 +" }
];

const DEFAULT_MODEL_PRICE_PLANS = [
    { "key": "0", price: 50.00, revenue: "$0 ~ $1000" },
    { "key": "1", price: 60.00, revenue: "$1000 ~ $2000" },
    { "key": "2", price: 65.00, revenue: "$2000 ~ $5000" },
    { "key": "3", price: 75.00, revenue: "$5000 ~ $7500" },
    { "key": "4", price: 100.00, revenue: "$7500 ~ $10000" },
    { "key": "5", price: 150.00, revenue: "$10000 ~ $15000" },
    { "key": "6", price: 200.00, revenue: "$15000 ~ $30000" },
    { "key": "7", price: 250.00, revenue: "$30000 +" }
];

const AgencyPricePlanDialog = ({
    open,
    agency,
    onUpdate,
    onCancel,
}) => {

    const [dataSource, setDataSource] = useState([]);
    const [plusFee, setPlusFee] = useState(10);
    useEffect(() => {
        const pricePlans = agency?.pricePlans;
        let newDataSource;
        if (agency?.pricePlanMode == PricePlanMode.PER_ACCOUNT)
            newDataSource = DEFAULT_ACCOUNT_PRICE_PLANS.map((plan, index) => ({
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
                [Platform.ONLYFANS]: pricePlans && pricePlans[Platform.ONLYFANS] ? pricePlans[Platform.ONLYFANS][index] : plan.price,
                [Platform.FETLIFE]: pricePlans && pricePlans[Platform.FETLIFE] ? pricePlans[Platform.FETLIFE][index] : plan.price,
            }))
        else
            newDataSource = DEFAULT_MODEL_PRICE_PLANS.map((plan, index) => ({
                ...plan,
                "MODEL": pricePlans && pricePlans["MODEL"] ? pricePlans["MODEL"][index] : plan.price,
            }))
        setPlusFee(agency?.pricePlans ? (agency.pricePlans["PLUS"] || 10) : 10)
        setDataSource(newDataSource);
    }, [agency]);

    const getPricePlans = (source) => {
        let plans;
        if (agency?.pricePlanMode == PricePlanMode.PER_ACCOUNT) {
            plans = {
                [Platform.F2F]: Array(8).fill(0),
                [Platform.KNKY]: Array(8).fill(0),
                [Platform.FNC]: Array(8).fill(0),
                [Platform.FAN]: Array(8).fill(0),
                [Platform.LOYALFANS]: Array(8).fill(0),
                [Platform.MALOUM]: Array(8).fill(0),
                [Platform.FANVUE]: Array(8).fill(0),
                [Platform.FOURBASED]: Array(8).fill(0),
                [Platform.MYMFANS]: Array(8).fill(0),
                [Platform.ONLYFANS]: Array(8).fill(0),
                [Platform.FETLIFE]: Array(8).fill(0),
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
                plans[Platform.ONLYFANS][i] = source[i][Platform.ONLYFANS]
                plans[Platform.FETLIFE][i] = source[i][Platform.FETLIFE]
            }
        } else {
            plans = {
                "MODEL": Array(8).fill(0),
                "PLUS" : plusFee
            }
            for (var i = 0; i < source.length; i++) {
                plans["MODEL"][i] = source[i]["MODEL"];
            }
        }

        return { ...agency.pricePlans, ...plans };
    };

    const handleOkClick = () => {
        const plans = getPricePlans(dataSource);
        onUpdate && onUpdate(plans);
    }

    return (
        <Modal
            title={`${agency?.name || "Agency"}'s Price Plans`}
            open={open}
            width={1500}
            onOk={handleOkClick}
            onCancel={onCancel}>
            {agency?.pricePlanMode == PricePlanMode.PER_ACCOUNT ?
                <AgencyPricePlanTable
                    dataSource={dataSource}
                    onChange={value => setDataSource(value)}
                />
                : <>
                    <InputNumber addonBefore="Plus Fee Per Account :" className="mb-5" prefix="+" value={plusFee} onChange={value => setPlusFee(value)}/>
                    <AgencyModelPricePlanTable
                        dataSource={dataSource}
                        onChange={value => setDataSource(value)}
                    />
                </>
            }
        </Modal>
    )
}

export default AgencyPricePlanDialog;