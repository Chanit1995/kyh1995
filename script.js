let map, marker, geocoder, selLatLng = null, selAddr = "";

function initMap() {
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 15.6, lng: 103.8 },
    zoom: 13,
  });
  map.addListener("click", e => placeMarker(e.latLng));
  document.getElementById("saveBtn").onclick = savePlace;
  document.getElementById("searchInput").oninput = renderList;
  renderList();
}

function placeMarker(latLng) {
  selLatLng = latLng;
  if (marker) marker.setMap(null);
  marker = new google.maps.Marker({ position: latLng, map });
  geocoder.geocode({ location: latLng }, (res, status) => {
    if (status === "OK" && res[0]) {
      selAddr = res[0].formatted_address;
      document.getElementById("address").innerText = "📍 " + selAddr;
    }
  });
}

function savePlace() {
  const name = document.getElementById("placeName").value.trim();
  if (!name || !selLatLng) return alert("กรุณาใส่ชื่อและปักหมุดก่อนบันทึก");
  const arr = JSON.parse(localStorage.getItem("places") || "[]");
  arr.push({ name, address: selAddr, lat: selLatLng.lat(), lng: selLatLng.lng() });
  localStorage.setItem("places", JSON.stringify(arr));
  document.getElementById("placeName").value = "";
  document.getElementById("address").innerText = "";
  marker.setMap(null);
  renderList();
}

function renderList() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const arr = JSON.parse(localStorage.getItem("places") || "[]");
  const ul = document.getElementById("placesList");
  ul.innerHTML = "";
  arr.filter(p => p.name.toLowerCase().includes(q)).forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.name}</strong><br/>📍 ${p.address}<br/>
      <a href="https://www.google.com/maps?q=${p.lat},${p.lng}" target="_blank">ดูบนแผนที่</a>`;
    ul.appendChild(li);
  });
}
