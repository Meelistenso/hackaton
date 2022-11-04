export interface ITile {
  x: number;
  y: number;
}

export interface ILatLong {
  long: number;
  lat: number;
}

export const latLong2tile = ( lon: number, lat: number, zoom: number): ITile => {
  return {
    x: lon2tile(lon, zoom),
    y: lat2tile(lat, zoom)
  };
}

export const tile2latLong = ( x: number, y: number, zoom: number): ILatLong => {
  return {
    long: tile2long(x, zoom),
    lat: tile2lat(y, zoom)
  };
}

const lon2tile = (lon: number, zoom: number): number => {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
};

const lat2tile = (lat: number, zoom: number): number => {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom),
  );
};

const tile2long = (x: number, z: number): number => {
  return (x / Math.pow(2, z)) * 360 - 180;
};

const tile2lat = (y: number, z: number): number => {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};
