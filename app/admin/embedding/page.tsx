"use client"

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Update the OpenAI client configuration
const openai = new OpenAI({
  apiKey: "xai-XgF0TwybbKq0kk03uvJXr4EYLvmaJt4STPJ4QDZxBo5wLvo37r8eL6CQoOf2h44MvH4KckPo436hK1aU",
  baseURL: "https://api.x.ai/v1",
  dangerouslyAllowBrowser: true,
});

// Replace the Admin component with this updated version
export default function Admin() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);
    const docs = chunks.map(chunk => chunk.pageContent);
    setDocuments(docs);

    // Generate embeddings for each chunk
    const embeddings = await Promise.all(
      docs.map(async (doc) => {
        const response = await openai.embeddings.create({
          model: "grok-2-latest",
          input: doc,
        });
        return response.data[0].embedding;
      })
    );

    // Store documents and embeddings (you'll need to implement your vector store)
    // For this example, we'll just keep them in memory
    localStorage.setItem('documents', JSON.stringify(docs));
    localStorage.setItem('embeddings', JSON.stringify(embeddings));
  };

  const handleQuestionSubmit = async () => {
    setLoading(true);
    try {
      // Generate embedding for the question
      const questionEmbedding = await openai.embeddings.create({
        model: "grok-2-latest",
        input: question,
      });
      console.log({ questionEmbedding });

      // Retrieve relevant documents (simple cosine similarity)
      const storedEmbeddings = JSON.parse(localStorage.getItem('embeddings') || '[]');
      const storedDocs = JSON.parse(localStorage.getItem('documents') || '[]');
      console.log({ storedEmbeddings });
      // Find most similar documents
      const similarities = storedEmbeddings.map((embedding: number[]) =>
        cosineSimilarity(questionEmbedding.data[0].embedding, embedding)
      );
      console.log({ similarities });
      // Get top 3 most relevant documents
      const topDocs = similarities
        .map((score: number, index: number) => ({ score, index }))
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 3)
        .map(({ index }: { index: number }) => storedDocs[index]);
      console.log({ topDocs });

      // Generate response using RAG
      const completion = await openai.chat.completions.create({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Use the provided context to answer questions accurately.",
          },
          {
            role: "user",
            content: `Context: ${topDocs.join('\n\n')}\n\nQuestion: ${question}`,
          },
        ],
      });
      console.log({ completion });
      setAnswer(completion.choices[0].message.content || '');
    } catch (error) {
      console.error('Error:', error);
      setAnswer('An error occurred while processing your question.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">RAG Application</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Document Upload</h2>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.pdf,.doc,.docx"
          className="mb-2"
        />
        <p className="text-sm text-gray-600">
          Uploaded documents: {documents.length}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ask a Question</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your question..."
        />
        <button
          onClick={handleQuestionSubmit}
          disabled={loading || !question}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Processing...' : 'Ask'}
        </button>
      </div>

      {answer && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Answer</h2>
          <div className="p-4 bg-gray-50 rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {answer}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

// Add this utility function
function cosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}