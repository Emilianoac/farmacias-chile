<template>
  <div class="main-home">
    <div class="container">
      <div class="home-layout">
        <div class="layout-info">

          <!-- BUSCAR POR COMUNA -->
          <div class="mb-3">
            <div class="custom-select">
              <div class="d-flex justify-content-between aling-itmems-center mt-3 mt-md-4 mb-2">
                <label class="form-label mb-0"><strong>Buscar por comuna</strong></label>
                <p class="text small mb-0"> Total Farmacias: <strong>
                  {{ pharmsStore.commune.value == 'TODAS' ? pharmsStore.pharms.length : pharmsStore.pagination.commune.total }} </strong></p>
              </div>
              <div class="custom-select__container">
                <div class="select__seleccionado" @click="customSelect.display = !customSelect.display"> 
                  {{ pharmsStore.commune.value }} 
                </div>
                <div class="select__body" v-if="customSelect.display">
                  <input 
                    class="select__buscador w-100" 
                    v-model="communeSearch" 
                    placeholder="Buscar comuna" 
                    type="text"
                  />
                  <ul class="select__listado">
                    <li v-if="!communeSearch" @click="selectCommune('TODAS')">TODAS</li>
                    <li v-for="(commune, i) in pharmsStore.communestoShow" @click="selectCommune(commune)">
                      {{ commune }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
    
          <div class="d-none d-xl-flex justify-content-end mb-4" v-if="1 < 0">
            <button class="btn btn-link btn-sm text p-0" @click="pharmsStore.getNearestPharm()">
              Buscar farmacia más cercana <i class="fas fa-search ms-1"></i>
            </button>
          </div>
    
          <!-- LISTADO FARMACACIAS -->
          <PharmsList :pharms="pharmsToShow"/>
  
        </div>
        <div class="layout-mapa">
          <!-- MAPA -->
          <PharmsMap v-if="pharmsStore.pharms" :pharms="pharmsStore.pharms"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, reactive } from 'vue'
  import { storeToRefs } from 'pinia'
  import {usePharmsStore} from '../stores/pharmsStore'

  import 'leaflet-easybutton'
  import {markers as icons, routeIcons } from "@/composables/markers.js"
  import { getNearestCoordinate } from "@/composables/getNearestCoordinate.js"

  
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.js'
  
  import PharmsList from '../components/PharmsList.vue'
  import PharmsMap from '../components/PharmsMap.vue'
  import Loader from '../components/SpinLoader.vue'

  // store
  const pharmsStore = usePharmsStore()

  // obtener farmacias
  pharmsStore.getPharms()

  const { pharmsToShow } = storeToRefs(pharmsStore)

  let communeSearch = ref('')
  let customSelect = reactive({
    display: false,
  })


  function selectCommune(commune) {
    customSelect.display = false
    pharmsStore.resetPagination()
    pharmsStore.setCommune(commune)
  }

  async function searchNearestPharm() {
    if (navigator.geolocation) {
    
      navigator.geolocation.getCurrentPosition(

        (position) => {
          let userLat = position.coords.latitude
          let userLng = position.coords.longitude

          // Arrray con todas las coordenadas de las farmacias
          let allCoordinates = pharmsStore.pharms.map(pharm => {
            return { lat: pharm.local_lat, lng: pharm.local_lng}
          })

          let nearestPharm = getNearestCoordinate(allCoordinates,{lat: userLat, lng: userLng})
          

          // Crear ruta con leaflet routing machine

          // Icono inicio ruta
          let startIcon = new L.icon({
            iconUrl: routeIcons.start.icon,
            iconSize: [55, 55],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
          })

          // Opciones plan de la ruta
          let plan = L.Routing.plan(
            [L.latLng(userLat, userLng), L.latLng(nearestPharm.lat, nearestPharm.lng )], 
            {
              addWaypoints: false,
              draggableWaypoints: false,
              routeWhileDragging: false,
              reverseWaypoints: false,
              createMarker: function(i, start, nWps) {
                let markerIcon = null
                let marker
                if(i === 0) {
                  markerIcon = startIcon
                  marker = L.marker(start.latLng, { draggable: false, icon: markerIcon, title: 'Tú ubicación'})
                } else {
                  marker = L.marker(start.latLng, { draggable: false})
                }
                return marker
              }
            }
          )

          // Control de la ruta
          let mapRouter = L.Routing.control({
            waypoints: [L.latLng(userLat, userLng), L.latLng(nearestPharm.lat, nearestPharm.lng)],
            plan: plan,
            showAlternatives: false,
            lineOptions: {
              styles: [{color: 'magenta', opacity: 1, weight: 3}],
              addWaypoints: false,
            },
            routeWhileDragging: true,
            language: 'es',
          }).addTo(pharmsStore.map)

          // limpiar marcadores del mapa

          pharmsStore.mapMarkers.clearLayers()


          pharmsStore.setMapRouter({
            router: mapRouter,
            isEmpty: false,
          })

          pharmsStore.openMap()

        },
        (error) => {
          console.log(error)
        },
      )
 
    } else {
      console.log('La api de geolocalización no está disponible en este navegador.')
    }
  }

  watch(communeSearch, (value) => {
    pharmsStore.setCommuneSearch(value)
  })
</script>

<style lang="scss">

  .main-home {

    .home-layout {
      display: grid;
      grid-template-columns: 0.5fr 1fr;
      grid-column-gap: 20px;
    }

    .text {
      color: var(--text-color);
    }
  }

  @media ( max-width: 1200px )  {

    .main-home {
      
      .home-layout {
        grid-template-columns: 1fr;

        .layout-mapa {
          position: fixed;
          z-index: 99999999;
          left: -100%;
        }

        .layout-mapa.show {
          top: 0;
          left: 0;
          width: 100%;
          padding: 2em 1em;
          padding-top: 1em;
          background: var(--bg-color);
          
          backdrop-filter: blur(5px);
          bottom: 0;

          .volver-atras {
            color: var(--text-color);
          }

          .mapa-farmacias {
            height: 83vh !important;
            margin: 0 !important;
          }
        }
      }
    }
  }
</style>