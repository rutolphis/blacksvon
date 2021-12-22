import './App.css';
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function App() {
  const [input, setInput] = useState('');
  const [aut, setAut] = useState(0);
  let compass;
  let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  let pointDegree;
  const [myLatLng,setMyLatLng] = useState({ lat: 0, lng: 0});

  const containerStyle = {
    width: '400px',
    height: '400px'
  };

  //useEffect(() => {   
    //if(aut == 1){
      //initCompass()
      //initMap()
    //}
  //},[aut]);

  function handleInput() {
    if(input == 'odpoved') {
        document.querySelector('.input').style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
        setAut(1);
    }
    else {
        alert("Emo ty nepoznáš samú seba !")
    }
  }

  function initMap() {
    getActualLocation();
  }

  function getActualLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
      
      setMyLatLng({lat: position.coords.latitude, lng: position.coords.longitude})
    });

    console.log(myLatLng);
  }

  function initCompass() {
    requestPer()
    navigator.geolocation.getCurrentPosition(locationHandler);
  }

  function locationHandler(position) {
    const { latitude, longitude } = position.coords;
    pointDegree = calcDegreeToPoint(latitude, longitude);

    if (pointDegree < 0) {
      pointDegree = pointDegree + 360;
    }
  }

  function calcDegreeToPoint(latitude, longitude) {
    // Qibla geolocation
    const point = {
      lat: 48.505034,
      lng: 17.428396,
    };

    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
    return Math.round(psi);
  }

  function requestPer(){
  if (isIOS) {
  DeviceOrientationEvent.requestPermission()
      .then((response) => {
      if (response === "granted") {
          window.addEventListener("deviceorientation", handler, true);
      } else {
          alert(response);
      }
      })
      .catch(() => alert("not supported"));
  } else {
  window.addEventListener("deviceorientationabsolute", handler, true);
  }
}
  function handler(e) {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    setTransform(`translate(-50%, -50%) rotate(${-compass}deg)`)

    // ±15 degree
    if (
      (pointDegree < Math.abs(compass) && pointDegree + 15 > Math.abs(compass)) ||
      pointDegree > Math.abs(compass + 15) ||
      pointDegree < Math.abs(compass)
    ) {
      setOpacity(0);
    } else if (pointDegree) {
      setOpacity(1);
    }
  }

  function setTransform(data) {
     document.documentElement.style.setProperty('--transform-compass',data)
  }

  function setOpacity(data) {
    document.documentElement.style.setProperty('--opacity-mypoint',data)
  }

  return (
    <div className="App">
      <div className='input'>
        <label className='label'>Kontrolná otázka pre Emíliu</label>
        <label className='label'>Este neviem:</label>
        <input value={input} onInput={e => setInput(e.target.value)} className='input-box'/>
        <button onClick={handleInput} className='input-button'>Over odpoveď!</button>
      </div>
      <div className='overlay'/>
      <div>
        <div className='compass-title'>Aby si vždy našla cestu domov!</div>
        <div className="compass">
          <div className="arrow"></div>
          <div className="compass-circle"></div>
        </div>
        <button onClick={initCompass}>click me</button>
      </div>
      <div>
      <LoadScript googleMapsApiKey="AIzaSyAl5E_rdNHlmFoGQg-c3Yu4PRfh5Tya0uY">  
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={myLatLng}
        zoom={10}
      />
      </LoadScript>

      </div>
      </div>
  );
}

export default App;
