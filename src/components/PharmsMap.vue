<template>
  <div class="mapa-container">
    <button class="btn btn-link mb-2 d-xl-none p-0 volver-atras" @click="hideMap()" >
      <i class="fas fa-chevron-left me-2 "></i> Volver atras  
    </button>
    <div class="mapa-farmacias" id="map"></div>
  </div>
</template>

<script setup>
  import { ref, watch, reactive, onMounted } from 'vue'
  import {usePharmsStore} from '../stores/pharmsStore'

  import {markers as icons, routeIcons } from "@/composables/markers.js"
  import Skeleton from "@/components/Skeleton.vue"
  import SpinLoader from "@/components/SpinLoader.vue"

  import L from 'leaflet'
  import "leaflet/dist/leaflet.css"

  import 'leaflet.markercluster/dist/leaflet.markercluster.js'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import 'leaflet.markercluster/dist/MarkerCluster.css'
  
  import 'leaflet-easybutton'
  
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.js'
  
  const props = defineProps({
    pharms: {
      type: Array,
      required: true,
    },
  })  

  const pharmsStore = usePharmsStore()

  let map 
  let markers = L.markerClusterGroup({
    maxClusterRadius: 80,
    disableClusteringAtZoom: 16,
  })


  onMounted(() => {
    watch(props.pharms,(value) => {
      
      if(value) {
        // Limites de navegación mapa 
        const southWest = L.latLng(-56.17, -117.61)
        const northEast = L.latLng(14.02, -29.68)
        const bounds = L.latLngBounds(southWest, northEast)
    
        // Inicializar el mapa
        map = L.map('map', {
          maxBounds: bounds,
          minZoom: 3,
        })
        map.setView([-33.4378,-70.6504], 3)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)


        let mapContainer = document.querySelector('#map')

        // boton full screen 
        let fullScreeModeButton = L.easyButton({
          states: [{
            stateName: 'full-screen',
            icon: 'fas fa-expand',
            title: 'Pantalla completa',
            onClick: function(control) {
              control.state('exit-full-screen')
              mapContainer.requestFullscreen()
            }
          }, {
            stateName: 'exit-full-screen',
            icon: 'fas fa-compress',
            title: 'Salir de pantalla completa',
            onClick: function(control) {
              control.state('full-screen')
              document.exitFullscreen()
            }
          }]
        })
        fullScreeModeButton.button.style = 'border:0;width:30px;height:30px;'
        fullScreeModeButton.addTo(map)

        // Contenedor de ranking de farmacias
        let topPharms = pharmsStore.topPharms
        let topPharmsContainer = L.control({position: 'bottomleft'})
        topPharmsContainer.onAdd = function() {
          let div = L.DomUtil.create('div', 'ranking-farmacias')
          div.innerHTML = `
            <div class="top-pharmacies__title">Cadenas principales</div>
            <div class="top-pharmacies__list">
              ${topPharms.map( pharm => {
                return `
                  <div class="top-pharmacies__item">
                    <img class="top-pharmacies__item__icon" src="${pharm.logo}"/>
                    <div>
                      <div class="top-pharmacies__item__name">${pharm.name}</div>
                      <div class="top-pharmacies__item__count">${pharm.value}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `
          return div
        }
        topPharmsContainer.addTo(map)
    
        // Agregar los marcadores
        props.pharms.forEach(pharm => {
          let coords = [pharm.local_lat , pharm.local_lng]
          let marker = L.marker(coords, {
            icon: pharm.icon, 
            riseOnHover: true,
            title: pharm.local_nombre
          })
    
          // Tooltip
          marker.bindPopup(`
            <div class="text-center" style="max-width:150px">
              <p class="small mb-1"><strong>${pharm.local_nombre}</strong></p>
              <p class="small my-1">${pharm.local_direccion}, ${pharm.comuna_nombre}</p>
            </div>
            `
            ,{
            offset: L.point(5, -20),
          })
          marker.openPopup()
          markers.addLayer(marker)
   
        }) 
        map.addLayer(markers)

        pharmsStore.setPharmsMap({map, markers})
      }
    })

  })

  function hideMap() {
    document.querySelector('.layout-mapa').classList.remove('show')
  }

</script>

<style lang="scss">

  .mapa-container {
    width: 100%;
    height: 100%;
    position: relative;

    .mapa-farmacias {
      width: 100%;
      position: relative;
      height: calc(100vh - 83px);
      margin: 10px 0px 0px 0px;
      border-radius: 4px;
      overflow: hidden;
    }

    // Ranking de farmacias
    .ranking-farmacias {
      background-color: rgba(255, 255, 255, 0.91);
      border-radius: 6px;
      padding: 1em;
      cursor: default;

      .top-pharmacies__title {
        font-weight: 700;
        margin-bottom: 1em;
      }

      .top-pharmacies__item {
        display: grid;
        align-items: center;
        grid-template-columns: 25px 1fr;
        grid-column-gap: 5px;
        border-bottom: 1px solid gainsboro;
        margin-bottom: 0.2em;
        padding-bottom: 0.2em;

        .top-pharmacies__item__icon {
          max-width: 25px;
        }

        .top-pharmacies__item__count {
          font-weight: 700;
        }

        &:last-of-type {
          margin: 0;
        }

      }

    }
  }


  @media(max-width: 768px) {
    .mapa-container {

      .mapa-farmacias {

        .ranking-farmacias {
          display: none;
        }
      }
    }
  }


</style>