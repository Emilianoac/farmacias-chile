<template>
  <nav class="main-navbar navbar navbar-expand-sm" ref="navbar">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <strong><i class="fas fa-plus  text-danger me-1"></i> Farmacias Chile </strong>
      </RouterLink>
      <ul class="navbar-nav me-0 flex-row">
        <li class="nav-item me-3" title="Repositorio Github">
          <a class="nav-link" href="https://github.com/Emilianoac/farmacias-chile" target="_blank"><i class="fab fa-github"></i></a>
        </li>
        <li class="nav-item me-3 d-none d-xl-block" title="Información datos utilizados">
          <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#modalInfo" aria-current="page">
            <i class="fas fa-question-circle ms-1"></i>
          </a>
        </li>
        <li class="nav-item" title="Cambiar tema de color">
          <button class="nav-link" @click="changeThemeColor()"><i class="fas fa-sun"></i></button>
        </li>
      </ul>
    </div>
  </nav>

  <div class="navbar-movil w-100 card p-2 d-xl-none" ref="mobileMenu">
    <ul class="mb-0">
      <li>
        <button class="text-center" @click="pharmsStore.openMap()">
          <i class="fas fa-globe-americas"></i>
          <span class="ms-1 d-block small text-muted">Mapa</span>
        </button> 
      </li>
      <li>
        <button class="text-center" data-bs-toggle="modal" data-bs-target="#modalRanking">
          <i class="far fa-chart-bar"></i>
          <span class="ms-1 d-block small text-muted">Ranking</span>
        </button> 
      </li>
      <li>
        <button class="text-center" data-bs-toggle="modal" data-bs-target="#modalInfo">
          <i class="fas fa-question-circle"></i>
          <span class="ms-1 d-block small text-muted">Acerda de</span>
        </button> 
      </li>
    </ul>
  </div>
</template>

<script setup>
  import {usePharmsStore} from '../stores/pharmsStore'

  const pharmsStore = usePharmsStore()

  function changeThemeColor() {
    let metaThemeColor = document.querySelector("meta[name=theme-color]")
    let darkColor = "#14202a"
    let lightColor = "#ffffff"

    if(metaThemeColor.getAttribute("content") != darkColor) {
      metaThemeColor.setAttribute("content", darkColor)
    } else {
      metaThemeColor.setAttribute("content", lightColor)
    }

    document.documentElement.classList.toggle('dark')
  }

</script>

<style lang="scss">

  .main-navbar {
    border-bottom: 1px solid var(--bg-color-low);
    background: var(--bg-color);

    .navbar-brand {
      color: var(--text-color);
    }

    .nav-link {
      color: var(--text-color);
      border: 0;
      background: transparent;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .navbar-movil {
    position: fixed;
    bottom: 10px;
    max-width: 95%;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 999999;
    background: var(--bg-color-high);
    color: var(--text-color);
    border: 1px solid var(--bg-color-high);
    box-shadow: 2px 2px 2px var(--bg-color-low);

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      
      li {
        font-size: 0.95em;
        justify-self: center;
        width: 100%;
        text-align: center;

        button {
          color: var(--text-color);
          border: 0;
          background: transparent;
          padding: 0;
          width: 100%;

          span {
            font-size: 0.8em;
          }
        }

        &:first-of-type {
          justify-self: flex-start;
        }

        &:last-of-type {
          justify-self: flex-end;
        }

        &:hover {
           
          svg {
            color: dodgerblue;
          }
        }
      }
    }
  }

  @media (max-width: 576px) {

    .main-navbar {

      .navbar-brand {
        font-size: 1.1em;
      }
    }
  }
</style>