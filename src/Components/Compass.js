import '../App.css'

function Compass(){
    const compassCircle = document.querySelector(".compass-circle");
    const startBtn = document.querySelector(".start-btn");
    const myPoint = document.querySelector(".my-point");
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
        compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
    }

    return (
        <div className="compass">
          <div className="arrow">Cau</div>
            <div className="compass-circle"></div>
          <div className="my-point"></div>
          <button className="start-btn" onClick={requestPer}>Start compass</button>
      </div>
    )
}

export default Compass
