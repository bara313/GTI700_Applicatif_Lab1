import { useEffect, useState } from 'react';
import './Page.css';
import Paho from "paho-mqtt" 



function Page() {  
  const [alerts, setAlerts] = useState(new Map());
  const [connected, setConnected] = useState(false);

  const client = new Paho.Client('broker.mqttdashboard.com', Number(8000), 'clientId12345')
  client.onMessageArrived = onMessageReceived;
  client.onConnectionLost = onConnectionLost;

  useEffect(() => {
    console.log("asdfasdf")
    if (!connected){
      client.connect({onSuccess:() => {
        client.subscribe('/gti780a2021alerts/+/alert')
        setConnected(true)
      }})
    }
  }, [])

  function onMessageReceived(message) {
    let teamNumber = message.topic.split('/')[2].match(/(\d+)/)[0]
    let updatedMap = alerts.set(teamNumber, message.payloadString)
    setAlerts(new Map([...updatedMap].sort()))
    alerts.forEach((value, key) => {
      console.log(value + " :  " + key)
    })
  }

  function onConnectionLost(response){
    if (response.errorCode !== 0) {
      alert("Connexion lost : " + response.errorMessage);
    }
  }

  function getRGBString(string){
    return "rgb(" + string.replaceAll(';', ',') + ")";
  }
  
  return (
    <div className="App">
      <div className='data-container'>
        <div className='humidity-container'>
          <h2>Système d'alerte</h2>
          <table border="1" cellPadding="5" cellSpacing="5" width="100%"> 
            <thead>
              <tr>
                <th>Équipe</th>
                <th>Couleur</th>
              </tr>
            </thead>
            <tbody>
              {
                [...alerts.keys()].map(key => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td style={{"background-color": getRGBString(alerts.get(key))}}> <font color="white">{getRGBString(alerts.get(key))}</font></td>
                    </tr>
                  )
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Page;