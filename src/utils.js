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

export const dayDiff = (date1, date2) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);
  const diff = dt2.getTime() - dt1.getTime();
  return diff / (1000 * 60 * 60 * 24);
}