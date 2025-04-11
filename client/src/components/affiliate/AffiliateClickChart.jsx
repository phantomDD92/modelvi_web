import { Card, Select } from "antd";
import moment from "moment";
import Chart from 'react-apexcharts';

const AffiliateClickChart = ({ time, dataSource, onTimeChange }) => {
  const getDateLabel = (time, date) => {
    switch (time) {
      case 'day':
        return date.format("MM-DD");
      case 'month':
        return date.format("MMM");
      case 'week':
        return date.format("ww");

      default:
        return date.format("MM-DD");
        break
    }
  }
  const getOptions = (time) => {
    let categories, count;
    let startDate;
    switch (time) {
      case "day":
        categories = new Array(16).fill("");
        count = 16;
        startDate = moment().startOf("day").subtract(15, "day");
        break
      case "week":
        categories = new Array(11).fill(0);
        count = 11;
        startDate = moment().startOf("week").subtract(10, "week");
        break
      case "month":
        categories = new Array(13).fill(0);
        count = 13;
        startDate = moment().startOf("month").subtract(12, "month");
        break
      default:
        categories = new Array(16).fill(0);
        count = 16;
        startDate = moment().startOf("day").subtract(15, "day");
        break
    }
    for (var i = 0; i < count; i++) {
      categories[i] = getDateLabel(time, startDate)
      startDate.add(1, time);
    }

    return ({
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
        categories: categories,
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
    })
  }

  const getDate = (time, date) => {
    switch (time) {
      case 'day':
        return moment([date.year, date.month - 1, date.day]);
      case 'month':
        return moment([date.year, date.month - 1]);
      case 'week':
        return moment().isoWeekYear(date.year).isoWeek(date.week)
      default:
        return moment([date.year, date.month - 1, date.day]);
    }
  }

  const getSeries = (time, data) => {
    let clickData, attemptData, finalData;
    let startDate;
    switch (time) {
      case "day":
        clickData = attemptData = finalData = new Array(16).fill(0);
        startDate = moment().startOf("day").subtract(15, "day");
        break
      case "week":
        clickData = attemptData = finalData = new Array(11).fill(0);
        startDate = moment().startOf("week").subtract(10, "week");
        break
      case "month":
        clickData = attemptData = finalData = new Array(13).fill(0);
        startDate = moment().startOf("month").subtract(12, "month");
        break
      default:
        clickData = attemptData = finalData = new Array(65).fill(0);
        startDate = moment().startOf("day").subtract(15, "day");
        break
    }
    for (var element of data) {
      const elementDate = getDate(time, element.date)
      if (moment.isMoment(elementDate)) {
        const index = elementDate.diff(startDate, time)
        clickData[index] = element.clicks
        attemptData[index] = element.attempts
        finalData[index] = element.completions  
      }
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
    <Card
      title="Affiliate Tracking"
      extra={
        <Select
        className="min-w-[120px]"
          value={time}
          options={[
            { value: 'day', label: "Daily" },
            { value: 'week', label: "Weekly" },
            { value: 'month', label: "Monthly" },
          ]}
          onChange={value => onTimeChange && onTimeChange(value)}
        />
      }
    >
      <Chart
        options={getOptions(time)}
        series={getSeries(time, dataSource || [])}
        type="line"
        height={400}
      />
    </Card>
  )
}

export default AffiliateClickChart;