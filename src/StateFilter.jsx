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
    <div>
      {Object.entries(statusColors).map(([name, color]) => (
        <div
          key={name}
          onClick={() => toggleState(name)}
          className={`flex cursor-pointer ${activeStates.includes(name) ? "" : "opacity-20"}`}
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