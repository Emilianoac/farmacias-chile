export function isLocatedInChile(latitude, longitude) {
  if (latitude >= -56.0 && latitude <= -17.5 && longitude >= -81.0 && longitude <= -66.0) {
    // Coordenadas dentro de Chile continental
    return true
  } else if ((Math.round(latitude * 100) / 100 === -33.0 && Math.round(longitude * 100) / 100 === -78.0) || (Math.round(latitude * 100) / 100 === -27.16 && Math.round(longitude * 100) / 100 === -109.43)) {
    // Coordenadas para Isla de Pascua o Juan Fernández
    return true
  } else {
    // Coordenadas fuera de Chile
    return false
  }
}
