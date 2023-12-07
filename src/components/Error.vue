<template>
  <div class="mensaje-error  my-5">
    <h1 class="mensaje__titulo">{{ mensaje }}</h1>
    <p>Por favor intente más tarde.</p>
  </div>
</template>

<script setup>

  const props = defineProps({
    mensaje: {
      type: String,
      default: "Actualmente, los datos no están disponibles."
    }
  })
</script>

<style lang="scss">

  .mensaje-error{
    text-align: center;
    color: var(--text-color);

    .mensaje__titulo {
      font-weight: 700;
    }
  }
</style>