import { Card } from "antd";
import Chart from 'react-apexcharts';

const AffiliateRevenueChart = ({dataSource}) => {
  // Chart configuration
  const options = {
    chart: {
      id: 'three-line-chart',
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      width: [3, 3, 3],
      curve: 'smooth',
    },
    colors: ['#008FFB', '#00E396', '#FEB019'], // Blue, Green, Orange
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    markers: {
      size: 5,
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    yaxis: {
      title: {
        text: 'Values',
      },
    },
  };
  const getSeries = (data) => {
    const earningsData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var element of data) {
      earningsData[element.month - 1] = element.totalEarnings || 0;
    }
    return [
      {
        name: 'Revenue',
        data: earningsData,
      },
    ];
  }
  return (
    <Card title="Affiliate Revenue">
      <Chart
        options={options}
        series={getSeries(dataSource || [])}
        type="line"
        height={400}
      />
    </Card>
  )
}

export default AffiliateRevenueChart;