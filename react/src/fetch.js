import { TEAMS, PROJECTS, ISSUES } from "./queries";

const fetchLinear = async (organization, query, variables) => {
  /**
   * Fetches data from the Linear API using the provided query and variables.
   */

  return fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": organization.token
    },
    body: JSON.stringify({query, variables})
  }).then(resp => resp.json());
}


export const initializeData = async (setData) => {
  /**
   * Gets the organizations and their tokens from the backend, and initializes
   * the global state with the organizations and their initial state.
   */

  const resp = await fetch("http://localhost:8023/tokens");
  const json = await resp.json();
  setData(json.reduce((acc, organization) => {
    acc[organization.name] = {
      name: organization.name,
      token: organization.token,
      color: organization.color,
      urlKey: "",
      projectsLoading: true,
      teamsLoading: true,
      issuesLoading: true,
      notifications: [],
      projects: {},
      teams: {},
      issues: {},
    };
    return acc;
  }, {}))
  return json;
}


export const getOrganization = async (organization, setData) => {
  /**
   * Gets all the data for an organization and updates the global state with
   * the organization's teams, projects, and issues.
   */
  
  await getTeamsForOrganization(organization, setData);
  await getProjectsForOrganization(organization, setData);
  await getIssuesForOrganization(organization, setData);
}


const getTeamsForOrganization = async (organization, setData) => {
  /**
   * Gets all the teams for an organization and updates the organization in
   * the global state - specifically it's teams object and its teamsLoading
   * boolean.
   */

  const json = await fetchLinear(organization, TEAMS);
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
    currentOrgState.notifications = json.data.notifications.nodes;
    currentOrgState.urlKey = json.data.organization.urlKey;
    return {...prev, [organization.name]: currentOrgState};
  });
}


const getProjectsForOrganization = async (organization, setData) => {
  /**
   * Gets all the projects for an organization and updates the organization in
   * the global state - specifically it's projects object and its
   * projectsLoading boolean.
   */

  const json = await fetchLinear(organization, PROJECTS);
  setData(prev => {
    const currentOrgState = prev[organization.name];
    currentOrgState.projectsLoading = false;
    currentOrgState.projects = json.data.projects.nodes.reduce((acc, project) => {
      acc[project.id] = {...project, milestones: project.projectMilestones.nodes};
      delete acc[project.id].projectMilestones;
      return acc;
    }, {});
    return {...prev, [organization.name]: currentOrgState};
  });
}


const getIssuesForOrganization = async (organization, setData) => {
  /**
   * Gets all the issues for an organization and updates the organization in
   * the global state - specifically it's issues object and its issuesLoading
   * boolean.
   */

  let remainingIssues = true;
  let after = null;
  const issues = {};
  while (remainingIssues) {
    const json = await fetchLinear(organization, ISSUES, {after});
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
    return {...prev, [organization.name]: currentOrgState};
  });
}