import { useEffect, useState } from "react";
import Organization from "./components/Organization";
import { loadTokens } from "./tokens";

const App = () => {

  const organizations = loadTokens();

  const [data, setData] = useState(organizations.reduce((acc, organization) => {
    acc[organization.name] = {
      projectsLoading: true,
      teamsLoading: true,
      issuesLoading: true,
      projects: {},
      teams: {},
      issues: {},
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

  const ISSUES = `query issues($after: String) {
    issues(first: 100 after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        dueDate
        assignee { isMe }
        team { id }
        parent { id }
        state { name type }
      }
    }
  }`

  useEffect(() => {
    const f = async () => {
      for (const organization of organizations) {
        // Get teams
        let resp = await fetch("https://api.linear.app/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": organization.token
          },
          body: JSON.stringify({query: TEAMS, variables: {}})
        });
        let json = await resp.json();

        // Update teams in state
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

        // Get issues
        let remainingIssues = true;
        const issues = {};
        let after = null;
        while (remainingIssues) {
          resp = await fetch("https://api.linear.app/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": organization.token
            },
            body: JSON.stringify({query: ISSUES, variables: {after}})
          });
          json = await resp.json();
          for (const issue of json.data.issues.nodes) {
            issues[issue.id] = issue;
          }
          after = json.data.issues.pageInfo.endCursor;
          remainingIssues = json.data.issues.pageInfo.hasNextPage;
        }
        setData(prev => {
          const currentOrgState = prev[organization.name];
          currentOrgState.issuesLoading = false;
          currentOrgState.issues = issues;
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
    <div className="flex flex-col gap-10 py-8 bg-slate-700 text-white min-h-svh">
      {Object.entries(data).map(([name, organization]) => (
        <Organization key={name} name={name} organization={organization} />
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;