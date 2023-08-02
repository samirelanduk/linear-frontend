import React from "react";
import { useData } from "./hooks";
import Workspace from "./Workspace";

const App = () => {

  const data = useData();

  return (
    <div className="flex">
      {Object.entries(data).map(([name, issues]) => (
        <Workspace key={name} name={name} issues={issues} />
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;