import { openai } from "@/app/openai";

export async function GET(request, { params: { threadId } }) {
  const myThread = await openai.beta.threads.retrieve(
    threadId
  );
  return Response.json({ myThread });
}
