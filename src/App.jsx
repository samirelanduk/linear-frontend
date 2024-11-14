import { useEffect, useState } from "react";
import Organization from "./components/Organization";
import { loadTokens } from "./tokens";

const App = () => {

  const organizations = loadTokens();

  const [data, setData] = useState(organizations.reduce((acc, organization) => {
    acc[organization.name] = {
      projectsLoading: true,
      teamsLoading: true,
      projects: {},
      teams: {},
    };
    return acc;
  }, {}));

  const TEAMS = `{
    teams(first: 100) {
      nodes {
        id name color
        members(filter: { isMe: { eq: true } }) { nodes { id } }
      }
    }
  }`;

  useEffect(() => {
    const f = async () => {
      for (const organization of organizations) {
        const resp = await fetch("https://api.linear.app/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": organization.token
          },
          body: JSON.stringify({query: TEAMS, variables: {}})
        });
        const json = await resp.json();
        setData(prev => {
          const currentOrgState = prev[organization.name];
          currentOrgState.teamsLoading = false;
          currentOrgState.teams = json.data.teams.nodes.reduce((acc, team) => {
            if (team.members.nodes.length === 0) return acc;
            delete team.members
            acc[team.id] = team;
            return acc;
          }, {});
          return {
            ...prev,
            [organization.name]: currentOrgState
          };
        });
      }
    }
    f();
  }, []);

  return (
    <div className="flex flex-col gap-10 py-8">
      {Object.entries(data).map(([name, organization]) => (
        <Organization key={name} name={name} organization={organization} />
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;