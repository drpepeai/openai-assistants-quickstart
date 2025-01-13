import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  const { content } = await request.json();

  const message = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });
  console.log("MESSAGE:", message);

  // Create the run
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  // Poll the run status until it's completed
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  console.log("RUN STATUS:", runStatus);
  
  while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
    // Wait for 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    console.log("Current status:", runStatus.status);
  }

  if (runStatus.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(
      runStatus.thread_id
    );
    console.log("MESSAGES:", messages);
    return Response.json({ messages });
  } else {
    // Handle failed, expired, or cancelled runs
    return Response.json({ error: `Run ended with status: ${runStatus.status}` }, { status: 500 });
  }
}
