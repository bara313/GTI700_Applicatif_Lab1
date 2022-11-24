import { useEffect, useState } from 'react';
import './Page.css';
import LineChart from './Chart';

function PageOld() {
  const [temperaturePoints, setTemperaturePoints] = useState([])
  const [humidityPoints, setHumidityPoints] = useState([])
  const [errorMessage, setErrorMessage] = useState(true)


  const calculateAverage = (data) => {
    let sum = undefined
    if (typeof data[0] === 'string' || data[0] instanceof String) {
      sum = data.reduce((a, b) => Number(a) + Number(b), 0);
    }else {
      sum = data.reduce((a, b) => a + b, 0);
    }
    return (sum / data.length) || 0;
  }

  const fetchLastDataPoints = (data, attribute) => {
    return data.filter(obj => obj[attribute] !== "No Data").slice(0, 30).map(obj => obj[attribute])
  }

  // Fonction adaptée de: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
  const handleErrors = (response) => {
    if (!response.ok) throw Error(response.status + ": " + response.statusText);
    return response;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      
      fetch("http://10.0.0.37:8080/sensors/temperature/1/")
      .then(handleErrors) // Attraper les erreurs de protocoles HTTP
      .then(response => response.json())
      .then(data => {
        setErrorMessage(true)
        setTemperaturePoints(temperaturePoints => [{
          time: data[0].time,  
          temperature: data[0].temperature
        }, ...temperaturePoints])
      })
      .catch((error) => {
        if(errorMessage){
          alert("We were unable to fetch the data.")
          setErrorMessage(false)
        }
        setTemperaturePoints(temperaturePoints => [ {
          time: "No Data",  
          temperature: "No Data"
        }, ...temperaturePoints])
      })

      fetch("http://10.0.0.37:8080/sensors/humidity/1/")
      .then(handleErrors) // Attraper les erreurs de protocoles HTTP
      .then(response => response.json())
      .then(data => {
        setHumidityPoints(humidityPoints => [{
          time: data[0].time,  
          humidity: data[0].humidity
        }, ...humidityPoints])
      })
      .catch((error) => {
        setHumidityPoints(humidityPoints => [{
          time: "No Data",  
          humidity: "No Data"
        }, ...humidityPoints])
      })
      
    }, 3000);
    return () => clearInterval(interval);
  }, [errorMessage]);

  const dataChartTemp = {
    labels: fetchLastDataPoints(temperaturePoints, "time").map(obj => obj.split(' ')[1]).reverse(),
    datasets: [
        {
          label: 'Temperature',
          data: fetchLastDataPoints(temperaturePoints, "temperature").reverse(),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ]
  }

  const dataChartHumid = {
    labels: fetchLastDataPoints(humidityPoints, "time").map(obj => obj.split(' ')[1]).reverse(),
      datasets: [
          {
            label: 'Humidity',
            data: fetchLastDataPoints(humidityPoints, "humidity").reverse(),
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
            text: 'Temperature points over time',
        },
    },
    scales: {
        y: {
            min: Math.min(...fetchLastDataPoints(temperaturePoints, "temperature")) - 1,
            max: Math.max(...fetchLastDataPoints(temperaturePoints, "temperature")) + 1,
            ticks: {
                beginAtZero: true,
                stepSize: 1
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
            text: 'Humidity points over time',
        },
    },
    scales: {
        y: {
          min: Math.min(...fetchLastDataPoints(humidityPoints, "humidity")) - 3,
          max: Math.max(...fetchLastDataPoints(humidityPoints, "humidity")) + 3,
            ticks: {
                beginAtZero: true,
                stepSize: 1
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
          {temperaturePoints.length > 0 && temperaturePoints[0].temperature !== "No Data" ?
            <>{temperaturePoints[0].temperature}° at {temperaturePoints[0].time}</> :
            <>No Data! Come back later</>
          }
          <h3>Average Temperature</h3>
          {calculateAverage(fetchLastDataPoints(temperaturePoints, "temperature")).toFixed(2)}°
          <h3>Last 30 Temperature Data Points</h3>
          <table border="1" cellPadding="5" cellSpacing="5" width="100%"> 
            <thead>
              <tr>
                <th>Time</th>
                <th>Temperature (°C)</th>
              </tr>
            </thead>
            <tbody>
              {temperaturePoints.slice(0, 30).map((obj, i) => (
                <tr key={i}>
                  <td>{obj.time}</td>
                  <td>{obj.temperature}</td>
                </tr>
              ))}
            </tbody>
        </table>
        <LineChart chartData={dataChartTemp} options={chartOptionsTemp}/>
      </div>
      <div className='humidity-container'>
        <h2>Humidity</h2>
        <h3>Current Humidity</h3>
        {humidityPoints.length > 0 && humidityPoints[0].humidity !== "No Data" ?
            <>{humidityPoints[0].humidity} % at {humidityPoints[0].time}</> :
            <>No Data! Come back later</>
          }
        <h3>Average Humidity</h3>
        {calculateAverage(fetchLastDataPoints(humidityPoints, "humidity")).toFixed(2)} %
        <h3>Last 30 Humidity Data Points</h3>
        <table border="1" cellPadding="5" cellSpacing="5" width="100%"> 
            <thead>
              <tr>
                <th>Time</th>
                <th>Humidity (%)</th>
              </tr>
            </thead>
            <tbody>
              {humidityPoints.slice(0, 30).map((obj, i) => (
                <tr key={i}>
                  <td>{obj.time}</td>
                  <td>{obj.humidity}</td>
                </tr>
              ))}
            </tbody>
        </table>
        <LineChart chartData={dataChartHumid} options={chartOptionsHumid}/>
      </div>
    </div>
  </div>
  );
}

export default PageOld;
