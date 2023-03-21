import {discussionGql, discussionDetailGql} from './gql'
import {BlogPost, BlogDetail} from './../types/blog'

const API_URL: string = 'https://api.github.com/graphql'
const ACCESS_TOKEN_GITHUB = process.env.ACCESS_TOKEN_GITHUB
const DISCUSSION_GQL_CATEGORY_ID = process.env.DISCUSSION_GQL_CATEGORY_ID

export async function getBlogs(): Promise<BlogPost[]> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `token ${ACCESS_TOKEN_GITHUB}`,
      'Content-Type': 'application',
    },
    body: JSON.stringify({query: discussionGql(DISCUSSION_GQL_CATEGORY_ID)}),
  })

  let res = await response.json()
  const discussions = res.data.repository.discussions.nodes
  const posts = discussions.map((discussion: any): BlogPost => {
    const {
      title,
      author,
      lastEditedAt: lastEditedAt,
      createdAt,
      number: id,
      bodyHTML: html,
      bodyText,
      labels,
      url: discussionUrl,
    } = discussion
    const url = `/blog/${id}`
    const authorUrl = author.url
    const authorName = author.login
    const authorAvatar = author.avatarUrl
    const tags: string[] = labels.nodes.map((tag: {name: string}) => {
      return tag.name
    })

    const post = {
      id,
      url,
      discussionUrl,
      title,
      html,
      bodyText,
      tags,
      createdAt,
      lastEditedAt,
      author: {url: authorUrl, name: authorName, avatar: authorAvatar},
    }

    return post
  })
  return posts
}

export async function getBlogDetail(blogId: number): Promise<BlogDetail> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `token ${ACCESS_TOKEN_GITHUB}`,
      'Content-Type': 'application',
    },
    body: JSON.stringify({query: discussionDetailGql(blogId)}),
  })

  let res = await response.json()
  const discussion = res.data.repository.discussion

  const {title, author, createdAt, bodyHTML} = discussion
  const authorUrl = author.url
  const authorName = author.login
  const authorAvatar = author.avatarUrl

  const detail: BlogDetail = {
    title,
    createdAt,
    bodyHTML,
    author: {url: authorUrl, name: authorName, avatar: authorAvatar},
  }
  return detail
}
