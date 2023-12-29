"use client"

import Navigate from '@components/Navigate'
import Profile from '@components/Profile'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'


const ProfilePage = () => {

    const { data: session, status } = useSession();
    const router = useRouter();

    const [posts, setPosts] = useState([]);
    const [postCount, setPostsCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleEdit = (post) => { router.push(`/update-prompt?id=${post._id}`) }

    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you Sure you want to delete thus prompts?")
        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: "DELETE"
                })
                await fetchPosts()

            } catch (error) {
                console.log({ error });
            }
        }

    }
    const fetchPosts = async (page = 1) => {
        try {
            setLoading(true);
            if (!session?.user.id) return
            const response = await fetch(`/api/users/${session?.user.id}/posts?page=${page}`);
            const data = await response.json()
            setPosts(prev => [...prev, ...data?.prompts?.filter(prompt => !prev.find(post => post?._id === prompt?._id))]);
            setPostsCount(data?.count);
        } catch (error) {
            console.log({ error });
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(page)
    }, [session, page])

    if (!session) {
        if (status === "loading") return <></>
        return <Navigate to="/" router={router} />
    }


    return (
        <>
            <Profile
                name="My"
                desc="Welcome to your personalized profile page"
                data={posts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
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
        </>
    )
}

export default ProfilePage