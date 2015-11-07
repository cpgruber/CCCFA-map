//initialize mapbox and map
L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhc2VncnViZXIiLCJhIjoidV9tdHNYSSJ9.RRyvDLny4YwDwzPCeOJZrA';
var map = L.mapbox.map('map', 'chasegruber.81bd1c23', { minZoom: 4, maxZoom:9, zoomControl:false})
         .setView([41.8, -69.5], 8);
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

//fix all this below//////

// var fishesIhave = ["dogfish","pollock","tuna","bluefish","monkfish","skate","lobster","seascallops", "stripedbass", "flounder"];
// var fishLinks = ["dogfish","cod","bluefin-tuna","bluefish","monkfish","skate","lobster","sea-scallop", "striped-bass", "cod"];
//
// for (var i=0;i<fishesIhave.length;i++){
//   var icon = "<div class='icon' id='"+fishesIhave[i]+"'><a href='http://www.capecodfishermen.org/"+fishLinks[i]+"' target='_blank'><img src='images/"+fishesIhave[i]+".png' /></div>";
//   $("#icons").append(icon);
// }
//
// pointsLyr.on("touchstart mouseover mousedown click", function(e){
//   var area = e.layer.feature.properties.Name;
//   e.layer.openPopup();
//   var icons, species;
//   fishingAreas.eachLayer(function (layer){
//     if (layer.feature.properties.Name == area){
//       species = layer.feature.properties.Species;
//       icons = layer.feature.properties.Icons;
//       layer.setStyle({
//         fillColor:"#ff0000;",
//         weight:0,
//         fillOpacity:0.2
//       });
//     }else{
//       layer.setStyle({
//         fillColor:"#ff0000;",
//         weight:0,
//         fillOpacity:0
//       });
//     }
//   });
//   var fishList = species.split(",");
//   var iconList = icons.split(",");
//
//   for (var i = 0; i<iconList.length;i++){
//     var thisFish = iconList[i];
//     if (fishesIhave.indexOf(thisFish) != -1){
//       var jqFish = "#" + thisFish;
//       $(jqFish).stop(true).animate({opacity:1},500)
//     }
//   }
// });
//
// pointsLyr.on("touchend mouseout mouseup", function(e){
//   e.layer.closePopup();
//   fishingAreas.eachLayer(function(layer){
//     layer.setStyle({
//       fillColor:"#ff0000;",
//       weight:0,
//       fillOpacity:0
//     });
//   });
//   for (var i = 0;i<fishesIhave.length;i++){
//     var jqFish = "#"+fishesIhave[i];
//     $(jqFish).stop(true).animate({opacity:0.2},500)
//   };
// });
//
// $(".icon").on("mouseover", function() {
//   ptGrp.clearLayers();
//   var fish = $(this).attr('id');
//   $(this).stop(true).animate({opacity:1},500);
//   fishingAreas.eachLayer(function(layer) {
//   var fishList = layer.feature.properties.Icons.split(",");
//
//   if (fishList.indexOf(fish) !== -1){
//     points.eachLayer(function(pt){
//       if(pt.feature.properties.Name == layer.feature.properties.Name){
//       var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
//         .setIcon(L.divIcon({
//           className: "chosen",
//           iconSize:[20,20],
//           popupAnchor:[-3,-10]
//         }))
//         .addTo(ptGrp)
//       }
//     });
//   }else{
//     points.eachLayer(function(pt){
//       if(pt.feature.properties.Name == layer.feature.properties.Name){
//       var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
//         .setIcon(L.divIcon({
//           className: "marker",
//           iconSize:[20,20],
//           popupAnchor:[-3,-10]
//         }))
//         .addTo(ptGrp)
//       }
//     });
//     }
//   });
// });
//
// $(".icon").on("mouseout", function() {
//   $(this).stop(true).animate({opacity:0.2},500);
//   map.removeLayer(pointsLyr);
//   ptGrp.clearLayers();
//   points.eachLayer(function(pt){
//     var marker = L.marker([pt.feature.geometry.coordinates[1],pt.feature.geometry.coordinates[0]])
//       .setIcon(L.divIcon({
//         className: "marker",
//         iconSize:[20,20],
//         popupAnchor:[-3,-10]
//       }))
//     .addTo(ptGrp)
//   });
//   map.addLayer(pointsLyr);
// });
