import React, { useEffect, useState } from "react";

const App = () => {

  const getTokens = () => {
    const workspaceNumbers = [];
    const pattern = /^VITE_WORKSPACE[0-9]+/;
    for (const key in import.meta.env) {
      if (pattern.test(key)) {
        const number = key.match(/[0-9]+/)[0];
        if (!workspaceNumbers.includes(number)) workspaceNumbers.push(number);
      }
    }
    workspaceNumbers.sort((a, b) => a - b);
    return workspaceNumbers.map(number => {
      return {
        name: import.meta.env[`VITE_WORKSPACE${number}_NAME`] || `Workspace ${number}`,
        token: import.meta.env[`VITE_WORKSPACE${number}_TOKEN`],
      };
    });
  }

  const organizations = getTokens();

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
      id
      name
      color
      members(filter: {
        isMe: { eq: true }
      }) {
        nodes { id }
      }
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
    <div className="flex flex-col gap-10 p-10">
      {Object.entries(data).map(([name, organization]) => (
        <div key={name} className="w-full overflow-auto">
          <h2 className="text-4xl font-semibold text-slate-700 mb-2">{name}</h2>
          {organization.teamsLoading && <p>Loading teams...</p>}
          {!organization.teamsLoading && (
            <div className="flex gap-8">
              {Object.values(organization.teams).map(team => (
                <div key={team.id} className="w-64 flex-shrink-0 border rounded">
                  <div className="flex items-center gap-1">
                    <div className="size-4 rounded-full flex-shrink-0" style={{backgroundColor: team.color}}></div>
                    {team.name}
                  </div>
                </div>
              ))}
            </div> 
          )}
        </div>
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;