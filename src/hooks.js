import { useState, useEffect } from "react";
import TOKENS from "./tokens";

const QUERY = `{
  teamMemberships {
    nodes {
      sortOrder
      user { isMe }
      team { id name }
    }
  }
  issues(
    first: 250
    filter: {
      state: { name: { neq: "Done" } }
      or: [
        { assignee: { isMe: { eq: true } } }
        { parent: { assignee: { isMe: { eq: true } } } }
        
      ]
    }
  ) {
    nodes {
      id
      title
      parent { id }
      project { name }
      team { id name }
      state { name type }
    }
  }
}`;

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
        newData[token.name] = d.data.issues.nodes;
        const memberships = d.data.teamMemberships.nodes.filter(n => n.user.isMe);
        memberships.sort((a, b) => a.sortOrder - b.sortOrder);
        for (let m = 0; m < memberships.length; m++) {
          const membership = memberships[m];
          for (let issue of d.data.issues.nodes) {
            if (issue.team.id === membership.team.id) {
              issue.team.order = m;
            }
          }
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
  useEffect(fetchData, []);
  return data;
}