import * as React from "react";
import * as ReactDOM from "react-dom";
import * as MapGL from 'react-map-gl';

import { NavbarComponent } from "./components/NavbarComponent";

import * as config from "../config";

ReactDOM.render(
  <div>
    <NavbarComponent />
    <MapGL 
      mapboxApiAccessToken={config.mapboxApiAccessToken}
      width={700}
      height={450}
      latitude={37.78}
      longitude={-122.45}
      zoom={11}
      mapStyle={'mapbox://styles/mapbox/streets-v10'} />
  </div>,
  document.getElementById("root")
  );
