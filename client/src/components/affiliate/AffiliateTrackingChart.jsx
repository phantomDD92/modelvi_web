import { Card } from "antd";
import Chart from 'react-apexcharts';

const AffiliateTrackingChart = ({ dataSource }) => {
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
    const clickData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const attemptData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const finalData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var element of data) {
      clickData[element.month - 1] = element.clicks || 0;
      attemptData[element.month - 1] = element.attempts || 0;
      finalData[element.month - 1] = element.completions || 0;
    }
    return [
      {
        name: 'Clicks',
        data: clickData,
      },
      {
        name: 'Attempted Registrations',
        data: attemptData,
      },
      {
        name: 'Finalized Registrations',
        data: finalData,
      },
    ];
  }

  return (
    <Card title="Affiliate Tracking">
      <Chart
        options={options}
        series={getSeries(dataSource || [])}
        type="line"
        height={400}
      />
    </Card>
  )
}

export default AffiliateTrackingChart;