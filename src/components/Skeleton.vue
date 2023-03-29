<template>
  <div class="skelton"></div>
</template>

<script setup>
</script>

<style>
  .skelton {
    width: 100%;
    height: 200px;
    background: #f5f5f5;
    border-radius: 4px;
    animation: pulse 1s infinite ease-in-out;
  }

  @keyframes pulse {
    0% {
      background-color: #f5f5f5;
    }
    50% {
      background-color: #e8e8e8;
    }
    100% {
      background-color: #f5f5f5;
    }
  }
</style>