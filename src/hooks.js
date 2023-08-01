import { useState, useEffect } from "react";
import TOKENS from "./tokens";

const QUERY = `{
  issues {
    nodes {
      title
      project { name }
      team { name }
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
        if (Object.keys(newData).length === TOKENS.length) {
          setData(newData);
        }
      });
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return data;
}