import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const StatesToggle = props => {

  const { states, setStates } = props;

  const [scrollDistance, setScrollDistance] = useState(0);
  
  const scale = Math.max(100 - (scrollDistance / 2), 60);
  const right = Math.max(20, 40 - (scrollDistance / 2));
  const top = Math.max(20, 30 - (scrollDistance / 2));

  useEffect(() => {
    const onScroll = () => {
      setScrollDistance(window.scrollY);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const options = [
    {value: "backlog", label: "Backlog"},
    {value: "unstarted", label: "Unstarted"},
    {value: "started", label: "Started"},
  ]

  return (
    <div
      className={`flex gap-6 border w-fit py-2 px-3 rounded-lg border-indigo-300 bg-slate-700 z-50 ${props.className || ""}`}
      style={{scale: `${scale}%`, right, top, transformOrigin: "top right"}}
    >
      {options.map(option => (
        <label
          key={option.value}
          className="inline-flex justify-center items-center gap-1 cursor-pointer"
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
  states: PropTypes.array.isRequired,
  setStates: PropTypes.func.isRequired,
};

export default StatesToggle;