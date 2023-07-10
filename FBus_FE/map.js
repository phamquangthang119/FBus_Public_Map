// import { initializeApp } from "firebase/app";

var mapObj = null;
var defaultCoord = [10.7743, 106.6669]; // coord mặc định, 9 giữa HCMC
var zoomLevel = 13;
var mapConfig = {
  attributionControl: false,
  center: defaultCoord, // vị trí map mặc định hiện tại
  zoom: zoomLevel,
};

var routeData = [];
var routePolyline = null;
window.onload = function () {
  // init map
  mapObj = L.map("sethPhatMap", { attributionControl: false }).setView(
    defaultCoord,
    zoomLevel
  );

  // add tile để map có thể hoạt động, xài free từ OSM
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapObj);

  
  // L.Routing.control({
  //   waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
  //   routeWhileDragging: true,
  // }).addTo(mapObj);

  // add marker and popup

  //ham doc
  

  // var marker = L.marker([10.7743, 106.6669]).addTo(mapObj);

  // var popup = L.popup();
  // // popup.setContent("<b>Seth Phát</b> <br> Hello World Nà");
  // marker.bindPopup(popup);
  // marker.openPopup();
  // marker.bindTooltip("Tooltip naf");

  // function addMarker(coord, popupContent, popupOptionObj, markerObj) {
  //   if (!popupOptionObj) {
  //     popupOptionObj = {};
  //   }
  //   if (!markerObj) {
  //     markerObj = {};
  //   }
  //   var marker = L.marker(coord, markerObj).addTo(mapObj); // chơi liều @@
  //   var popup = L.popup(popupOptionObj);
  //   popup.setContent(popupContent);
  //   // binding
  //   marker.bindPopup(popup);
  //   marker.on("click", function () {
  //     marker.openPopup();
  //   });
  //   return marker;
  // }

  // var popupOption = {
  //   className: "map-popup-content",
  // };
  // var marker = addMarker(
  //   [10.7743, 106.6669],
  //   `<div class='left'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1SGNN50inDZcOweium4llf4qacFBFgBK9sXW7fxQ_lBm6-Abcww' /></div><div class='right'><b>Đây có gì hot?</b><br>Một Popup có 1 cô gái tên là Lailah</div><div class='clearfix'></div>`,
  //   popupOption
  // );
  // Load route data
  fetch("https://fbus-final.azurewebsites.net/api/Routes", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjIiLCJSb2xlIjoiQWRtaW4iLCJleHAiOjE2OTEzMDM0ODEsImlzcyI6IkZCdXNfU1dQIiwiYXVkIjoiRkJ1c19TV1AifQ.vXkop_kEtzEEx3BD-3gT5E4EEVivpMSHNLJ3VChOYGs",
      "Access-Control-Allow-Origin": "https://127.0.0.1:5500",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      routeData = data.data;
      renderRouteData();
    })
    .catch((error) => {
      console.error(error);
    });
  // Function to render route data
  function renderRouteData() {
    var routeContainer = document.getElementById("route");
    routeContainer.innerHTML = ""; // Clear the existing content

    routeData.forEach(function (route) {
      var routeElement = document.createElement("div");
      routeElement.classList.add("route-item");

      // Icon wrapper
      var iconWrapper = document.createElement("div");
      iconWrapper.classList.add("icon-wrapper");

      // Icon
      var iconElement = document.createElement("i");
      iconElement.classList.add("fas", "fa-bus");
      iconWrapper.appendChild(iconElement);
      routeElement.appendChild(iconWrapper);
      // Route details wrapper
      var detailsWrapper = document.createElement("div");
      detailsWrapper.classList.add("details-wrapper");
      detailsWrapper.dataset.routeId = route.id;
      // Beginning
      var beginningElement = document.createElement("div");
      beginningElement.textContent =
        " " + route.beginning + " - " + route.destination;
      detailsWrapper.appendChild(beginningElement);
      // Distance
      var distanceElement = document.createElement("div");
      distanceElement.textContent = "Distance: " + route.distance + "km";
      detailsWrapper.appendChild(distanceElement);

      routeElement.appendChild(detailsWrapper);
      routeContainer.appendChild(routeElement);
      detailsWrapper.addEventListener("click", function () {
        // loadRouteDetail(route.id);
      });
    });
  }

  //Load data getRouteId
  // function loadRouteDetail(id) {
  //   fetch("https://fbus-swp.azurewebsites.net/api/Routes/" + id, {
  //     headers: {
  //       Authorization:
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjMiLCJSb2xlIjoiQURNSU4iLCJleHAiOjE2OTAyNzUzMTgsImlzcyI6IkZCdXNfU1dQIiwiYXVkIjoiRkJ1c19TV1AifQ.UQGNjS5BPJfY63oh8JfaTcC-CxoiWfzaFdtSPHjwe9A",
  //       "Access-Control-Allow-Origin": "https://127.0.0.1:5500",
  //       "Access-Control-Allow-Credentials": "true",
  //       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  //       "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Response data of routeId:", data);
  //       if (routePolyline != null) {
  //         mapObj.removeLayer(routePolyline);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }
  
  
 
};
