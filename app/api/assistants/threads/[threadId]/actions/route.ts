export async function POST(request: Request) {
  try {
    const { toolCallOutputs, runId, threadId } = await request.json();

    const response = await fetch("https://longevity-v0-api-8457657541fe.herokuapp.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: threadId, 
        message: JSON.stringify(toolCallOutputs), 
      }),
    });

    if (!response.ok) {
      throw new Error(`Error from Longevity API: ${response.statusText}`);
    }

    const responseData = await response.json();

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
