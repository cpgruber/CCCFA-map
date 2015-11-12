//initialize mapbox and map
L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhc2VncnViZXIiLCJhIjoidV9tdHNYSSJ9.RRyvDLny4YwDwzPCeOJZrA';
var map = L.mapbox.map('map', 'chasegruber.81bd1c23', {zoomControl:false})
        //  .setView([41.8, -69.5], 8);
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
// Disable tap handler, if present.
if (map.tap){map.tap.disable()};

//declare map features
var bathy = L.mapbox.featureLayer(bathy).addTo(map);
var fishingAreas = L.mapbox.featureLayer(fishingAreas).addTo(map);
var points = L.geoJson(areaPts);
var ptGrp = L.featureGroup().addTo(map);
var ports = L.geoJson(ports);

//load and style map data
ports.eachLayer(function(pt){
  var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
    .setIcon(
      L.divIcon({
        className: "portMarker",
        iconSize:[20,20],
        popupAnchor:[-3,-10]
      })
    ).bindPopup(pt.feature.properties.Name)
    .addTo(map);

  marker.on("touchstart mouseover mousedown click", function(e){
    marker.openPopup();
  });
  marker.on("touchend mouseout mouseup", function(e){
    marker.closePopup();
  });
});

points.eachLayer(function(pt){
  var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
    .setIcon(L.divIcon({
      className: "marker",
      iconSize:[20,20],
      popupAnchor:[-3,-10]
    }))
    .addTo(ptGrp);
});

var pointsLyr = L.mapbox.featureLayer().addTo(map);
pointsLyr.on('layeradd', function (e) {
  var marker = e.layer,
      feature = marker.feature;
  marker.setIcon(
    L.divIcon({
      className: "seethru",
      iconSize: [30,30],
      popupAnchor:[-3,-10]
    })
  );
  marker.bindPopup(feature.properties.Name);
});
pointsLyr.setGeoJSON(areaPts);

bathy.eachLayer(function (layer){
  var depth = layer.feature.properties.level;
    if (depth == 0){
      layer.setStyle({
        fillColor:"#1b5faa",
        weight:0,
        fillOpacity:0
      });
    }else if(depth == 1){
      layer.setStyle({
        fillColor:"#78add3",
        weight:0,
        fillOpacity:1
      });
    }else if(depth== 2){
      layer.setStyle({
        fillColor:"#5ca1cc",
        weight:0,
        fillOpacity:1
      });
    }else if(depth==3){
      layer.setStyle({
        fillColor:"#3995c5",
        weight:0,
        fillOpacity:1
      });
    }else if(depth==4){
      layer.setStyle({
        fillColor:"#008abf",
        weight:0,
        fillOpacity:1
      });
    }else{
      layer.setStyle({
        fillColor:"#1b5faa",
        weight:0,
        fillOpacity:0.25
      });
    }
});

fishingAreas.eachLayer(function (layer){
  layer.setStyle({
    fillColor:"#ff0000;",
    weight:0,
    fillOpacity:0
  });
});
//end data load//
function makeIcons(){
  var icons = document.getElementById('icons');
  var i=0;
  var row;
  for (fish in species){
    if (i%5==0){
      row = icons.insertRow();
    }
    var icon = row.insertCell();
    icon.className = 'icon';
    icon.setAttribute('species',fish);
    var link = document.createElement('a');
    link.setAttribute('href','http://www.capecodfishermen.org/'+species[fish].pageLink);
    var image = document.createElement('img');
    image.setAttribute('src','images/'+fish+'.png');
    image.setAttribute('alt',fish);
    var p = document.createElement('p');
    p.textContent = species[fish].displayName;
    link.appendChild(image);
    link.appendChild(p);
    icon.appendChild(link);
    icon.addEventListener("mouseover",iconHover);
    icon.addEventListener("mouseout",iconUnhover);
    i++;
  }
}
makeIcons();

//area hover
pointsLyr.on("touchstart mouseover mousedown click", function(e){
  var area = e.layer.feature.properties.Name;
  e.layer.openPopup();
  var fish;
  fishingAreas.eachLayer(function (layer){
    if (layer.feature.properties.Name == area){
      fish = layer.feature.properties.Fish;
      layer.setStyle({
        fillColor:"#ff0000;",
        weight:0,
        fillOpacity:0.2
      });
    }else{
      layer.setStyle({
        fillColor:"#ff0000;",
        weight:0,
        fillOpacity:0
      });
    }
  });
  for (var i=0;i<fish.length;i++){
    button = document.querySelector('.icon[species="'+fish[i]+'"]');
    if(button){button.className = 'icon hovered';}
  }
});

//area unhover
pointsLyr.on("touchend mouseout mouseup", function(e){
  e.layer.closePopup();
  fishingAreas.eachLayer(function(layer){
    layer.setStyle({
      fillColor:"#ff0000;",
      weight:0,
      fillOpacity:0
    });
  });
  var hovered = document.querySelectorAll('.hovered');
  for (var i = 0;i<hovered.length;i++){
    hovered[i].className = 'icon';
  };
});

window.addEventListener("resize",function(){fitBounds(pointsLyr)});
window.addEventListener("load",function(){fitBounds(pointsLyr)});
function fitBounds(layer){
  var bounds = layer.getBounds();
  map.fitBounds(bounds)
}

function iconHover(){
  ptGrp.clearLayers();
  var fish = this.getAttribute("species");
  this.className = "icon hovered";
  fishingAreas.eachLayer(function(layer){
    if (layer.feature.properties.Fish.indexOf(fish) !== -1){
      points.eachLayer(function(pt){
        if(pt.feature.properties.Name == layer.feature.properties.Name){
        var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
          .setIcon(L.divIcon({
            className: "chosen",
            iconSize:[20,20],
            popupAnchor:[-3,-10]
          }))
          .addTo(ptGrp)
        }
      });
    }else{
      points.eachLayer(function(pt){
        if(pt.feature.properties.Name == layer.feature.properties.Name){
        var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
          .setIcon(L.divIcon({
            className: "marker",
            iconSize:[20,20],
            popupAnchor:[-3,-10]
          }))
          .addTo(ptGrp)
        }
      });
      }
  })
}

function iconUnhover(){
  this.className = "icon"
  map.removeLayer(pointsLyr);
  ptGrp.clearLayers();
  points.eachLayer(function(pt){
    var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
      .setIcon(L.divIcon({
        className: "marker",
        iconSize:[20,20],
        popupAnchor:[-3,-10]
      }))
    .addTo(ptGrp)
  });
  map.addLayer(pointsLyr);
}
