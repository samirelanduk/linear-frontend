import { useState, useEffect } from "react";
import TOKENS from "./tokens";

const QUERY = `{
  organization { urlKey }
  issues(first: 100 filter: {
    state: { name: { in: ["Todo", "In Progress", "Held"]}}
    project: { null: true }
    or: [
        { assignee: { isMe: { eq: true } } }
        { parent: { assignee: { isMe: { eq: true } } } }
      ]
  }) {
    nodes {
      id title state { name } parent { id } team { id } identifier
    }
  }
  teams { nodes { id name color } }
  projects(first: 40 filter: {
    state: {in: ["started"]}
  }) {
    nodes {
      id name
      issues(filter: {
        state: { name: { in: ["Todo", "In Progress"]}}
        or: [
            { assignee: { isMe: { eq: true } } }
            { parent: { assignee: { isMe: { eq: true } } } }
        ]
      }) {
        nodes {
          id title state { name } parent { id } team { id } identifier
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