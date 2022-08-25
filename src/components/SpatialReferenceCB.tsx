//import React, { useState } from 'react';
import {
  CalciteCombobox,
  CalciteComboboxItem,
  CalciteLabel,
} from '@esri/calcite-components-react';

interface SpatialReferenceCBProps {
  wkidDidChange(data: number): void;
  currentWkid: number;
}

const srMap = [
  { value: 4326, label: 'WGS84 (4326)' },
  { value: 102100, label: 'Web Mercator (102100)' },
  { value: 4011, label: 'Clarke 1880 (4011)' }, // ? add more here
];

export default function SpatialReferenceCB({
  wkidDidChange,
  currentWkid,
}: SpatialReferenceCBProps) {
  return (
    <div className='ctrl-container'>
      <CalciteLabel>
        Spatial reference
        <CalciteCombobox
          selection-mode='single'
          label='cb1'
          onCalciteComboboxChange={(itms) => {
            const v = parseInt(itms.detail.selectedItems[0].value);
            if (v) {
              wkidDidChange(v);
            }
          }}
        >
          {srMap.map((sr) => {
            return (
              <CalciteComboboxItem
                key={`${sr.value}_${sr.label}`}
                selected={currentWkid === sr.value}
                textLabel={sr.label}
                value={sr.value}
              ></CalciteComboboxItem>
            );
          })}
        </CalciteCombobox>
      </CalciteLabel>
    </div>
  );
}
