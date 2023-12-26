"use client"
import { useState, useEffect } from "react"
import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="flex items-start gap-4 flex-wrap mt-16 w-full">
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

  const onSearchChnage = () => {

  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json()
      setPosts(data);
    };
    fetchPosts()
  }, [])

  return (
    <section className="feed">
      <form className="relaive w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={search}
          onChange={onSearchChnage}
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={() => { }}
      />

    </section>
  )
}

export default Feed