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
  const [timeoutId, settTimeoutId] = useState(null);
  const [debounceSearch, setDebounceSearch] = useState("")

  const onSearchChange = (value, time = 2000) => {
    setSearch(value);
    clearTimeout(timeoutId)
    const id = setTimeout(async () => {
      setDebounceSearch(value)
    }, time);
    settTimeoutId(id)
  }

  const fetchPosts = async (query = "") => {
    const response = await fetch(`/api/prompt?query=${query}`);
    const data = await response.json()
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts(debounceSearch)
  }, [debounceSearch])

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
        handleTagClick={(val) => onSearchChange(val, 0)}
      />

    </section>
  )
}

export default Feed