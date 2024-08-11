import GeminiService from "@/lib/config";
import { Message, Payload } from "@/lib/types";
import { useEffect, useState } from "react";


export default function useGemini(initialPrompt?: string) {
  const [messages, updateMessage] = useState<Message[]>(checkForMessages());
  const [loading, setLoading] = useState<boolean>(false);

  function checkForMessages(): Message[] {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  }

  useEffect(() => {
    const saveMessages = () => localStorage.setItem('messages', JSON.stringify(messages));
    window.addEventListener('beforeunload', saveMessages);
    return () => window.removeEventListener('beforeunload', saveMessages);
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      updateMessage([{ role: "user", parts: [{ text: "Summarize this for me" }] }]);
      sendMessages({ message: initialPrompt, history: [] });
    }
  }, [initialPrompt]);

  const sendMessages = async (payload: Payload) => {
    updateMessage((prevMessages: Message[]) => [
      ...prevMessages,
      { role: "model", parts: [{ text: "" }] }
    ]);
    setLoading(true);
    try {
      const stream = await GeminiService.sendMessages(payload.message, payload.history);
      for await (const chunk of stream) {
        const chunkText = await chunk.text(); // Ensure text extraction
        updateMessage((prevMessages: Message[]) => {
          const prevMessageClone = structuredClone(prevMessages);
          prevMessageClone[prevMessages.length - 1].parts[0].text += chunkText;
          return prevMessageClone;
        });
      }
    } catch (error) {
      updateMessage([...messages, { role: "model", parts: [{ text: `Seems like I'm having trouble. Please try again later. ${error}` }] }]);
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, sendMessages, updateMessage };
}
