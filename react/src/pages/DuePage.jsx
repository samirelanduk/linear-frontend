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

  const projectsById = {};
  const milestonesById = {};
  const issues = [];

  for (const organization of Object.values(data)) {
    for (const project of Object.values(organization.projects)) {
      projectsById[project.id] = project;
      for (const milestone of project.milestones) {
        milestonesById[milestone.id] = milestone;
      }
    }
    for (const issue of Object.values(organization.issues)) {
      const annotatedIssue = {...issue};
      let project; let milestone;
      if (issue.project?.id) project = projectsById[issue.project.id];
      if (issue.projectMilestone?.id) milestone = milestonesById[issue.projectMilestone.id];
      if (milestone && milestone.targetDate && !annotatedIssue.dueDate) {
        annotatedIssue.dueDate = milestone.targetDate;
      }
      if (project && project.targetDate && !annotatedIssue.dueDate) {
        annotatedIssue.dueDate = project.targetDate;
      }
      annotatedIssue.organization = organization;
      if (annotatedIssue.dueDate && annotatedIssue.assignee?.isMe && states.includes(annotatedIssue.state.type)) {
        issues.push(annotatedIssue);
      }
    }
  }

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
                <div key={issue.id} className="flex gap-2 items-center border-l-4 pl-2 py-1" style={{borderColor: issue.organization.color}}>
                  <StateIndicator issue={issue} />
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