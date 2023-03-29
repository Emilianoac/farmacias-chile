export function getNearestCoordinate(coordinates, targetCoordinate) {
  let nearestCoordinate = null
  let shortestDistance = Infinity

  for (let i = 0; i < coordinates.length; i++) {
    const distance = getDistance(coordinates[i], targetCoordinate)
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestCoordinate = coordinates[i]
    }
  }

  return nearestCoordinate
}

function getDistance(coordinate1, coordinate2) {
  const lat1 = coordinate1.lat;
  const lon1 = coordinate1.lng;
  const lat2 = coordinate2.lat;
  const lon2 = coordinate2.lng;

  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  return d;
}