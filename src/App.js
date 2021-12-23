import './App.css'; 
import ig from './Images/ig.png'
import phone from './Images/phone.png'
import React, { useEffect, useState } from 'react';
import { Marker,GoogleMap, LoadScript ,
  DirectionsService,DirectionsRenderer} from '@react-google-maps/api';

function App() {
  const google = window.google;
  const [input, setInput] = useState('');
  let compass;
  let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  let pointDegree;
  const [directionResponse, setDirectionResponse] = useState(null);
  const [myLatLng,setMyLatLng] = useState({ lat: 0, lng: 0});
  
  const containerStyle = {
    width: '400px',
    height: '400px'
  };

  const styleMap = 
    [
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#000000"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": -100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#000000"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": -100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#000000"
              },
              {
                  "saturation": 0
              },
              {
                  "lightness": -100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#000000"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": -100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#000000"
              },
              {
                  "saturation": 0
              },
              {
                  "lightness": -100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#000000"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": -100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#bbbbbb"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 26
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#dddddd"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": -3
              },
              {
                  "visibility": "on"
              }
          ]
      }
  ]

  function directionsCallback (response) {
    console.log(response)

    if (response !== null) {
      if (response.status === 'OK') {
        setDirectionResponse(response)
        
      } else {
        console.log('response: ', response)
      }
    }
  }
  
  function handleInput() {
    if(input == 'Rudolf') {
        document.querySelector('.input').style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
        initCompass()
        initMap()
    }
    else {
        alert("Emo ty očividne nepoznáš samú seba a beriem to ako urážku!")
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
      <div>
        <div className='page-title'>
          Záchranný balíček na cestu domov
        </div>
      </div>
      <div className='input'>
        <label className='label'>Kontrolná otázka pre Emíliu</label>
        <label className='label'>Moja najoblúbenejšia osoba(po babke):</label>
        <input value={input} onInput={e => setInput(e.target.value)} className='input-box'/>
        <button onClick={handleInput} className='input-button'>Over odpoveď!</button>
      </div>
      <div className='overlay'/>
      <div>
        <div className='compass-title'>Aby si vždy našla cestu ti pomože tento kompas!</div>
        <div className="compass">
          <div className="arrow"></div>
          <div className="compass-circle"></div>
        </div>
      </div>
      <div className='map-title'>A žiadne výhovorky tu máš aj mapu.</div>
      <div id='google-map'> 
        <LoadScript
          googleMapsApiKey="AIzaSyAl5E_rdNHlmFoGQg-c3Yu4PRfh5Tya0uY"
        >
           <GoogleMap
            // required
            
            options={{    scrollwheel: false,
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              styles: styleMap
            }}
            id='direction-example'
            // required
            mapContainerStyle={containerStyle}
            // required
            zoom={2}
            // required
            center={myLatLng}
          >
            {
              (
                myLatLng.lat !== 0 &&
                myLatLng.lng !== 0
              ) && (
                <DirectionsService
                  // required
                  options={{ 
                    destination: {
                      lat: 48.505034,
                      lng: 17.428396,
                    },
                    origin: myLatLng,
                    travelMode: 'DRIVING'
                  }}
                  // required
                  callback={directionsCallback}
                  
                />)
}
               { directionResponse !== null && (
                <DirectionsRenderer
                  // required
                  directions = {directionResponse}
                  options={{
                    polylineOptions: {
                      strokeColor: 'red',
                      strokeOpacity: 0.4,
                      strokeWeight: 4
                    }}}
                />) }
          </GoogleMap>
        </LoadScript>
      </div>
      <a href="tel:+42110823367" className='call-div'><span className='call-title'>A keď už nechceš ísť domov, tak mi aspoň sem tam zavolaj</span><img src={phone} className='img'/></a>
      <div className='christmas-title'>
        Štastné a veselé Emko 🎅
      </div>
        <a href='https://www.instagram.com/rutolphis/' className='footer-div'>Web created by<img src={ig} className='footer-img'></img></a>
      </div>
  );
}

export default App;
