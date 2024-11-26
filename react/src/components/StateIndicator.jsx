import PropTypes from "prop-types";

const StateIndicator = props => {

  const { issue } = props;

  const stateColor = {
    "backlog": "border-gray-500",
    "unstarted": "border-white",
    "started": "border-orange-500",
    "completed": "border-green-500 bg-green-600 bg-opacity-60",
    "canceled": "border-red-300",
  }[issue.state.type];

  return (
    <div className={`size-4 border-2 rounded-full flex-shrink-0 ${stateColor}`} />
  );
};

StateIndicator.propTypes = {
  issue: PropTypes.object.isRequired,
};

export default StateIndicator;