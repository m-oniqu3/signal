import * as L from "leaflet";

declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function markerClusterGroup(options?: any): L.LayerGroup;
}
