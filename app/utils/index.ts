export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export async function fetchAllThreads(storedThreadIds: string): Promise<any> {
  const allThreadIds = storedThreadIds.split(',');
  const allThreads = await Promise.all(allThreadIds.map(async threadId => fetchThreadMessages(threadId)));

  const filteredThreads = allThreads.filter(thread => thread.messages.length > 0);

  const newThreads = {}
  filteredThreads.forEach(thread => {
    newThreads[thread.threadId] = thread;
  });

  return newThreads;
}

export async function createThread(): Promise<string> {
  const res = await fetch(`/api/assistants/threads`, {
    method: "POST",
  });
  const data = await res.json();

  return data.threadId;
};

export async function fetchThreadMessages(threadId) {
  const response = await fetch(
    `/api/assistants/threads/${threadId}/messages`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  if (data.messages.data.length > 0) {
    return {
      threadId, messages: data.messages.data.map(message => {
        return {
          role: message.role,
          text: message.content[0].text.value,
        }
      }).reverse()
    }
  } else {
    return { threadId, messages: [] }
  }
}