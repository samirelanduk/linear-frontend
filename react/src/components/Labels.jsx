import PropTypes from "prop-types";

const Labels = props => {

  const { issue } = props;

  return (
    <div className="text-2xs flex gap-1.5">
      {issue.labels.map(label => (
        <div key={label.id} className="leading-4 -mt-1 px-1.5 font-medium rounded" style={{background: `${label.color}80`}}>
          {label.name}
        </div>
      ))}
    </div>
  );
};

Labels.propTypes = {
  issue: PropTypes.object.isRequired,
};

export default Labels;