"use client"
import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="flex items-start gap-4 flex-wrap my-16 w-full">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          {...{ post, handleTagClick }}
        />
      ))}
    </div>
  )
}

const Feed = () => {

  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [postCount, setPostsCount] = useState(0);
  const [timeoutId, settTimeoutId] = useState(null);
  const [debounceSearch, setDebounceSearch] = useState("")
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const onSearchChange = (value, time = 2000) => {
    setSearch(value);
    clearTimeout(timeoutId)
    const id = setTimeout(async () => {
      setDebounceSearch(value)
    }, time);
    settTimeoutId(id)
  }

  const fetchPosts = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/prompt?query=${query}&page=${page}`);
      const data = await response.json()
      if (page === 1) { setPosts(data?.prompts || []) }
      else { setPosts(prev => [...prev, ...data?.prompts?.filter(prompt => !prev.find(post => post?._id === prompt?._id))]) }
      setPostsCount(data?.count)

    } catch (error) {
      console.log({ error });
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(debounceSearch, page)
  }, [debounceSearch, page])

  return (
    <section className="feed">
      <form className="relaive w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or content"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={(val) => val?.[0] === "#" ? onSearchChange(val?.slice(1), 0) : onSearchChange(val, 0)}
      />

      {postCount > posts.length &&
        <div>
          <button
            className="text-sm font-medium text-blue-600 border border-blue-600 rounded-full px-4 py-2 mb-4"
            onClick={() => { setPage(prev => prev + 1) }}
            disabled={loading}
          >{loading && posts.length > 0 ? "Loading..." : "Show More"}  </button>
        </div>
      }

    </section>
  )
}

export default Feed