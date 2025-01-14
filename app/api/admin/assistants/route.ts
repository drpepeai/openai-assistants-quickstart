import { openai } from "@/app/openai";

// download file by file ID
export async function GET() {
  const assistants = await openai.beta.assistants.list({
    order: "desc",
    limit: 20,
  });
  return Response.json(assistants.data);
}
