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
    const fetchPosts = async () => {
        if (!session?.user.id) return
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        const data = await response.json()
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts()
    }, [session])

    if (!session) {
        if (status === "loading") return <></>
        return <Navigate to="/" router={router} />
    }


    return (
        <Profile
            name="My"
            desc="Welcome to your personalized profile page"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default ProfilePage