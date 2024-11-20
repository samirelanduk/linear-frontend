import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { BarLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import TriangleIcon from "../assets/triangle.svg?react";
import SyncIcon from "../assets/sync.svg?react";
import Team from "./Team";
import { getOrganization } from "../fetch";
import { DataContext } from "../contexts";

const Organization = props => {

  const { name, organization, states } = props;

  const [collapsed, setCollapsed] = useState(false);
  const [,setData] = useContext(DataContext);

  const teams = Object.values(organization.teams);
  teams.sort((a, b) => b.issueCount - a.issueCount);

  const onSync = async () => {
    setData(prev => ({...prev, [name]: {
      ...prev[name], teamsLoading: true, projectsLoading: true, issuesLoading: true
    }}));
    await getOrganization(organization, setData);
  }

  return (
    <div className="w-full">
      <div className="ml-10">
        <h2 className="text-4xl font-semibold mb-6">
          {name}
          <TriangleIcon
            onClick={() => setCollapsed(!collapsed)}
            className={`w-10 inline-block ml-2 mb-1 h-auto fill-indigo-200 opacity-50 hover:opacity-80 cursor-pointer transition-[transform] ${collapsed ? "rotate-90" : "rotate-0"}`}
          />
          <SyncIcon
            onClick={onSync}
            className={`w-6 inline-block ml-2 mb-1 h-auto fill-indigo-200 opacity-50 hover:opacity-80 cursor-pointer transition-[transform] ${organization.teamsLoading ? "animate-spin" : ""}`}
          />
        </h2>
        <BarLoader color={colors.slate[300]} height={16} width={300} loading={organization.teamsLoading} />
      </div>
      {!organization.teamsLoading && !collapsed && (
        <div className="flex overflow-auto gap-10">
          <div className="w-0" />
          {teams.map(team => <Team key={team.id} team={team} organization={organization} states={states} />)}
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