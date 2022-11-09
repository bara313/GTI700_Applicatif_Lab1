import { useEffect, useState } from 'react';
import './App.css';

function App() {
  //useEffect
  const [currentTemperature, setCurrentTemperature] = useState()
  const [currentHumidity, setCurrentHumidity] = useState()
  const [temperaturePoints, setTemperaturePoints] = useState([])
  const [humidityPoints, setHumidityPoints] = useState([])

  const calculateAverage = (data) => {
    const sum = data.reduce((a, b) => a + b, 0);
    return (sum / data.length) || 0;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      let temperature = Math.floor(Math.random() * 40)
      let humidity = Math.floor(Math.random() * 40)
      setCurrentTemperature(temperature)
      setTemperaturePoints(temperaturePoints => [...temperaturePoints, temperature])
      setCurrentHumidity(humidity)
      setHumidityPoints(humidityPoints => [...humidityPoints, humidity])
      
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="App">
      <div className='data-container'>
        <div className='temperature-container'>
          <h2>Temperature</h2>
          <h3>Current Temperature</h3>
          {currentTemperature}
          <h3>Average Temperature</h3>
          {calculateAverage(temperaturePoints).toFixed(2)}
          <h3>Last 30 Temperature Data Points</h3>
          {temperaturePoints.slice(-30).map((item, i) => <li key={i}>{item}</li>)}
        </div>
        <div className='humidity-container'>
          <h2>Humidity</h2>
          <h3>Current Temperature</h3>
          {currentHumidity}
          <h3>Average Humidity</h3>
          {calculateAverage(humidityPoints).toFixed(2)}
          <h3>Last 30 Humidity Data Points</h3>
          {humidityPoints.slice(-30).map((item, i) => <li key={i}>{item}</li>)}
        </div>
      </div>
    </div>
  );
}

export default App;
