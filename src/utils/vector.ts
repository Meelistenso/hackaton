import { ILatLong } from "./tiles";

export const dirAngle = (prevLatLong: ILatLong, currentLatLong: ILatLong): number => {
  const dy = currentLatLong.lat - prevLatLong.lat;
  const dx = currentLatLong.long - prevLatLong.long;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}
