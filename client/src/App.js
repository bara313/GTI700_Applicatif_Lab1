import { useEffect, useState } from 'react';
import './App.css';
import { LineChart } from './Chart.js';

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
      
      // setCurrentHumidity(humidity)
      // setHumidityPoints(humidityPoints => [...humidityPoints, humidity])
      fetch("http://localhost:8080/sensors/temperature/30/")
      .then(handleErrors) // Attraper les erreurs de protocoles HTTP
      .then(response => response.json())
      .then(data => {
        //let date = new Date(data[0].time)
        
        //setCurrentTime(date.toLocaleTimeString('en-US'))
        setTemperaturePoints(data.map(obj => {
          return {
            time: obj.time.split(' ')[1],
            temperature: obj.temperature
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
        // {
        //   label: 'Humidity',
        //   data: humidityPoints.map(obj => obj.temperature),
        //   borderColor: 'rgb(53, 162, 235)',
        //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
        // },
    ]
}

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
          {temperaturePoints.slice(-30).map((item, i) => <li key={i}>{item.temperature}° at {item.time}</li>)}
        </div>
        {/* <div className='humidity-container'>
          <h2>Humidity</h2>
          <h3>Current Humidity</h3>
          {currentHumidity}
          <h3>Average Humidity</h3>
          {calculateAverage(humidityPoints).toFixed(2)}
          <h3>Last 30 Humidity Data Points</h3>
          {humidityPoints.slice(-30).map((item, i) => <li key={i}>{item}</li>)}
        </div> */}
      </div>
      <div className='chart-container'>
        <LineChart chartData={dataChartTemp} />
      </div>
    </div>
  );
}

export default App;
