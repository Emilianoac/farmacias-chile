export function openMap() {
  document.querySelector('.layout-mapa').classList.add('show')
  pharmsStore.map.invalidateSize()
}