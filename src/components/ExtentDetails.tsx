import { useState, useEffect, useRef } from 'react';
import raw from 'raw.macro';
import beautify from 'js-beautify';
import Instructions from './Instructions';
import * as esriNS from '@arcgis/core/kernel';
import SpatialReferenceCB from './SpatialReferenceCB';
import * as projection from '@arcgis/core/geometry/projection';
import Extent from '@arcgis/core/geometry/Extent';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';

import { CalciteButton } from '@esri/calcite-components-react';

interface ExtentDetailsProps {
  extent: object;
}

export default function ExtentDetails({ extent }: ExtentDetailsProps) {
  const copyTextArea = useRef<HTMLTextAreaElement>(null);
  const [calculatedFullRequest, setCalculatedFullRequest] = useState('');
  const [currentWkid, setCurrentWkid] = useState(4326);
  const prjEng = projection;

  useEffect(() => {
    prjEng.load().then(() => {
      console.log('project engine ready');
    });
  }, [prjEng]);

  useEffect(() => {
    // we should probably change this to, instead of running every time, to only run when "new app" button is clicked.
    function createCodepen(extentJsCode: object) {
      const styleTemplate = raw('../templates/style.css');
      const htmlHeadTemplate = raw('../templates/head.html');
      const htmlTemplate = raw('../templates/html.html');
      const jsTemplate = raw('../templates/js.txt');
      var jt = beautify.js_beautify(
        jsTemplate.replace('[EXTENTHERE]', JSON.stringify(extentJsCode)),
        { indent_size: 2, space_in_empty_paren: true }
      );

      var data = {
        editors: '001',
        html: htmlTemplate,
        css: styleTemplate,
        js: jt,
        head: htmlHeadTemplate,
        js_external: `https://js.arcgis.com/${esriNS.version}/dojo/dojo.js`,
        css_external: `https://js.arcgis.com/${esriNS.version}/esri/css/main.css;https://s3-us-west-1.amazonaws.com/patterns.esri.com/files/calcite-web/1.2.5/css/calcite-web.min.css`,
      };

      var JSONstring = JSON.stringify(data);
      // Quotes will screw up the JSON
      // .replace(/"/g, "&​quot;") // careful copy and pasting, I had to use a zero-width space here to get markdown to post this.
      // .replace(/'/g, "&apos;");

      return JSONstring;
    }
    setCalculatedFullRequest(createCodepen(extent));
  }, [extent]);

  function copyJsonButtonClickHandler() {
    if (copyTextArea && copyTextArea.current) {
      copyTextArea.current.focus();
      copyTextArea.current.select();
      document.execCommand('copy');
    }
  }

  const projectAndFormatExtent = (): string => {
    const currentExtent = new Extent(extent);
    let res = JSON.stringify(currentExtent, null, 2);
    if (currentWkid !== 4326) {
      const sr = new SpatialReference({ wkid: currentWkid });
      if (prjEng.isLoaded()) {
        const newExtent = projection.project(currentExtent, sr);
        res = JSON.stringify(newExtent, null, 2);
      } else {
        console.log('projection engine not loaded');
      }
    }
    return res;
  };

  return (
    <div className='ExtentDetails'>
      <Instructions />
      <SpatialReferenceCB
        currentWkid={currentWkid}
        wkidDidChange={setCurrentWkid}
      ></SpatialReferenceCB>
      <textarea
        rows={15}
        cols={50}
        readOnly={true}
        value={projectAndFormatExtent()}
        ref={copyTextArea}
      />
      <br />
      <CalciteButton
        className='btn btn-clear'
        onClick={() => {
          copyJsonButtonClickHandler();
        }}
      >
        Copy JSON
      </CalciteButton>

      <form
        action='https://codepen.io/pen/define'
        method='POST'
        target='_blank'
        className='right'
      >
        <input
          type='hidden'
          id='formDataCodepen'
          name='data'
          value={calculatedFullRequest}
        />
        <CalciteButton type='submit' className='right'>
          New app at this location
        </CalciteButton>
      </form>
    </div>
  );
}
