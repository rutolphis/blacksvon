import '../App.css'
import React, { useState } from "react";

function Compass(){
    let compass;
    let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
|| (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

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
    alert("android")
    window.addEventListener("deviceorientationabsolute", handler, true);
    }
  }
    function handler(e) {
        compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        setTransform(`translate(-50%, -50%) rotate(${-compass}deg)`)
    }

    function setTransform(data) {
       document.documentElement.style.setProperty('--transform-compass',data)
    }

    return (
      <div>
        <div className="compass">
          <div className="arrow"></div>
          <div className="compass-circle"></div>
          <div className="my-point"></div>
        </div>
        <button className="start-btn" onClick={requestPer}>Start compass</button>
      </div>
    )
}

export default Compass
