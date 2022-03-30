import { useState } from 'react';
import Map from './components/Map';
import ExtentDetails from './components/ExtentDetails';

function App() {
  const [extent, setExtent] = useState({});

  return (
    <div className="App">
      <Map
        onExtentChange={(newExtent: object) => {
          setExtent(newExtent);
        }}
      />
      <ExtentDetails extent={extent} />
    </div>
  );
}

export default App;
