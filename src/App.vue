<template>
  <Layout>
    <RouterView/>
  </Layout>

  <teleport to="body">
    <div 
      class="modal modal-custom fade" 
      id="modalInfo" 
      tabindex="-1" 
      aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Sobre los datos</h5>
              <button class="btn-cerrar" data-bs-dismiss="modal" aria-label="Close" ><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
              <p>
                Los datos provienen de la API publica proporcionada por
                el <a href="https://www.minsal.cl/" target="_blank">Ministerio de Salud de Chile</a>.
                Esta proporciona información sobre las farmacias ubicadas en Chile, incluyendo 
                su ubicación geográfica, el nombre de la farmacia, su dirección y otros detalles. 
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
    </div>

    <div 
      class="modal modal-custom fade" 
      id="modalRanking"
      tabindex="-1" 
      aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Cadenas Principales</h5>
              <button class="btn-cerrar" data-bs-dismiss="modal" aria-label="Close" ><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
              <ul class="ranking-farmacias p-0 mb-0" v-if="pharmsStore.topPharms.length">
                <li class="d-flex align-items-center" v-for="(pharm, i) in pharmsStore.topPharms">
                  <img class="img-fluid" :src="pharm.logo"/>
                  <div>
                    <strong>{{ pharm.name }}</strong>
                    <span class="d-block small">{{ pharm.value }} Sucursales</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </teleport>
</template>

<script setup>
  import Layout from './layout/Layout.vue'
  import {usePharmsStore} from '@/stores/pharmsStore'

  const pharmsStore = usePharmsStore()

</script>

<style lang="scss">

  :root {
    --bg-color : #ffffff;
    --bg-color-high: #ececec;
    --bg-color-low: #f1f5f5;
    --text-color : #192236;
  }

  :root.dark {
    --bg-color : #14202a;
    --bg-color-high: #141316;
    --bg-color-low: #0f1a23;
    --text-color : #ffffff;
  }

  body {
    font-size: 16px;
    background-color: var(--bg-color);
    min-height: 100vh;
    color: var(--text-color);
    line-height: 1.6;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  .modal.modal-custom {
    z-index: 9999999;

    .modal-dialog {
      max-width: 390px;
      margin: auto;
      width: 85%;

      .modal-content {
        background-color: var(--bg-color);
        color: var(--text-color);
  
        .modal-header {
          border-bottom: 1px solid var(--bg-color-high);
          display: flex;
  
          .btn-cerrar {
            border: 0;
            background: transparent;
            color: var(--text-color);
          }
  
          h5 {
            color: var(--text-color);
            font-weight: 700;
          }
  
        }
        
        .modal-body {
          color: var(--text-color);
  
          .ranking-farmacias {

            li {
              margin-bottom: 1.2em;

              img {
                max-width: 60px;
                margin-right: 0.5em;
              }

              &:last-of-type {
                margin-bottom: 0;
              }
            }
          }
        }
  
        .modal-footer {
          border-top: 1px solid var(--bg-color-high);
        }
      }
    }

  }

  .modal-backdrop.show  {
    backdrop-filter: blur(5px);
    background: #000000c9;
    opacity: 1;
    z-index: 999999;
  }

</style>
