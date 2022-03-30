import { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Search from "@arcgis/core/widgets/Search";

interface MapProps {
  onExtentChange: (args: object) => void;
}

export default function Map({ onExtentChange }: MapProps) {

  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      // Create the map:
      const view = new MapView({
        container: mapDiv.current,
        map: {
          basemap: "hybrid"
        },
        center: [0, 0],
        zoom: 3
      });

      view.when(() => {
        var searchWidget = new Search({
          view: view
        });
        view.ui.add(searchWidget, {
          position: "top-right"
        });

        view.watch("extent", () => {
          onExtentChange(webMercatorUtils.webMercatorToGeographic(view.extent).toJSON());
        });

        onExtentChange(webMercatorUtils.webMercatorToGeographic(view.extent).toJSON()); // call once!
      });
    }
  }, []); // eslint-disable-line

  return <div className="mapDiv" ref={mapDiv}></div>;
}
