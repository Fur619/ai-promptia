import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate("creator");
        if (!prompt) return new Response("Prompt Not Found!", { status: 404 })
        return new Response(JSON.stringify(prompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to get prompt!", { status: 500 })
    }
}

export const PATCH = async (req, { params }) => {
    const { prompt, tag } = await req.json();

    try {
        await connectToDB();
        const existingPrompt = await Prompt.findById(params.id).populate("creator");
        if (!existingPrompt) return new Response("Prompt Not Found!", { status: 404 })

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;
        await existingPrompt.save()

        return new Response(JSON.stringify(existingPrompt), { status: 201 })
    } catch (error) {
        return new Response("Failed to Update prompt!", { status: 500 })
    }
}

export const DELETE = async (req, { params }) => {
    try {
        await connectToDB();
        await Prompt.findByIdAndDelete(params.id);

        return new Response("Prompt Deleted!", { status: 201 })
    } catch (error) {
        return new Response("Failed to Delete prompt!", { status: 500 })
    }

}