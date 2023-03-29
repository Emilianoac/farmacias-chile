<template>
  <main class="main-404">
    <div class="container">
      <h1 class="text-center">404</h1>
      <h2 class="text-center">Página no encontrada</h2>
    </div>
  </main>
</template>

<script>
</script>

<style lang="scss">

  .main-404 {
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;

    h1 {
      font-size: 10em;
      font-weight: 700;
    }


    @media (max-width: 768px) {
      h1 {
        font-size: 6em;
      }
    }
  }

</style>