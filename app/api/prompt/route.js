import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
    try {
        const query = req.nextUrl.searchParams.get("query");
        const searchQuery = { $regex: new RegExp(query, 'i') };
        await connectToDB();
        const prompts = await Prompt.find({
            $or: [
                { prompt: searchQuery },
                { tag: searchQuery },
            ]
        }).populate("creator");
        return new Response(JSON.stringify(prompts), { status: 201 })
    } catch (error) {
        console.log({ error });
        return new Response("Failed to get prompts!", { status: 500 })
    }
}