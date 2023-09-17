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
    nodes {
      id title state { name } parent { id } team { id } identifier
      sortOrder subIssueSortOrder
    }
  }
  teams { nodes { id name color } }
  projects(first: 20 filter: {
    state: {in: ["started"]}
  }) {
    nodes {
      id name startDate
      projectMilestones { nodes { id name targetDate sortOrder } }
      issues(filter: {
        state: { name: { in: ["Todo", "In Progress", "Held", "Up Next"]}}
        or: [
            { assignee: { isMe: { eq: true } } }
            { parent: { assignee: { isMe: { eq: true } } } }
        ]
      }) {
        nodes {
          id title state { name } parent { id } team { id } identifier
          sortOrder subIssueSortOrder projectMilestone { id }
        }
      }
    }
  }
}`

export const useData = () => {
  const [data, setData] = useState({});
  const fetchData = async () => {
    const newData = {}
    for (let token of TOKENS) {
      fetch("https://api.linear.app/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token.token
        },
        body: JSON.stringify({query: QUERY})
      }).then(res => res.json()).then(d => {
        newData[token.name] = {
          organization: d.data.organization.urlKey,
          issues: d.data.issues.nodes,
          projects: d.data.projects.nodes,
          teams: d.data.teams.nodes
        };
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
      });
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return data;
}