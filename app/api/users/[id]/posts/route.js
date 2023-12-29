import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        const page = req.nextUrl.searchParams.get("page") || 1;
        const limit = 10;
        const skips = limit * (page - 1);
        const prompts = await Prompt.find({ creator: params.id }).populate("creator").skip(skips).limit(limit);
        const count = await Prompt.countDocuments({ creator: params.id });

        return new Response(JSON.stringify({ prompts, count }), { status: 201 })
    } catch (error) {
        console.log({ error });
        return new Response("Failed to get prompts!", { status: 500 })
    }
}