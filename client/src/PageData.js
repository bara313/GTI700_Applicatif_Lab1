import { useEffect, useState } from 'react';
import './Page.css';
import Paho from "paho-mqtt" 

function PageData() {  
  const [temperaturePoints, setTemperaturePoints] = useState(new Map());
  const [humidityPoints, setHumidityPoints] = useState(new Map());

  const [connected, setConnected] = useState(false);

  const client = new Paho.Client('192.168.1.215', Number(9001), 'clientId12345')
  client.onMessageArrived = onMessageReceived;
  client.onConnectionLost = onConnectionLost;

  useEffect(() => {
    if (!connected){
      client.connect({onSuccess:() => {
        client.subscribe('/gti780a2021/equipe04/temperature')
        client.subscribe('/gti780a2021/equipe04/humidity')
        setConnected(true)
      }})
    }
  }, [])

  function onMessageReceived(message) {
    const payload = JSON.parse(message.payloadString)
    payload.hasOwnProperty('temperature') ? 
                          updateMap(temperaturePoints, setTemperaturePoints, payload.time, payload.temperature) 
                          : updateMap(humidityPoints, setHumidityPoints, payload.time, payload.humidity)
  }

  function updateMap(map, setter, timestamp, data) {
    let updatedMap = map.set(timestamp.split('T')[1].replace('Z', ''), data)
    setter(new Map([...updatedMap]))
  }

  function onConnectionLost(response){
    if (response.errorCode !== 0) {
      alert("Connexion lost : " + response.errorMessage);
    }
  }
  
  return (
    <div className="App">
      <div className='data-container'>
        <h2>Mes Capteurs</h2>
        <table border="1" cellPadding="5" cellSpacing="5" width="100%"> 
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Température</th>
              <th>Humidité</th>
            </tr>
          </thead>
          <tbody>
            {
              [...humidityPoints.keys()].reverse().slice(0, 10).sort().map(key => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{temperaturePoints.get(key)} °C</td>
                    <td>{humidityPoints.get(key)} %</td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PageData;