import { useState } from "react";
import { Typography, Select } from "antd";

const pricingPlans = [
  { key: "0", price: 50.00, earnings: "$0 ~ $1,000" },
  { key: "1", price: 60.00, earnings: "$1,000 ~ $2,000" },
  { key: "2", price: 65.00, earnings: "$2,000 ~ $5,000" },
  { key: "3", price: 75.00, earnings: "$5,000 ~ $7,500" },
  { key: "4", price: 100.00, earnings: "$7500 ~ $10,000" },
  { key: "5", price: 150.00, earnings: "$10,100 ~ $15,000" },
  { key: "6", price: 200.00, earnings: "$15,000 ~ $30,000" },
  { key: "7", price: 250.00, earnings: "$30,000 +" }
];

const PricePlansView = ({ }) => {
    const [planKey, setPlanKey] = useState("0");
    const getPricePlanOptions = () =>
        pricingPlans.map(plan => ({ value: plan.key, label: plan.earnings }));

    const getPrice = (key) => {
        const item = pricingPlans.find(plan => plan.key == key);
        return (item?.price || 50.00).toFixed(2);
    }

    return (
        <div className="p-4">
            <Typography className="text-xl font-medium mb-4 uppercase text-primary">Pay Monthly</Typography>
            <p className="text-secondary" >*Price Per Model</p>
            <h6 className="my-2 font-medium text-lg">Enter you Creator's monthly earnings:</h6>
            <Select
                className="w-full my-2"
                value={planKey}
                onChange={value => setPlanKey(value)}
                options={getPricePlanOptions()}
            />
            <p>Starting at just</p>
            <div className="flex text-default-950">
                <span className="text-xl font-semibold">$</span>
                <span className="text-3xl font-semibold">{getPrice(planKey)}</span>
                <span className="text-3xl font-semibold">&nbsp;+&nbsp;</span>
                <span className="text-xl font-semibold">$</span>
                <span className="text-3xl font-semibold">10 *</span>
                <span className="text-2xl font-semibold">(amount of platforms)</span>
                <span className="text-xl font-semibold self-end">/mo</span>
            </div>
        </div>
    )
};

export default PricePlansView;