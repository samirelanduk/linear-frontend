import React, { useContext } from "react";
import { statusColors } from "./states";
import { ActiveStateContext } from "./contexts";

const StateFilter = () => {

  const [activeStates, setAcitveStates] = useContext(ActiveStateContext);

  const toggleState = state => {
    if (activeStates.includes(state)) {
      setAcitveStates(activeStates.filter(e => e !== state));
    } else {
      setAcitveStates([...activeStates, state]);
    }
  };

  return (
    <div className="flex gap-8 border rounded w-fit px-4 py-2 ml-8 bg-white">
      {Object.entries(statusColors).map(([name, color]) => (
        <div
          key={name}
          onClick={() => toggleState(name)}
          className={`flex gap-2 cursor-pointer ${activeStates.includes(name) ? "" : "opacity-20"}`}
        >
          <div className={`w-5 h-5 rounded-full ${color}`} />
          <div className="whitespace-nowrap">{name}</div>
        </div>
      ))}
    </div>
  );
};

StateFilter.propTypes = {
  
};

export default StateFilter;