import React, { useState } from "react";
import {
  CalciteButton,
  CalciteIcon,
  CalciteModal
} from "@esri/calcite-components-react";

export default function Instructions() {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  return (
    <div>
      <CalciteButton
        appearance="transparent"
        className="right"
        onClick={() => {
          openModal();
        }}
        title="More Information"
      >
        <CalciteIcon icon="question" />
      </CalciteButton>
      <CalciteModal active={open ? true : undefined} disableCloseButton={true}>
        <div slot="header" id="modal-title">ArcGIS JS API Extent Helper</div>
        <div slot="content">
          First zoom to the exact extent you'd like to start with, then
          copy/paste the extent into your{" "}
          <a
            href="https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#extent"
            target="_blank"
            rel="noopener noreferrer"
          >
            MapView constructor - extent property
          </a>
          .

          Discover more information or log an issue by going to{" "}
          <a
            href="https://github.com/gavinr/arcgis-js-api-extent-helper"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/gavinr/arcgis-js-api-extent-helper
          </a>
          .
        </div>
        <CalciteButton slot="primary" width="full" onClick={() => {
          closeModal();
        }}>OK</CalciteButton>
      </CalciteModal>
    </div>
  );
}
