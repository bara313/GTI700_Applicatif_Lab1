import { useEffect, useState } from 'react';
import './Page.css';
import LineChart from './Chart';

function Page() {
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
    labels: temperaturePoints.slice(0, 30).filter(obj => obj.time !== "No Data").map(obj => {
      console.log("allo")
      return obj.time.split(' ')[1]}),
    datasets: [
        {
          label: 'Temperature',
          data: temperaturePoints.slice(0, 30).filter(obj => obj.time !== "No Data").map(obj => obj.temperature),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ]
  }

  const dataChartHumid = {
    labels: humidityPoints.slice(0, 30).filter(obj => obj.time !== "No Data").map(obj => obj.time.split(' ')[1]),
      datasets: [
          {
            label: 'Humidity',
            data: humidityPoints.slice(0, 30).filter(obj => obj.time !== "No Data").map(obj => obj.humidity),
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
            min: Math.min(...temperaturePoints.filter(obj => obj.time !== "No Data").slice(0, 30).map(obj => obj.temperature)) - 1,
            max: Math.max(...temperaturePoints.filter(obj => obj.time !== "No Data").slice(0, 30).map(obj => obj.temperature)) + 1,
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
          min: Math.min(...humidityPoints.filter(obj => obj.time !== "No Data").slice(0, 30).map(obj => obj.humidity)) - 3,
          max: Math.max(...humidityPoints.filter(obj => obj.time !== "No Data").slice(0, 30).map(obj => obj.humidity)) + 3,
            ticks: {
                beginAtZero: true,
                stepSize: 1
            }
        }
    }
  };
  console.log(dataChartHumid)

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
          {calculateAverage(temperaturePoints.filter(obj => obj.time !== "No Data").map(obj => obj.temperature)).toFixed(2)}°
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
            <>{humidityPoints[0].humidity}° at {humidityPoints[0].time}</> :
            <>No Data! Come back later</>
          }
        <h3>Average Humidity</h3>
        {calculateAverage(humidityPoints.filter(obj => obj.time !== "No Data").slice(0, 30).map(obj => obj.humidity)).toFixed(2)} %
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

export default Page;
