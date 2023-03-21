export function discussionGql(categoryId: string | undefined) {
  return `{
        repository(name: "BlogProject", owner: "duong991") {
          discussions(first: 100, categoryId: "${categoryId}") {
            nodes {
              url
              title
              number
              bodyHTML
              bodyText
              createdAt
              lastEditedAt
              author {
                login
                url
                avatarUrl
              }
              labels(first: 100) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }`
}

export function discussionDetailGql(postId: number | undefined) {
  return `{
    repository(name: "BlogProject", owner: "duong991") {
      discussion(number: ${postId}) {
        title
        bodyHTML
        createdAt
        author {
          login
          avatarUrl
          url
        }
      }
    }
  }`
}
