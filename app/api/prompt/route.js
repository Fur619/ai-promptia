import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (req) => {
    try {
        const query = req.nextUrl.searchParams.get("query");
        const page = req.nextUrl.searchParams.get("page") || 1;
        const searchQuery = { $regex: new RegExp(query, 'i') };
        const limit = 10;
        const skips = limit * (page - 1);
        await connectToDB();
        const whereClause = {
            $or: [
                { prompt: searchQuery },
                { tag: searchQuery },
            ]
        }

        const prompts = await Prompt.find(whereClause).populate("creator").skip(skips).limit(limit);
        const count = await Prompt.countDocuments(whereClause);

        return new Response(JSON.stringify({ prompts, count }), { status: 201 })
    } catch (error) {
        console.log({ error });
        return new Response("Failed to get prompts!", { status: 500 })
    }
}