import { useContext } from "react";
import PropTypes from "prop-types";
import { StatesContext } from "../contexts";

const StatesToggle = props => {

  const [states, setStates] = useContext(StatesContext);

  const options = [
    {value: "backlog", label: "Backlog"},
    {value: "unstarted", label: "Unstarted"},
    {value: "started", label: "Started"},
  ]

  return (
    <div
      className={`hidden sm:flex gap-4 border w-fit py-2 rounded-lg border-indigo-300 bg-slate-700 z-50 sm:px-2.5 sm:gap-5 md:px-3 md:gap-6 ${props.className || ""}`}
    >
      {options.map(option => (
        <label
          key={option.value}
          className="inline-flex justify-center items-center gap-1 cursor-pointer text-xs sm:text-sm md:text-base"
          onClick={() => setStates(states.includes(option.value) ? states.filter(state => state !== option.value) : [...states, option.value])}
        >
          <div className="w-4 h-4 p-0.5 rounded border-2 border-indigo-300">
            {states.includes(option.value) && <div className="w-full h-full bg-indigo-500 rounded-sm" />}
          </div>
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

StatesToggle.propTypes = {
  className: PropTypes.string,
};

export default StatesToggle;