"use client";

import { useState } from 'react';
import { Lightbulb, FileText, GraduationCap, MoreHorizontal, SquarePen, Copy, LinkIcon, PlusCircle, ArrowUp, ThumbsUp, ThumbsDown, Volume2 } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant';
    content: string;
  }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = () => {
    if (input.trim()) {
      const newUserMessage: { role: 'user', content: string } = { role: 'user', content: input };
      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);
      setInput(''); 

      setTimeout(() => {
        const aiResponse: { role: 'assistant', content: string } = { role: 'assistant', content: `This is a test response from AI` };
        setMessages((prev) => [...prev, aiResponse]); 
        setIsLoading(false);
      }, 1500);
    }
  };

  const reset = () => {
    setMessages([]);
  }

  return (
    <div className="flex flex-col h-screen bg-white relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={reset} className="text-gray-700 hover:text-gray-900 text-sm flex items-center cursor-pointer">
          <SquarePen className="w-4 h-4 mr-1" /> New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-hidden p-4 flex flex-col items-center">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-gray-900">
                What can I help with ?
            </h1>

            <div className="flex justify-center flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                    <Lightbulb className="w-4 h-4 text-yellow-500" /> Learn Words
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                    <FileText className="w-4 h-4 text-green-500" /> Use Cases
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                    <Volume2 className="w-4 h-4 text-purple-500" /> Improve Grammar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                    <GraduationCap className="w-4 h-4 text-blue-500" /> Quiz Me
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-100 text-gray-800">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" /> More
                </button>
            </div>
        </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 py-6 w-full">
            {messages.map((msg, index) => (
              <div key={index} className="max-w-[800px] mx-auto mb-8 w-full">
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-gray-100 rounded-2xl py-3 px-4 text-sm text-gray-900">
                      {msg.content}
                    </div>
                    <div className="flex gap-2 ml-2 items-center">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 text-sm text-gray-900">{msg.content}</div>
                      <div className="flex gap-2 items-start">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[800px] mx-auto w-full">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-4 py-4 bg-white">
        <div className="max-w-[800px] mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask anything"
              className="w-full pr-20 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-300 text-sm bg-white text-gray-900"
            />
            <div className="absolute right-2 flex gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <PlusCircle className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600"
                onClick={sendMessage}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center mt-2">
            Please note that Scribe can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
} 
