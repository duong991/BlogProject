import {GetServerSideProps, NextPage, InferGetServerSidePropsType} from 'next'
import {useState, useMemo} from 'react'
import {getBlogs} from '@/server/blogs'
import {BlogPost} from './../types/blog'
import BlogPreview from './../components/BlogPreview'
const Home: NextPage = ({
  blogData,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [filterWord, setFilterWord] = useState<string[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number[]>([])
  const filteredBog: BlogPost[] = useMemo(() => {
    return filterWord.length > 0
      ? blogData.filter((blog: BlogPost) => {
          return filterWord.every((filter) => blog.tags.includes(filter))
        })
      : blogData
  }, [filterWord, blogData])
  const filterLabel = (tag: any, index: number) => {
    if (selectedIdx.includes(index)) {
      setSelectedIdx(selectedIdx.filter((id) => id !== index))
      setFilterWord(filterWord.filter((filter) => filter !== tag.innerHTML))
    } else {
      setSelectedIdx([...selectedIdx, index])
      setFilterWord([...filterWord, tag.innerHTML])
    }
  }

  let tagsRender = [...tags, '2022', 'Youtube', 'Facebook']

  return (
    <main className="layout">
      <title className="">Home Page</title>
      <section>
        <div className="mt-3 text-center">
          <h1 className="text-[3rem]">Welcome to DevBlog</h1>
          <p>
            A Full-stack blog made with Next.js, TailWindCSS, Github GraphQL
          </p>
        </div>
      </section>
      <section className="flex flex-col items-center mt-12 text-[1.15rem]">
        <div className="flex gap-3 mb-12">
          {tagsRender.map((tag: string, index: number) => {
            return (
              <button
                key={index}
                className={
                  selectedIdx.includes(index) ? 'label-selected' : 'label'
                }
                onClick={(e) => filterLabel(e.target, index)}
              >
                {tag}
              </button>
            )
          })}
        </div>

        {filteredBog.map((blog: BlogPost) => {
          return (
            <div
              key={blog.id}
              className="max-w-[32rem] max-h-[20rem] overflow-hidden mx-6 mv-6 bg-neutral-300 text-zinc-800 rounded-lg p-4 hover:bg-neutral-500 hover:text-neutral-300 cursor-pointer transition-all duration-300 mb-6"
            >
              <a href={blog.url} target="_blank" rel="noreferrer">
                <BlogPreview
                  title={blog.title}
                  bodyText={blog.bodyText}
                  tags={blog.tags}
                  author={blog.author}
                  createdAt={blog.createdAt}
                />
              </a>
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  let blogs: BlogPost[] = await getBlogs()
  let tags: string[] = []

  for (const blog of blogs) {
    for (const tag of blog.tags) {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }
  return {
    props: {
      blogData: blogs,
      tags: tags,
    },
  }
}
