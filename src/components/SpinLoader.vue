<template>
  <div class="overlay">
    <div class="spin-loader">
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss">

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.425);
    backdrop-filter: blur(5px);
    z-index: 9990;
    display: flex;
    justify-content: center;
    align-items: center;

    .spin-loader {
      display: inline-block;
      width: 80px;
      height: 80px;
      border: 7px solid #f3f3f3;
      border-radius: 50%;
      border-top: 7px solid #3498db;
      width: 40px;
      height: 40px;
      -webkit-animation: spin 2s linear infinite; /* Safari */
      animation: spin 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
    }
  }

  @keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
</style>