import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './RetirementGraph.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function RetirementGraph({ savingsGrowthData, targetSavingsTrajectoryData, retirementAge, whatYouWillNeed }) {
  // Ensure both datasets are available for consistent rendering, even if one is empty
  const labels = savingsGrowthData && savingsGrowthData.length > 0 
                  ? savingsGrowthData.map(dataPoint => dataPoint.age)
                  : (targetSavingsTrajectoryData && targetSavingsTrajectoryData.length > 0 
                      ? targetSavingsTrajectoryData.map(dataPoint => dataPoint.age)
                      : []);

  if (labels.length === 0) {
    return <div className="graph-container"><p>No data to display graph.</p></div>;
  }

  const datasets = [];

  if (savingsGrowthData && savingsGrowthData.length > 0) {
    datasets.push({
      label: 'What you\'ll have',
      data: savingsGrowthData.map(dp => ({ x: dp.age, y: dp.value })),
      borderColor: 'rgb(75, 192, 192)', // Keeping Teal/Greenish for this line
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    });
  }

  if (targetSavingsTrajectoryData && targetSavingsTrajectoryData.length > 0) {
    datasets.push({
      label: 'What you\'ll need',
      data: targetSavingsTrajectoryData.map(dp => ({ x: dp.age, y: dp.value })),
      borderColor: '#4f0606', // New primary color
      borderDash: [5, 5], 
      backgroundColor: 'rgba(79, 6, 6, 0.1)', // Adjusted alpha for new color
      tension: 0.1,
      fill: false, 
      pointRadius: 3,
      pointHoverRadius: 5,
    });
  }

  const data = {
    // labels: labels, // Chart.js can infer labels from data structure {x,y}
    datasets: datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
        xAxisKey: 'x',
        yAxisKey: 'y'
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Savings Balance ($)'
        },
        ticks: {
          callback: function(value, index, values) {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'm';
            if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
            return value;
          }
        }
      },
      x: {
        type: 'linear', // Treat age as a linear scale for correct point placement
        title: {
          display: true,
          text: 'Age'
        },
        ticks: {
            stepSize: 2 // Adjust step size as needed, e.g., every 2 or 5 years
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom', // As per screenshot
        labels: {
            usePointStyle: true, // Use circle for legend markers
            boxWidth: 8 // Adjust size of point style
        }
      },
      title: {
        display: false, 
        text: 'Retirement Savings Projection'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="graph-container">
      {datasets.length > 0 ? <Line options={options} data={data} /> : <p>Preparing graph data...</p>}
    </div>
  );
}

export default RetirementGraph; 