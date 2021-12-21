import '../App.css'
import React, { useState } from "react";

function Compass(){
    let compass;
    let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    let pointDegree;

    function init() {
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
      <div>
        <div className='compass-title'>Aby si vždy našla cestu domov!</div>
        <div className="compass">
          <div className="arrow"></div>
          <div className="compass-circle"></div>
        </div>
        <button className="start-btn" onClick={init}>Start compass</button>
      </div>
    )
}

export default Compass
