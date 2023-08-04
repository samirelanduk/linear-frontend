import React, { useState } from "react";
import { useData } from "./hooks";
import Workspace from "./Workspace";
import StateFilter from "./StateFilter";
import { ActiveStateContext } from "./contexts";
import { statusColors } from "./states";

const App = () => {
  
  const data = useData();

  const [activeStates, setAcitveStates] = useState(Object.keys(statusColors));

  return (
    <ActiveStateContext.Provider value={[activeStates, setAcitveStates]}>
      <div className="py-8 bg-gray-50">
        <StateFilter />
        <div className="flex overflow-auto gap-8 mt-6 px-8">
          {Object.entries(data).map(([name, issues]) => (
            <Workspace key={name} name={name} issues={issues} />
          ))}
        </div>
      </div>
    </ActiveStateContext.Provider>
  );
};

App.propTypes = {
  
};

export default App;