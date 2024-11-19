import { useEffect, useState } from "react";
import Organization from "./components/Organization";
import StatesToggle from "./components/StatesToggle";
import { ClipLoader } from "react-spinners";
import colors from "tailwindcss/colors";

const App = () => {

  const [data, setData] = useState(null);

  const [states, setStates] = useState(["unstarted", "started"]);

  const TEAMS = `{
    teams(first: 50) {
      nodes {
        id name color
        members(filter: { isMe: { eq: true } }) { nodes { id } }
        issues(filter: {
          state: {type: {in: ["started", "unstarted"]}}
          or: [
            {assignee: {isMe: {eq: true}}}
            {parent: {assignee: {isMe: {eq: true}}}}
            {parent: {parent: {assignee: {isMe: {eq: true}}}}}
          ]
        }) { nodes { id } }
      }
    }
  }`;

  const PROJECTS = `{
    projects(first: 50) {
      nodes {
        id name startDate targetDate sortOrder
        projectMilestones { nodes { id name targetDate sortOrder } }
      }
    }
  }`;

  const ISSUES = `query issues($after: String) {
    issues(first: 100 after: $after filter: {
      state: {type: {in: ["backlog", "started", "unstarted"]}}
    }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        createdAt
        dueDate
        sortOrder
        subIssueSortOrder
        assignee { isMe }
        team { id }
        parent { id }
        state { name type }
        project { id }
        projectMilestone { id }
        labels { nodes { id name color } }
      }
    }
  }`

  useEffect(() => {
    const f = async () => {
      let resp = await fetch("http://localhost:8023/tokens");
      let json = await resp.json();
      setData(json.reduce((acc, organization) => {
        acc[organization.name] = {
          projectsLoading: true,
          teamsLoading: true,
          issuesLoading: true,
          projects: {},
          teams: {},
          issues: {},
        };
        return acc;
      }, {}))

      for (const organization of json) {
        // Get teams
        resp = await fetch("https://api.linear.app/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": organization.token
          },
          body: JSON.stringify({query: TEAMS, variables: {}})
        });
        json = await resp.json();

        // Update teams in state
        setData(prev => {
          const currentOrgState = prev[organization.name];
          currentOrgState.teamsLoading = false;
          currentOrgState.teams = json.data.teams.nodes.reduce((acc, team) => {
            if (team.members.nodes.length === 0) return acc;
            if (team.issues.nodes.length === 0) return acc;
            delete team.members
            team.issueCount = team.issues.nodes.length;
            delete team.issues;
            acc[team.id] = team;
            return acc;
          }, {});
          return {
            ...prev,
            [organization.name]: currentOrgState
          };
        });

        // Get projects
        resp = await fetch("https://api.linear.app/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": organization.token
          },
          body: JSON.stringify({query: PROJECTS, variables: {}})
        });
        json = await resp.json();

        // Update projects in state
        setData(prev => {
          const currentOrgState = prev[organization.name];
          currentOrgState.projectsLoading = false;
          currentOrgState.projects = json.data.projects.nodes.reduce((acc, project) => {
            acc[project.id] = {...project, milestones: project.projectMilestones.nodes};
            delete acc[project.id].projectMilestones;
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
            issue.labels = issue.labels.nodes;
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

  if (!data) {
    return (
      <div className="flex justify-center items-center bg-slate-700 text-white min-h-svh">
        <ClipLoader color={colors.slate[400]} size={200} cssOverride={{"borderWidth": "20px"}} speedMultiplier={1.25} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 py-8 bg-slate-700 text-white min-h-svh">
      <StatesToggle states={states} setStates={setStates} className="fixed right-10" />
      {Object.entries(data).map(([name, organization]) => (
        <Organization key={name} name={name} organization={organization} states={states} />
      ))}
    </div>
  );
};

App.propTypes = {
  
};

export default App;