import { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { fetchLinear } from "../fetch";
import { UPDATE_ISSUE_STATE } from "../queries";
import { DataContext } from "../contexts";

const StateIndicator = props => {

  const { issue, clickable=true, stateIds } = props;

  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useContext(DataContext);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = e => {
      if (!ref.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const labels = {
    "backlog": "Backlog",
    "unstarted": "Unstarted",
    "started": "Started",
    "completed": "Completed",
    "canceled": "Canceled",
  }

  const stateColor = {
    "backlog": "border-gray-500",
    "unstarted": "border-white",
    "started": "border-orange-500",
    "completed": "border-green-500 bg-green-600 bg-opacity-60",
    "canceled": "border-red-300",
  }[issue.state.type];

  const optionClass = "px-2 py-1 cursor-pointer flex items-center gap-2 hover:bg-slate-600";

  const onClick = async state => {
    setLoading(true);
    if (issue.state.type === state) return;
    const json = await fetchLinear(issue.organization, UPDATE_ISSUE_STATE, {issueId: issue.id, stateId: stateIds[state]});
    const type = json.data.issueUpdate.issue.state.type;
    for (const workspace of (Object.values(data))) {
      const i = workspace.issues[issue.id];
      if (i) {
        i.state.type = type;
      }
    }
    setLoading(false);
    setData({...data});
    setShowMenu(false);
  }

  return (
    <div className="relative" ref={ref}>
      <div
        className={`size-4 border-2 rounded-full flex-shrink-0 cursor-pointer ${stateColor}`}
        onClick={() => clickable && setShowMenu(true)}
      />
      {showMenu && (
        <div className={`absolute overflow-hidden border text-sm -top-1.5 border-slate-300 rounded z-50 ${loading ? "pointer-events-none bg-slate-800" : "bg-slate-700 "}`}>
          {Object.entries(labels).map(([key, value]) => (
            <div
              key={key}
              onClick={() => onClick(key)}
              className={`${optionClass} ${issue.state.type === key ? "bg-slate-600" : ""}`}
            >
              <StateIndicator issue={{state: {type: key}}} clickable={false} />
              <div>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

StateIndicator.propTypes = {
  issue: PropTypes.object.isRequired,
  clickable: PropTypes.bool,
  stateIds: PropTypes.object.isRequired,
};

export default StateIndicator;