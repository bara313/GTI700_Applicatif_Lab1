import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Temperature and Humidity over time',
        },
    },
    scales: {
        y: {
            min: 0,
            ticks: {
                beginAtZero: true,
                stepSize: 2
            }
        }
    }
};

export const LineChart = ({ chartData }) => {
  return (
    <div>
      <Line
        data={chartData}
        options={options}
      />
    </div>
  );
};