import React from "react";
import { useData } from "./hooks";

const App = () => {

  const data = useData();

  return (
    <div>
      Linear
    </div>
  );
};

App.propTypes = {
  
};

export default App;