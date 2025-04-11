import { Card, Statistic } from "antd";

const StatisticCard = ({ title, value, ...props }) => {
  return (
    <Card>
      <Statistic
        title={<h3 className="text-lg">{title}</h3>}
        value={value}
        // formatter={value => <span className="text-lg">{value}</span>}
        {...props}
      />
    </Card>
  )
}

export default StatisticCard