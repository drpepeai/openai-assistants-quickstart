"use client";

import React, { useState, useEffect, useRef } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import ReactMarkdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { useAtom } from "jotai";
import { activeThreadIdAtom, threadIdsAtom, threadsAtom } from "../utils/atoms/userInfo";
import { fetchThreadMessages } from "../utils";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-row justify-end">
      <p className="text-[#D1D1D1] bg-[#2e2e2e] p-3 pl-4 pr-4 rounded-[26px] text-sm font-primary proses ">{text}</p>
      </div>
  );
};

const cleanText = (text: string) => {
  return text.replace(/【\d+:\d+†source】/g, ""); // Remove all citations like  
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className="w-full">
      <div className="p-4 text-[#D1D1D1] bg-zinc-900; text-sm rounded-md space-y-4 font-primary proses ">
      <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-4 text-justify">{children}</p>, // Balanced paragraph spacing
            ul: ({ children }) => <ul className="list-disc ml-6 mb-2">{children}</ul>, // Bullet point spacing
            ol: ({ children }) => <ol className="list-decimal ml-6 mb-2">{children}</ol>, // Numbered list spacing
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-300 mb-4">{children}</blockquote>
            ), // Nice blockquote style with spacing
            code: ({ children }) => (
              <code className="block w-full bg-gray-800 p-4 rounded-[12px] text-sm font-cascadia overflow-x-auto">
                {children}
              </code>
            ), 
            hr: () => <hr className="border-t-2 border-gray-700 my-4" />,
          }}
        >
          {cleanText(text)}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={""}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

export default function Chat({ functionCallHandler = () => Promise.resolve("") }: ChatProps) {
  const [activeThreadId, setActiveThreadId] = useAtom(activeThreadIdAtom);
  const [threads, setThreads] = useAtom(threadsAtom);
  const [threadIds, setThreadIds] = useAtom(threadIdsAtom);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // create a new threadID when chat component created
  useEffect(() => {
    if (activeThreadId) {
      console.log("Active Thread ID USE EFFECT");
      setMessages(threads[activeThreadId].messages);
    }
  }, [activeThreadId]);

  const sendMessage = async (text) => {
    setLoading(true);
    const response = await fetch(
      `/api/assistants/threads/${activeThreadId}/messages`,
      {
        method: "POST",
        headers: {
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Transfer-Encoding': 'chunked'
        },
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);

    handleReadableStream(stream);
    setLoading(false);
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/assistants/threads/${activeThreadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    };
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // imageFileDone - show image in chat
  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  }

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta, snapshot) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    console.log("HANDLE RUN COMPLETED");
    setInputDisabled(false);

    fetchThreadMessages(activeThreadId).then(threadMessages => {
      setThreads((prevThreads) => {
        return { ...prevThreads, [activeThreadId]: { threadId: activeThreadId, messages: threadMessages.messages } };
      });
      console.log("Threads2", threads);
    });

  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // image
    stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendMessage = (role, text) => {
    console.log("APPEND MESSAGE");
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const appendToLastMessage = (text) => {
    console.log("APPEND TO LAST MESSAGE");
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const annotateLastMessage = (annotations) => {
    console.log("ANNOTATE LAST MESSAGE");
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation) => {
        if (annotation.type === 'file_path') {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      })
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  }

  return messages.length === 0 ?
    <InitialChat
      messages={messages}
      loading={loading}
      messagesEndRef={messagesEndRef}
      userInput={userInput}
      setUserInput={setUserInput}
      inputDisabled={inputDisabled}
      handleSubmit={handleSubmit}
    /> :
    <ChatInterface
      messages={messages}
      loading={loading}
      messagesEndRef={messagesEndRef}
      userInput={userInput}
      setUserInput={setUserInput}
      inputDisabled={inputDisabled}
      handleSubmit={handleSubmit}
    />
};


interface ChatInterfaceProps {
  messages: any[];
  loading: boolean;
  messagesEndRef: any;
  userInput: string;
  setUserInput: (input: string) => void;
  inputDisabled: boolean;
  handleSubmit: (e: any) => void;
}

function InitialChat({ messages, loading, messagesEndRef, userInput, setUserInput, inputDisabled, handleSubmit }: ChatInterfaceProps) {
  return (
    <div className="mx-auto max-w-[768px]">
      <div className="text-center">
        <h1 className="text-balance text-2xl font-regular tracking-tight text-[#d1d1d1] mt-4 font-cascadia">
          Hello I'm DrPepe.ai
        </h1>
        <p className="mt-2 text-pretty text-xl font-medium text-[#d1d1d1] font-cascadia">
          Tell me how I can help you live forever
        </p>
        <div className="flex items-center justify-center">
          <ChatInterface
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
            userInput={userInput}
            setUserInput={setUserInput}
            inputDisabled={inputDisabled}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

function ChatInterface({ messages, loading, messagesEndRef, userInput, setUserInput, inputDisabled, handleSubmit }: ChatInterfaceProps) {
  return (
    <div className={`w-full max-w-[768px] mx-auto h-[85vh]  flex flex-col ${messages.length > 0 ? "justify-end " : "justify-center h-full font-primary"}`}>

      {/* Chat Messages Container */}
      <div className="w-full flex flex-col flex-1  overflow-auto space-y-4 font-primary">
        
        {/* Render Messages in Order */}
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}

        {/* Scroll Reference for New Messages */}
        <div ref={messagesEndRef} />

        {/* Loading Indicator */}
        {loading && (
          <div className="w-32">
            <div className="p-4 rounded-md flex flex-row justify-center items-center space-x-2 animate-pulse-text">
              <p className="text-[#d1d1d1] font-primary">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="w-full">
        <div className="relative">
          <textarea
            id="question"
            name="question"
            placeholder="Enter your question..."
            aria-label="question"
            className="w-full h-28 resize-none px-4 pr-14 py-3 bg-[#303030] text-[#d1d1d1] rounded-[12px] mt-3 focus:outline-none placeholder:text-zinc-500 border border-zinc-700 font-primary"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          
          {/* Send Button */}
          <button
            type="button"
            className="w-8 h-8 absolute top-[1.3rem] right-2 pb-[2px] bg-[#6CC9FE] text-[#303030] text-[20px] flex items-center justify-center rounded-[12px] shadow-md transition-all hover:bg-[#5BB8F0] disabled:bg-zinc-600 disabled:cursor-not-allowed"
            disabled={inputDisabled}
            onClick={handleSubmit}
          >
            ↑
          </button>
        </div>
      </div>

    </div>
  )
}



