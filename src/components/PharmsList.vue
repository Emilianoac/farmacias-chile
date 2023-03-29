<template>
  <ul class="listado-farmacias mb-0 pe-lg-3">
    <template v-if="pharms.length">
      <li 
        v-for="(p, i) in pharms" 
        class="farmacia" :key="i" 
        :class="{'selected': p.local_id == (pharmsStore.currentPharm ? pharmsStore.currentPharm.local_id : '') }"
        @click="setCurrentPharm(p)">
          <img class="farmacia__logo img-fluid" :src="p.customLogo"/>
          <p class="farmacia__dato comuna text-muted small mb-0">
            {{ p.comuna_nombre.toLowerCase() }}
          </p>
          <p class="farmacia__dato nombre">
            {{ p.local_nombre }}
          </p>
          <p class="farmacia__dato direccion" :title="p.local_direccion">
            <i class="fas fa-map-marker-alt me-2"></i>{{ p.local_direccion }}
          </p>
          <p class="farmacia__dato horario">
            <i class="fas fa-clock me-2"></i>{{ p.funcionamiento_hora_apertura }} - {{ p.funcionamiento_hora_cierre }}
          </p>
          <p class="farmacia__dato telefono">
            <i class="fas fa-phone me-2"></i>{{ p.local_telefono }}
          </p>
      </li>
    </template>
    <Skeleton v-else v-for="skeleton in 20"/>
  </ul>
  <SpinLoader v-if="isLoadingMarkers">

  </SpinLoader>
</template>

<script setup>
  import {ref, onMounted } from 'vue'
  import {usePharmsStore} from '../stores/pharmsStore'
  import Skeleton from './Skeleton.vue'
  import Loader from './SpinLoader.vue'
  import L, { icon } from 'leaflet'
  import SpinLoader from './SpinLoader.vue'

  const props = defineProps({
    pharms: {
      type: Array,
      required: true,
    },
  })

  const pharmsStore = usePharmsStore()
  let isLoadingMarkers = ref(false)

  onMounted(() => {
    document.body.style.overflow = 'hidden'
    let pharmsList = document.querySelector('.listado-farmacias')
    pharmsList.addEventListener('scroll', () => {
      if (pharmsList.scrollTop + pharmsList.clientHeight >= pharmsList.scrollHeight -300) {
        if(pharmsStore.commune.value == 'TODAS') {
          pharmsStore.setAllPagination(25)
        } else {
          pharmsStore.setCommunePagination(25)
        }
      }
    })
  })

  function setCurrentPharm(pharm) {

    pharmsStore.setCurrentPharm(pharm)

    let map = pharmsStore.map
    let currentZoom = map.getZoom()
    
    map.flyTo([pharm.local_lat, pharm.local_lng], 18, {
      pan: true,
      animate: true,
      duration: currentZoom > 15 ? 0.8 : 2.5,
      easeLinearity: 0.25,
    })
    
    if(!pharmsStore.mapRouter.isEmpty) {
      pharmsStore.mapRouter.router.setWaypoints([])
      pharmsStore.mapRouter.router._container.remove()

      pharmsStore.setMapRouter({
        router: pharmsStore.mapRouter.router,
        isEmpty: true,
      })

      pharmsStore.mapMarkers.clearLayers()

      // Volver a pintar los marcadores
      pharmsStore.pharms.forEach(pharm => {
        let coords = [pharm.local_lat , pharm.local_lng]
        let marker = L.marker(coords, {
          icon: pharm.icon, 
          riseOnHover: true,
          title: pharm.local_nombre
        })
  
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
        pharmsStore.mapMarkers.addLayer(marker)   
      }) 
      pharmsStore.map.addLayer(pharmsStore.mapMarkers)

    } else {
    }
    
    pharmsStore.openMap()
  }

</script>

<style lang="scss">

  // Select comunas
  .custom-select {
    color: var(--text-color);
    
    .custom-select__container {
      position: relative;
      border: 1px solid var(--bg-color-high);
      border-radius: 5px;

      .select__seleccionado {
        background-color: var(--bg-color-low);
        padding: 0.5em;
        border-radius: 5px;
        cursor: pointer;
  
        &::before {
          content: "▼";
          float: right;
          margin-right: 1em;
        }
      }
  
      .select__body {
        position: absolute;
        background-color: var(--bg-color-low);
        width: 100%;
        padding: 1em;
        z-index: 99;
        border-radius: 5px;
        margin-top: 2px;
        box-shadow:  0 0 10px 0 rgba(0,0,0,0.2);
  
        .select__buscador {
          padding: 0.4em;
          margin-bottom: 1em;
        }
  
        .select__listado {
          max-height: 300px;
          overflow-y: auto;
          padding: 0;
          list-style-type: none;
          color: black;
          margin: 0;
  
          li {
            padding: 0.4em;
            border-bottom: 1px solid var(--bg-color-low);
            cursor: pointer;
            text-transform: lowercase;
            color: var(--text-color);
  
            &::first-letter {
              text-transform: uppercase;
            }
  
            &:hover {
              background-color: var(--bg-color-high);
            }
          }
        }
      }
    }
    
  }

  // Listado de farmacias
  .listado-farmacias {
    list-style-type: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2,1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    color: var(--text-color);
    max-height: calc(100vh - 190px);
    overflow: auto;

    .farmacia {
      background: var(--bg-color-low);
      padding: 1em;
      word-wrap: anywhere;
      border: 2px solid var(--bg-color);
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.95em;
      position: relative;

      .farmacia__logo {
        max-width: 30px;
        position: absolute;
        right: 5px;
        top: 5px;
      }

      .farmacia__dato {
        margin-bottom: 0.3em;

        svg {
          font-size: 0.85em;
          width: 12px;
          color: var(--text-color);
          opacity: 0.8;
        }

        &.comuna {

          &::first-letter {
            text-transform: uppercase;
          }
        }

        &.nombre {
          font-weight: 700;
          font-size: 0.9em;
          display: block;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &.direccion {
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.96em;
          text-transform: lowercase;
  
          &::first-letter {
            text-transform: uppercase;
          }
        }

        &.telefono {

          a {
            color: var(--text-color);
            
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }


      &:hover {
        border: 2px solid #009fff;
        background: va(--bg-color-low);

        .farmacia__dato {
          
          &.nombre {
            color: #009fff;
          }
        }
        
      }

    }

    .farmacia.selected {
      border: 2px solid #009fff;

      .farmacia__dato {
        
        &.nombre {
          color: #009fff;
        }
      }
    }
  }

  @media ( max-width: 576px) {

    .listado-farmacias {
      max-height: calc(100vh);
    }
  }

</style>