import { useContext } from "react";
import { DataContext, StatesContext } from "../contexts";
import { formatDate } from "../utils";
import ProjectLink from "../components/ProjectLink";
import StateIndicator from "../components/StateIndicator";
import Labels from "../components/Labels";

const DuePage = () => {

  const [data] = useContext(DataContext);
  const [states] = useContext(StatesContext);

  const loading = Object.values(data).some(organization => organization.issuesLoading);

  let issues = [];

  for (const organization of Object.values(data)) {
    for (const issue of Object.values(organization.issues)) {
      const annotatedIssue = {...issue};
      if (annotatedIssue.milestoneDueDate && !annotatedIssue.dueDate) {
        annotatedIssue.dueDate = annotatedIssue.milestoneDueDate;
      }
      if (annotatedIssue.projectDueDate && !annotatedIssue.dueDate) {
        annotatedIssue.dueDate = annotatedIssue.projectDueDate;
      }
      annotatedIssue.organization = organization;
      issues.push(annotatedIssue);
    }
  }

  // Get parent task due dates
  for (const issue of issues) {
    if (!issue.dueDate && issue.parent) {
      let parentWithDueDate = issues.find(i => i.id === issue.parent.id);
      while (parentWithDueDate && !parentWithDueDate.dueDate) {
        parentWithDueDate = issues.find(i => i.id === parentWithDueDate.parent?.id);
      }
      if (parentWithDueDate && parentWithDueDate.dueDate && !parentWithDueDate.assignee?.isMe) {
        issue.dueDate = parentWithDueDate.dueDate;
      }
    }
  }

  const issuesById = {};
  for (const issue of issues) {
    issuesById[issue.id] = issue;
  }

  issues = issues.filter(issue => issue.assignee?.isMe && issue.dueDate && states.includes(issue.state.type));

  const parentTitles = (issues, issue) => {
    if (issue.title === "Verify final changes locally") {
      console.log(issue);
      console.log(issues);
    }
    const titles = [];
    let parent = issue.parent;
    while (parent) {
      const parentIssue = issues[parent.id];
      if (!parentIssue) break;
      titles.unshift(parentIssue.title);
      parent = parentIssue.parent;
    }
    return titles;
  };

  issues.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  
  const dates = {};
  for (const issue of issues) {
    if (!dates[issue.dueDate]) {
      dates[issue.dueDate] = [];
    }
    dates[issue.dueDate].push(issue);
  }

  if (loading) {
    return (
      <main className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-400"></div>
      </main>
    )
  }

  return (
    <main className="mx-10 px-3 pb-8">
      <div className="flex flex-col gap-12 text-slate-100 max-w-4xl">
        {Object.entries(dates).map(([date, issues]) => (
          <div key={date}>
            <div className="text-2xl font-medium border-b-3 border-slate-500 pb-1">{formatDate(date)}</div>
            <div className="flex flex-col mt-2">
              {issues.map(issue => (
                <div key={issue.id} className="border-l-4 pl-2 py-1" style={{borderColor: issue.organization.color}}>
                  {parentTitles(issuesById, issue).length > 0 && (
                    <div className="text-2xs text-slate-400 ml-5 pl-0.5 -mb-1.5 -mt-1">{parentTitles(issuesById, issue).join(" / ")}</div>
                  )}
                  <div className="flex gap-2 items-center">
                    <StateIndicator issue={issue} stateIds={Object.values(issue.organization.teams).find(team => team.key === issue.identifier.split("-")[0])?.stateIds} />
                    <a
                      className="-ml-0.5 text-slate-200"
                      href={`https://linear.app/${issue.organization.urlKey}/issue/${issue.identifier}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {issue.title}
                    </a>
                    {issue.project && <ProjectLink issue={issue} organizationKey={issue.organization.urlKey} />}
                    {issue.labels.length > 0 && <Labels issue={issue} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

DuePage.propTypes = {
  
};

export default DuePage;