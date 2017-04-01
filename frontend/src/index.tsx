import * as React from "react";
import * as ReactDOM from "react-dom";
import * as MapGL from 'react-map-gl';

import { NavbarComponent } from "./components/NavbarComponent";

import * as config from "../config";

ReactDOM.render(
  <div>
    <NavbarComponent />
    <MapGL 
      width={700}
      height={450}
      latitude={37.78}
      longitude={-122.45}
      zoom={11}/>
  </div>,
  document.getElementById("root")
  );
