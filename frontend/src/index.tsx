import * as React from "react";
import * as ReactDOM from "react-dom";
import * as MapGL from "react-map-gl";

import * as config from "../config";

ReactDOM.render(
  <MapGL width={400} height={400} latitude={37.7577} longitude={-122.4376} zoom={10}
  mapboxApiAccessToken={config.mapboxApiAccessToken} />,
  document.getElementById("root")
  );
