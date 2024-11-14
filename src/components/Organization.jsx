import PropTypes from "prop-types";
import { BarLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import Team from "./Team";

const Organization = props => {

  const { name, organization, states } = props;

  return (
    <div className="w-full">
      <div className="ml-10">
        <h2 className="text-4xl font-semibold mb-6">{name}</h2>
        <BarLoader color={colors.slate[300]} height={16} width={300} loading={organization.teamsLoading} />
      </div>
      {!organization.teamsLoading && (
        <div className="flex overflow-auto gap-10">
          <div className="w-0" />
          {Object.values(organization.teams).map(team => <Team key={team.id} team={team} organization={organization} states={states} />)}
          <div className="w-0" />
        </div>
      )}
    </div>
  );
};

Organization.propTypes = {
  name: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  states: PropTypes.array.isRequired,
};

export default Organization;