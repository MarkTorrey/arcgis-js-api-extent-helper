import React, { useState } from 'react';
import {
  CalciteLabel,
  CalcitePopover,
  CalciteInput,
  CalciteRadioButtonGroup,
  CalciteRadioButton,
} from '@esri/calcite-components-react';

interface SpatialReferenceCBProps {
  wkidDidChange(data: number): void;
  currentWkid: number;
}

export default function SpatialReferenceCtrl({
  wkidDidChange,
  currentWkid,
}: SpatialReferenceCBProps) {
  const [poOpen, setPoOpen] = useState(false);
  const [customWkid, setCustomWkid] = useState(0);

  const customWkidInputDidChange = (
    evt: React.KeyboardEvent<HTMLCalciteInputElement>
  ) => {
    const inVal = parseInt(evt.currentTarget.value) || 0;
    // probably newed more validation here to ensure
    // the wkid entered is really a supported wkid
    // there's a list of supported wkid's the could possibly be used:
    // https://github.com/Esri/projection-engine-db-doc/blob/master/json/pe_list_geogcs.json
    // https://github.com/Esri/projection-engine-db-doc/blob/master/json/pe_list_projcs.json
    if (evt.key === 'Enter' && inVal > 0) {
      setPoOpen(false);
      setCustomWkid(inVal);
      wkidDidChange(inVal);
    }
  };
  return (
    <div className='ctrl-container'>
      <CalciteRadioButtonGroup
        name='sr_rb_group'
        onCalciteRadioButtonGroupChange={(evt) => {
          if (evt.detail === 4326 || evt.detail === 102100) {
            wkidDidChange(parseInt(evt.detail));
          }
        }}
      >
        <CalciteLabel layout='inline'>
          <CalciteRadioButton
            {...(currentWkid === 4326 ? { checked: true } : {})}
            value={4326}
          ></CalciteRadioButton>
          WGS84
        </CalciteLabel>

        <CalciteLabel layout='inline'>
          <CalciteRadioButton value={102100}></CalciteRadioButton>
          Web Mercator
        </CalciteLabel>

        <CalcitePopover
          triggerDisabled={true}
          autoClose={true}
          open={poOpen}
          label='test'
          referenceElement={'popover-rb'}
          closable={true}
        >
          <div className='sr-po-container'>
            <CalciteLabel>
              Enter Wkid
              <CalciteInput
                type={'number'}
                value={customWkid.toString()}
                onKeyUp={customWkidInputDidChange}
              ></CalciteInput>
            </CalciteLabel>
          </div>
        </CalcitePopover>

        <CalciteLabel layout='inline'>
          <CalciteRadioButton
            id='popover-rb'
            value={customWkid}
          ></CalciteRadioButton>
          Other
        </CalciteLabel>
      </CalciteRadioButtonGroup>
    </div>
  );
}
