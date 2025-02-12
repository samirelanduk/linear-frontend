export const TEAMS = `{
  teams(first: 50) {
    nodes {
      id name color key
      states { nodes { id name type } }
      members(filter: { isMe: { eq: true } }) { nodes { id } }
      issues(filter: {
        state: {type: {in: ["started", "unstarted"]}}
        or: [
          {assignee: {isMe: {eq: true}}}
          {parent: {assignee: {isMe: {eq: true}}}}
          {parent: {parent: {assignee: {isMe: {eq: true}}}}}
        ]
      }) { nodes { id } }
    }
  }
  organization { urlKey }
  notifications(first: 20) { nodes { type readAt } }
}`;


export const PROJECTS = `{
  projects(first: 50) {
    nodes {
      id slugId name startDate targetDate sortOrder
      projectMilestones { nodes { id name targetDate sortOrder } }
    }
  }
}`;


export const ISSUES = `query issues($after: String) {
  issues(first: 100 after: $after filter: {
    state: {type: {in: ["backlog", "started", "unstarted"]}}
  }) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      title
      createdAt
      identifier
      dueDate
      sortOrder
      subIssueSortOrder
      assignee { isMe }
      team { id }
      parent { id }
      state { name type }
      project { id }
      projectMilestone { id }
      labels { nodes { id name color } }
    }
  }
}`;

export const UPDATE_ISSUE_STATE = `mutation updateState($issueId: String!, $stateId: String!) {
  issueUpdate(
    input: { stateId: $stateId },
    id: $issueId
  ) {
    issue { state { type } }
  }
}`;