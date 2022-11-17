import { useEffect, useState } from 'react';
import './App.css';
import LineChart from './Chart';
import ReactTable from 'react-table-6';

function App() {
  const [temperaturePoints, setTemperaturePoints] = useState([])
  const [humidityPoints, setHumidityPoints] = useState([])

  const calculateAverage = (data) => {
    const sum = data.reduce((a, b) => a + b, 0);
    return (sum / data.length) || 0;
  }

   // Fonction adaptée de: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
  const handleErrors = (response) => {
    if (!response.ok) throw Error(response.status + ": " + response.statusText);
    return response;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      
      fetch("http://localhost:8080/sensors/temperature/30/")
      .then(handleErrors) // Attraper les erreurs de protocoles HTTP
      .then(response => response.json())
      .then(data => {

        setTemperaturePoints(data.map(obj => {
          return {
            time: obj.time.split(' ')[1],
            temperature: obj.temperature
          };
        }))
      })

      fetch("http://localhost:8080/sensors/humidity/30/")
      .then(handleErrors) // Attraper les erreurs de protocoles HTTP
      .then(response => response.json())
      .then(data => {

        setHumidityPoints(data.map(obj => {
          return {
            time: obj.time.split(' ')[1],
            humidity: obj.humidity
          };
        }))
      })
      
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const dataChartTemp = {
    labels: temperaturePoints.map(obj => obj.time),
    datasets: [
        {
          label: 'Temperature',
          data: temperaturePoints.map(obj => obj.temperature),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ]
  }

  const dataChartHumid = {
    labels: humidityPoints.map(obj => obj.time),
      datasets: [
          {
            label: 'Humidity',
            data: humidityPoints.map(obj => obj.humidity),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
      ]
  }

  const chartOptionsTemp = {
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Data points over time',
        },
    },
    scales: {
        y: {
            min: 15,
            max: 25,
            ticks: {
                beginAtZero: true,
                stepSize: 2
            }
        }
    }
  };

  const chartOptionsHumid = {
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Data points over time',
        },
    },
    scales: {
        y: {
            min: 40,
            max: 80,
            ticks: {
                beginAtZero: true,
                stepSize: 2
            }
        }
    }
  };

  return (
    <div className="App">
      <div className='data-container'>
        <div className='temperature-container'>
          <h2>Temperature</h2>
          <h3>Current Temperature</h3>
          {temperaturePoints.length > 0 &&
            <>{temperaturePoints[0].temperature}° at {temperaturePoints[0].time}</>
          }
          <h3>Average Temperature</h3>
          {calculateAverage(temperaturePoints.map(obj => obj.temperature)).toFixed(2)}°
          <h3>Last 30 Temperature Data Points</h3>
          <table border="1" cellpadding="5" cellspacing="5" width="100%"> 
            <thead>
              <tr>
                <th>Time</th>
                <th>Temperature</th>
              </tr>
            </thead>
            <tbody>
              {temperaturePoints.map((obj, i) => (
                <tr key={i}>
                  <td>{obj.time}</td>
                  <td>{obj.temperature} °C</td>
                </tr>
              ))}
          </tbody>
      </table>
        </div>
        <div className='humidity-container'>
          <h2>Humidity</h2>
          <h3>Current Humidity</h3>
          {humidityPoints.length > 0 &&
            <>{humidityPoints[0].humidity} at {humidityPoints[0].time}</>
          }
          <h3>Average Humidity</h3>
          {calculateAverage(humidityPoints.map(obj => obj.humidity)).toFixed(2)}
          <h3>Last 30 Humidity Data Points</h3>
          {humidityPoints.slice(-30).map((item, i) => <li key={i}>{item.humidity} at {item.time}</li>)}
          
        </div>
      </div>
      <div className='chart-container' >
        <LineChart chartData={dataChartTemp} options={chartOptionsTemp} />
        <LineChart chartData={dataChartHumid} options={chartOptionsHumid}/>
      </div>
      
    </div>
  );
}

export default App;
