export const capitalize = (phrase: string): string => {
  return phrase
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const searchInArray = (
  array: Array<Record<string, any>>,
  searchVal: string | number
): boolean => {
  // console.log(array, searchVal, typeof searchVal);
  if (typeof searchVal === 'string') {
    return array.some((obj) =>
      Object.values(obj).some((value) =>
        String(value).toLowerCase().includes(searchVal.toLowerCase())
      )
    );
  } else if (typeof searchVal === 'number') {
    return array.some((obj) =>
      Object.values(obj).some((value) => value === searchVal)
    );
  }
  return false;
};

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const earthRadius = 6371; // Earth's radius in kilometers

  // Convert degrees to radians
  const radiansLat1 = degToRad(lat1);
  const radiansLat2 = degToRad(lat2);
  const deltaLat = degToRad(lat2 - lat1);
  const deltaLng = degToRad(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radiansLat1) *
      Math.cos(radiansLat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}

// Helper function to convert degrees to radians
function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}
export const storageUrl =
  'https://cysiyognkqizymdgsfjx.supabase.co/storage/v1/object/public/mediconnect/';
