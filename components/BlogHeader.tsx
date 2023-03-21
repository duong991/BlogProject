/* eslint-disable @next/next/no-img-element */
import React from 'react'

interface headerProps {
  createdAt: string
  author: {
    name: string
    avatar: string
    url: string
  }
}

const BlogHeader: React.FC<headerProps> = (props) => {
  const {createdAt, author} = props
  const createdDate: Date = new Date(createdAt)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return (
    <div className="flex">
      <img
        src={author.avatar}
        alt="avatar"
        className="rounded-[50%] mb-4 mr-4"
        width={40}
        height={40}
      />
      <div className="flex flex-col">
        <p className="font-semibold text-[1.25rem]">{author.name}</p>
        <div className="flex gap-4">
          <li className="list-none">{author.url}</li>
          <li className="ml-2 text-[0.85rem] ">
            {createdDate.toLocaleDateString('en-US', options)}
          </li>
        </div>
      </div>
    </div>
  )
}

export default BlogHeader
