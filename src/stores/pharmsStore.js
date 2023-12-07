import {defineStore} from "pinia"
import L, { icon } from "leaflet"
import axios from "axios"
import {markers as icons, routeIcons } from "@/composables/markers.js"
import { isLocatedInChile } from "@/composables/chileanCoordsCheker.js"
import { getNearestCoordinate } from "@/composables/getNearestCoordinate.js"
import isValidCoords from "is-valid-coords"

export const usePharmsStore = defineStore("pharmsStore", {
  state: () => ({
    pharms: [],
    topPharms: [],
    currentPharm: null,
    communes: [],
    commune: {
      userSearch: false,
      value: "TODAS",
      prevValue: null
    },
    map: null,
    mapMarkers: [],
    mapRouter: {
      router: null,
      isEmpty: true,
    },
    pagination: {
      all : 25,
      commune: {
        total: 0,
        value: 25,
      }
    },
    fetchError: false,
  }),
  getters: {
    communestoShow: (state) => {
      if(state.commune.userSearch == false){
        return state.communes
      } else {

        if(state.communes.some( c => c.toLowerCase().includes(state.commune.userSearch.toLowerCase()) )) {
          return state.communes.filter(item => item.toLowerCase().includes(state.commune.userSearch.toLowerCase()))
        } else {
          return []
        }
      }
    },
    pharmsToShow: (state) => {
      if (state.commune.value === "TODAS") {
        state.pagination.commune.value = 25
        return state.pharms.slice(0, state.pagination.all)
      } else if (state.commune) {
        let result = state.pharms.filter(item => item.comuna_nombre.toLowerCase().includes(state.commune.value.toLowerCase()))
        state.pagination.commune.total = result.length
        state.pagination.all = 25
        return result.slice(0, state.pagination.commune.value)
      }
    }
  },
  actions: {
    async getPharms() {
      try {
        let res = await axios.get('https://midas.minsal.cl/farmacia_v2/WS/getLocales.php', { timeout: 5000 })
        let data = res.data
  
        let customMarkers = {}
        for(let icon in icons) {
          customMarkers[icon] = L.icon({ 
            iconUrl: icons[icon].icon,
            iconSize: [40, 40],
            iconAnchor: [15, 30],
            setIcon : function (icon) {
              this.iconUrl = icon
            },
          })
        }
  
        // Validar que las coordenadas sean válidas y que estén dentro de Chile
        data.forEach(pharm => {
          if(isValidCoords(pharm.local_lat , pharm.local_lng)) {
            if(isLocatedInChile(pharm.local_lat , pharm.local_lng)) {
  
              // Formatear las horas de apertura y cierre
              pharm.funcionamiento_hora_apertura = pharm.funcionamiento_hora_apertura.split(":")
              pharm.funcionamiento_hora_apertura = pharm.funcionamiento_hora_apertura[0] + ":" + pharm.funcionamiento_hora_apertura[1]
  
              pharm.funcionamiento_hora_cierre = pharm.funcionamiento_hora_cierre.split(":")
              pharm.funcionamiento_hora_cierre = pharm.funcionamiento_hora_cierre[0] + ":" + pharm.funcionamiento_hora_cierre[1]
  
              // Asignar icono según el nombre de la farmacia
              if(pharm.local_nombre.includes("CRUZ VERDE")) {
                pharm.icon = customMarkers.cruz_verde
                pharm.customLogo = icons.cruz_verde.logo
              } else if(pharm.local_nombre.includes("AHUMADA")) {
                pharm.icon = customMarkers.farmacias_ahumada
                pharm.customLogo = icons.farmacias_ahumada.logo
              } else if(pharm.local_nombre.includes("SALCOBRAND")) {
                pharm.icon = customMarkers.salcobrand
                pharm.customLogo = icons.salcobrand.logo
              } else if(pharm.local_nombre.includes("SIMI")) {
                pharm.icon = customMarkers.dr_simi
                pharm.customLogo = icons.dr_simi.logo
              }  else if(pharm.local_nombre.includes("KNOP")) {
                pharm.icon = customMarkers.knop
                pharm.customLogo = icons.knop.logo
              } else {
                pharm.icon = customMarkers.farmacia_default
                pharm.customLogo = icons.farmacia_default.logo
              }
              this.pharms.push(pharm)
            }
          }
        })
  
        let topPharms = []
  
        // Cantidad Sucursales principales farmacias
        let cruzVerde = this.pharms.filter(pharm => pharm.local_nombre.includes("CRUZ VERDE")).length
        let ahumada = this.pharms.filter(pharm => pharm.local_nombre.includes("AHUMADA")).length
        let salcobrand = this.pharms.filter(pharm => pharm.local_nombre.includes("SALCOBRAND")).length
        let drSimi = this.pharms.filter(pharm => pharm.local_nombre.includes("SIMI")).length
  
        topPharms.push({name: "Cruz Verde", value: cruzVerde ,logo: icons.cruz_verde.logo} )
        topPharms.push({name: "Ahumada", value: ahumada, logo: icons.farmacias_ahumada.logo})
        topPharms.push({name: "Salcobrand", value: salcobrand, logo: icons.salcobrand.logo})
        topPharms.push({name: "Dr. Simi", value: drSimi, logo: icons.dr_simi.logo})
  
        topPharms.sort((a, b) => b.value - a.value)
  
        this.topPharms = topPharms
  
        // Array con las comunas únicas
        this.communes = [...new Set(this.pharms.map(item => item.comuna_nombre))]
      } catch(error) {
        this.fetchError = true
        console.error('Error en la solicitud:', error.message)
      }
    },
    async getNearestPharm() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
  
          (position) => {
            let userLat = position.coords.latitude
            let userLng = position.coords.longitude
  
            // Arrray con todas las coordenadas de las farmacias
            let allCoordinates = this.pharms.map(pharm => {
              return { lat: pharm.local_lat, lng: pharm.local_lng}
            })
  
            let nearestPharm = getNearestCoordinate(allCoordinates,{lat: userLat, lng: userLng})
            
            // Crear ruta con leaflet routing machine
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
                    marker = L.marker(start.latLng, { draggable: false, icon: markerIcon, title: "Tú ubicación"})
                  } else {
                    marker = L.marker(start.latLng, { draggable: false})
                  }
                  return marker
                }
              }
            )
  
            // Control de la ruta
            let mapRouter = L.Routing.control({
              waypoints: [L.latLng(userLat, userLng), L.latLng(nearestPharm.lat , nearestPharm.lng)],
              plan: plan,
              showAlternatives: false,
              lineOptions: {
                styles: [{color: "magenta", opacity: 1, weight: 3}],
                addWaypoints: false,
              },
              routeWhileDragging: true,
              language: "es",
            }).addTo(this.map)

            this.mapMarkers.clearLayers()

            this.mapRouter.router = mapRouter
            this.mapRouter.isEmpty = false
            this.openMap()

          },
          (error) => {
            console.log(error)
          },
        )
   
      } else {
        console.log("La api de geolocalización no está disponible en este navegador.")
      }
    },
    setCommune(commune) {
      this.commune.prevValue = this.commune.value
      this.commune.value = commune
    },
    setCommuneSearch(userSearch) {
      this.commune.userSearch = userSearch
    },
    setCurrentPharm(pharm) {
      this.currentPharm = pharm
    },
    setPharmsMap(item) {
      this.map = item.map
      this.mapMarkers = item.markers
    },
    setMapRouter(item) {
      this.mapRouter.router = item.router
      this.mapRouter.isEmpty = item.isEmpty
    },
    setAllPagination (value) {
      this.pagination.all = this.pagination.all + value
    },
    setCommunePagination (value) {
      this.pagination.commune.value = this.pagination.commune.value + value
    },
    resetPagination () {
      this.pagination.all = 25
      this.pagination.commune.value = 25
    },
    openMap() {
      document.querySelector(".layout-mapa").classList.add("show")
      this.map.invalidateSize()
    },
  }
})