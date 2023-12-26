"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Form from "@components/Form"

const UpdatePrompt = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const promptId = searchParams.get("id")

    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: "",
        tag: ""
    });

    const updatePrompt = async (e) => {
        e.preventDefault();
        if (!session) return alert("YOu are not allowed to Edit this")
        if (!promptId) return alert("Prompt Id not found!")

        setSubmitting(true);
        try {
            const response = await fetch(`/api/prompt/${promptId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        prompt: post.prompt,
                        tag: post.tag
                    })
                })
            if (response.ok) {
                router.push("/")
            }

        } catch (error) {
            console.log({ error });
        }
        finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        const getPromptById = async () => {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: "GET"
            })
            const data = await response.json();
            console.log({ data });
            setPost({
                prompt: data.prompt,
                tag: data.tag
            })
        }
        getPromptById()
    }, [promptId])

    return (
        <Form
            type="Edit"
            {...{ post, setPost, submitting }}
            handleSubmit={updatePrompt}
        />
    )
}

export default UpdatePrompt;