import { useState, useEffect } from "react";
import TOKENS from "./tokens";

const QUERY = `{
  organization { urlKey }
  issues(first: 250 filter: {
    state: { name: { in: ["Todo", "In Progress", "Held", "Up Next"]}}
    project: { null: true }
    or: [
        { assignee: { isMe: { eq: true } } }
        { parent: { assignee: { isMe: { eq: true } } } }
      ]
  }) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id title state { name } parent { id } team { id } identifier
      sortOrder subIssueSortOrder
    }
  }
  teams { nodes { id name color } }
  projects(first: 25) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id name startDate
      projectMilestones { nodes { id name targetDate sortOrder } }
      issues(first: 30 filter: {
        or: [
            { assignee: { isMe: { eq: true } } }
            { parent: { assignee: { isMe: { eq: true } } } }
        ]
      }) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id title state { name } parent { id } team { id } identifier
          sortOrder subIssueSortOrder projectMilestone { id }
        }
      }
    }
  }
}`

const ISSUES = `query issues($after: String){
  issues(first: 50 after: $after filter: {
    state: { name: { in: ["Todo", "In Progress", "Held", "Up Next"]}}
    project: { null: true }
    or: [
        { assignee: { isMe: { eq: true } } }
        { parent: { assignee: { isMe: { eq: true } } } }
      ]
  }) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id title state { name } parent { id } team { id } identifier
      sortOrder subIssueSortOrder
    }
  }
}`

const PROJECTS = `query issues($after: String) {
  projects(first: 20 after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id name startDate
      projectMilestones { nodes { id name targetDate sortOrder } }
      issues(first: 50 filter: {
        or: [
            { assignee: { isMe: { eq: true } } }
            { parent: { assignee: { isMe: { eq: true } } } }
        ]
      }) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id title state { name } parent { id } team { id } identifier
          sortOrder subIssueSortOrder projectMilestone { id }
        }
      }
    }
  }
}`;

const PROJECT_ISSUES = `query issues($after: String, $project: String!) {
  project(id: $project) {
    issues(first: 250 after: $after filter: {
      or: [
        { assignee: { isMe: { eq: true } } }
        { parent: { assignee: { isMe: { eq: true } } } }
    ]
  }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id title state { name } parent { id } team { id } identifier
        sortOrder subIssueSortOrder projectMilestone { id }
      }
    }
  }
}`;

const query = (token, query, variables) => {
  return fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({query, variables})
  });
}

export const useData = () => {
  const [data, setData] = useState({});
  const fetchData = async () => {
    const newData = {}
    for (let token of TOKENS) {
      // Keep track of which projects need more issues fetching
      const projectsMissingIssues = [];

      // Get base data
      const initialData = await query(token.token, QUERY).then(res => res.json());
      newData[token.name] = {
        organization: initialData.data.organization.urlKey,
        issues: initialData.data.issues.nodes,
        projects: initialData.data.projects.nodes,
        teams: initialData.data.teams.nodes
      };

      // Do any projects need more issues?
      for (const project of newData[token.name].projects) {
        if (project.issues.pageInfo.hasNextPage) {
          projectsMissingIssues.push(project);
        }
      }

      // While there are more issues, get them
      let hasMoreIssues = initialData.data.issues.pageInfo.hasNextPage;
      while (hasMoreIssues) {
        const allIssues = newData[token.name].issues;
        const issues = await query(token.token, ISSUES, {
          after: allIssues.length === 0 ? null : allIssues[allIssues.length - 1]["id"]
        }).then(res => res.json());
        newData[token.name].issues.push(...issues.data.issues.nodes);
        hasMoreIssues = issues.data.issues.pageInfo.hasNextPage;
      }

      // While there are more projects, get them
      let hasMoreProjects = initialData.data.projects.pageInfo.hasNextPage;
      while (hasMoreProjects) {
        const allProjects = newData[token.name].projects;
        const projects = await query(token.token, PROJECTS, {
          after: allProjects.length === 0 ? null : allProjects[allProjects.length - 1]["id"]
        }).then(res => res.json());
        newData[token.name].projects.push(...projects.data.projects.nodes);
        hasMoreProjects = projects.data.projects.pageInfo.hasNextPage;
        for (const project of projects.data.projects.nodes) {
          if (project.issues.pageInfo.hasNextPage) {
            projectsMissingIssues.push(project);
          }
        }
      }
      
      // For each project missing issues, get its additional issues
      for (const project of projectsMissingIssues) {
        let hasMoreIssues = project.issues.pageInfo.hasNextPage;
        while (hasMoreIssues) {
          const allIssues = project.issues.nodes;
          const issues = await query(token.token, PROJECT_ISSUES, {
            after: allIssues.length === 0 ? null : allIssues[allIssues.length - 1]["id"],
            project: project.id
          }).then(res => res.json());
          project.issues.nodes.push(...issues.data.project.issues.nodes);
          hasMoreIssues = issues.data.project.issues.pageInfo.hasNextPage;
        }
      }

      // Assign children
      for (const project of newData[token.name].projects) {
        project.issues = project.issues.nodes;
      }
      if (Object.keys(newData).length === TOKENS.length) {
        const orderedData = {};
        for (let token of TOKENS) {
          orderedData[token.name] = newData[token.name];
        }
        setData(orderedData);
      }
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return data;
}