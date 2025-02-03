import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  const { content } = await request.json();

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });
  
  return new Response(stream.toReadableStream(), {
    headers: new Headers({
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked'
    })
  });
}

export async function GET(request, { params: { threadId } }) {
  const messages = await openai.beta.threads.messages.list(
    threadId
  );
  return Response.json({ threadId, messages });
}
