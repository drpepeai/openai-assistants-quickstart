"use client"

import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import OpenAI from "openai";

async function doStuff() {
  const openai = new OpenAI({
    apiKey: "xai-XgF0TwybbKq0kk03uvJXr4EYLvmaJt4STPJ4QDZxBo5wLvo37r8eL6CQoOf2h44MvH4KckPo436hK1aU",
    baseURL: "https://api.x.ai/v1",
    dangerouslyAllowBrowser: true,
  });

  const completion = await openai.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      {
        role: "system",
        content:
          "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
      },
      {
        role: "user",
        content:
          "What is the meaning of life, the universe, and everything?",
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

export default function Admin() {

  return (
    <div>
      <button
        onClick={() => doStuff()}
        className="text-white"
      >
        Do stuff
      </button>
      {/* <Chat /> */}
    </div>)
}



function Chat() {
  const [threadId, setThreadId] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('What is the weather in Tokyo?');

  const createThread = async () => {
    const res = await fetch(`/api/assistants/threads`, {
      method: "POST",
    });
    const data = await res.json();
    setThreadId(data.threadId);
  };

  const sendMessage = async (text) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages/nonStream`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      }
    );
  };

  return (
    <div>
      <button onClick={createThread} className={"bg-blue-400"}>
        Create Thread
      </button>
      <button onClick={() => sendMessage(text)}>
        Send Message
      </button>
      <p>ThreadId: {threadId}</p>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${message.role === 'user'
              ? 'bg-blue-50 ml-8'
              : message.role === 'system'
                ? 'bg-red-50'
                : 'bg-zinc-50 mr-8'
              }`}
          >
            <p className="text-sm font-medium mb-2 text-zinc-600">
              {message.role === 'user' ? '👤 You' :
                message.role === 'system' ? '⚠️ System' : '🤖 Assistant'}
            </p>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-md font-medium mt-3 mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-zinc-500 rounded-full"></div>
              <div className="h-2 w-2 bg-zinc-500 rounded-full"></div>
              <div className="h-2 w-2 bg-zinc-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}