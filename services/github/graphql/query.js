import { gql } from '@apollo/client';

export const GET_LEAN_ISSUES_BY_ID = gql`
  query ($issueIds: [ID!]!) {
    nodes(ids: $issueIds) {
      ... on Issue {
        title
        url
        closed
        id
      }
    }
  }
`;

export const GET_ISSUE = gql`
  query GetIssue($issueUrl: URI!) {
    resource(url: $issueUrl) {
      ... on Issue {
        closed
        id
        titleHTML
        bodyHTML
        repository {
          name
          owner {
            id
            login
          }
        }
        author {
          login
        }
        createdAt
        title
        body
      }
    }
  }
`;

export const GET_ORG_BY_ID = gql`
  query GetOrg($orgId: ID!) {
    node(id: $orgId) {
      __typename
      ... on Organization {
        name
        login
        id
        avatarUrl
      }
    }
  }
`;

export const GET_ORGS_OR_USERS_BY_IDS = gql`
  query GetOrgs($ids: [ID!]!) {
    nodes(ids: $ids) {
      __typename
      ... on Organization {
        name
        login
        id
        url
        description
        descriptionHTML
      }
      ... on User {
        name
        login
        bio
        id
        url
      }
    }
  }
`;

export const GET_ORGS_BY_IDS = gql`
  query GetOrgs($orgIds: [ID!]!) {
    nodes(ids: $orgIds) {
      __typename
      ... on Organization {
        name
        login
        description
        id
        avatarUrl
        url
      }
      ... on User {
        name
        login
        bio
        id
        avatarUrl
        url
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUser($userId: ID!) {
    node(id: $userId) {
      __typename
      ... on User {
        name
        login
        bio
        id
        url
        avatarUrl
      }
    }
  }
`;

export const GET_USERS_BY_IDS = gql`
  query GetUsers($userIds: [ID!]!) {
    nodes(ids: $userIds) {
      __typename
      ... on User {
        name
        login
        bio
        id
        url
        avatarUrl
      }
    }
  }
`;

export const GET_ORG_BY_NAME = gql`
  query GetOrg($login: String!) {
    organization(login: $login) {
      __typename
      name
      login
      id
      createdAt
      description
      email
      websiteUrl
      avatarUrl
      isVerified
      descriptionHTML
      location
      twitterUsername
      url
      membersWithRole(first: 100) {
        nodes {
          avatarUrl
          name
          login
          url
        }
      }
    }
  }
`;

export const GET_USER_BY_NAME = gql`
  query GetUser($login: String!) {
    user(login: $login) {
      __typename
      login
      id
      createdAt
      websiteUrl
      bio
      avatarUrl
      twitterUsername
      url
    }
  }
`;

export const GET_ORGS_BY_ISSUES = gql`
  query ($issueIds: [ID!]!) {
    nodes(ids: $issueIds) {
      ... on Issue {
        repository {
          owner {
            url
            avatarUrl
            login
            descriptionHTML
            description
          }
        }
      }
    }
  }
`;

export const GET_ISSUE_BY_ID = gql`
  query ($issueId: ID!) {
    node(id: $issueId) {
      ... on Issue {
        closed
        closedAt
        title
        body
        number
        url
        id
        titleHTML
        bodyHTML
        labels(first: 10) {
          edges {
            node {
              name
              color
            }
          }
        }
        createdAt
        assignees(first: 1) {
          nodes {
            name
            login
            url
            avatarUrl
          }
        }
        repository {
          id
          name
          owner {
            login
            avatarUrl
            ... on Organization {
              twitterUsername
            }
          }
        }

        timelineItems(first: 100, itemTypes: [CROSS_REFERENCED_EVENT, CLOSED_EVENT]) {
          nodes {
            ... on CrossReferencedEvent {
              referencedAt

              source {
                ... on PullRequest {
                  mergedAt
                  url
                  merged
                  title
                  author {
                    login
                    avatarUrl
                    url
                  }
                  mergeCommit {
                    author {
                      avatarUrl
                      name
                      user {
                        login
                        url
                      }
                    }
                  }
                }
              }
            }
            ... on ClosedEvent {
              id
              actor {
                avatarUrl
                login
                url
                ... on Organization {
                  name
                }
                ... on EnterpriseUserAccount {
                  name
                }
                ... on User {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRS_BY_ISSUES = gql`
  query getPrs($bountyIds: [ID!]!) {
    nodes(ids: $bountyIds) {
      id
      ... on Issue {
        id
        timelineItems(first: 100) {
          edges {
            node {
              ... on CrossReferencedEvent {
                id
                source {
                  ... on PullRequest {
                    id
                    bodyText
                    title
                    url
                    repository {
                      owner {
                        avatarUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PR_BY_ID = gql`
  query getPr($id: ID!) {
    node(id: $id) {
      ... on PullRequest {
        id
        bodyHTML
        url
        title
        author {
          login
          avatarUrl
          url
          ... on User {
            id
            twitterUsername
            bio
          }
        }
      }
    }
  }
`;

export const GET_USER_BY_URL = gql`
  query ($url: URI!) {
    resource(url: $url) {
      ... on User {
        id
        email
        twitterUsername
        bio
        avatarUrl
        login
      }
    }
  }
`;

export const GET_ISSUES_BY_ID = gql`
  query ($issueIds: [ID!]!) {
    nodes(ids: $issueIds) {
      ... on Issue {
        closed
        title
        body
        url
        id
        number
        titleHTML
        bodyHTML
        timelineItems(first: 100, itemTypes: CROSS_REFERENCED_EVENT) {
          edges {
            node {
              ... on CrossReferencedEvent {
                source {
                  ... on PullRequest {
                    url
                    merged
                    title
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
        assignees(first: 1) {
          nodes {
            name
            login
            url
            avatarUrl
          }
        }
        labels(first: 10) {
          edges {
            node {
              name
              color
            }
          }
        }
        createdAt
        repository {
          id
          url
          description
          name
          languages(first: 10) {
            edges {
              node {
                name
                color
              }
            }
          }
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;
