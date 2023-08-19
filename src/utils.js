export const assignChildren = issues => {
  const issuesById = issues.reduce((acc, issue) => {
    acc[issue.id] = {...issue, children: []};
    return acc;
  }, {});
  for (const issue of Object.values(issues)) {
    if (issue.parent !== null) {
      issuesById[issue.parent.id]?.children.push(issue);
    }
  }
  for (let issue of Object.values(issuesById)) {
    if (issue.parent !== null) {
      delete issuesById[issue.id];
    }
  }
  return [...Object.values(issuesById)];
}