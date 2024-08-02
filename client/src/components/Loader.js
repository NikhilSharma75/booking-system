import React, { useState } from 'react';
import HashLoader from "react-spinners/HashLoader";


function Loader() {
  let [loading, setLoading] = useState(true);

  return (
    <div style={{marginTop:"150px"}}>
      <div4 className="sweet-loading text-center">
        <HashLoader
          color='#000'
          loading={loading}
          size={100}
        />
      </div4>
    </div>
  );
}

export default Loader;


