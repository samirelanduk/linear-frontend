import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { BarLoader } from "react-spinners";
import colors from "tailwindcss/colors";
import TriangleIcon from "../assets/triangle.svg?react";
import SyncIcon from "../assets/sync.svg?react";
import BellIcon from "../assets/bell.svg?react";
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

  const unreadCount = organization.notifications.filter(notification => !notification.readAt).length;
  const hasMore = unreadCount === organization.notifications.length;

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
            className={`w-7 inline-block ml-2 mb-1 h-auto fill-indigo-200 opacity-50 hover:opacity-80 cursor-pointer transition-[transform] ${organization.teamsLoading ? "animate-spin" : ""}`}
          />
          <a
            className="inline-block relative"
            href={`https://linear.app/${organization.urlKey}/inbox`}
            target="_blank" rel="noreferrer"
          >
            <BellIcon className={`w-7 inline-block ml-2 mb-1 h-auto fill-indigo-200 ${unreadCount ? "" : "opacity-40"}`} />
            {unreadCount > 0 && (
              <div className={`absolute bg-red-600 size-6 text-white font-bold rounded-full flex items-center justify-center -top-0.5 -right-2 ${unreadCount > 10 ? "text-sm" : "text-base"}`}>
                {unreadCount}{hasMore && "+"}
              </div>
            )}
          </a>
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