import type { FC } from "react"
import { useParams } from "react-router-dom"

const BlogPost: FC = () => {
  const { id } = useParams()
  return <div>Blog post placeholder for entry {id}</div>
}

export default BlogPost
