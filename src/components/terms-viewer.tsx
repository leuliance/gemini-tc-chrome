import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ReloadIcon } from "@radix-ui/react-icons";
import { CornerDownLeft, X } from 'lucide-react';
import { sleep } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import ChatInput from './chat-input';
import { AudioChat } from './audio-chat';

export function TermsViewer() {

  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasTerms, setHasTerms] = useState<boolean>(true);
  const [isPromptTypeChosen, setIsPromptTypeChosen] = useState<boolean>(false);
  const [geminiType, setGeminiType] = useState<"text" | "audio">("text");

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener((message) => {
      if (message.type === 'SET_TITLE') {
        setTitle(message.title);
      }
    });
  }, []);

  function scrapeTermsAndServices() {
    const termsKeywords = ['terms', 'services', 'conditions', 'privacy', 'policy'];
    let termsContent = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div').forEach((element: any) => {
      const text = element.innerText.toLowerCase();
      if (termsKeywords.some(keyword => text.includes(keyword))) {
        termsContent += `${element.innerText}\n`;
      }
    });

    return termsContent;
  }

  const fetchTitle = async () => {
    setHasTerms(true)
    setIsLoading(true);
    await sleep(1000)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: scrapeTermsAndServices,
          },
          (results) => {
            setIsLoading(false);
            if (results && results[0]) {
              const content = results[0]?.result ?? "";
              if (content.length === 0) {
                setHasTerms(false);
                setTitle('');
              } else {
                setTitle(content);
                setHasTerms(true);
              }
            }
          }
        );
      }
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      {title.length === 0 ?
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no terms
          </h3>
          <p className="text-sm text-muted-foreground">
            Click "Read Terms" to get started.
          </p>
          <Button className="mt-4" onClick={fetchTitle} disabled={isLoading}>
            {isLoading && (
              <ReloadIcon className="mr-2 size-4 animate-spin" />
            )}
            Read Terms
          </Button>
          {!hasTerms && <p className="text-red-500">No terms to read.</p>}
        </div>
        :
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3">
          <div className="flex-1 py-2">
            <ScrollArea className="h-64 p-3 w-full rounded-md border">
              <Button size="sm" onClick={() => setTitle('')} className="absolute right-3 top-3">
                <X className="size-3.5" />
              </Button>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {title}
              </p>
            </ScrollArea>
          </div>
          {!isPromptTypeChosen ?
            <div className='flex flex-row w-full gap-4'>
              <Button
                onClick={() => {
                  setIsPromptTypeChosen(true)
                  setGeminiType("text");
                }}
                className="w-full gap-4"
              >
                <CornerDownLeft className="size-3.5" />
                Summarize it
              </Button>
              {/* <Button
                variant="outline"
                onClick={() => {
                  setIsPromptTypeChosen(true)
                  setGeminiType("audio");
                }}
                className="w-full gap-4"
              >
                <Mic className="size-4" />
                <span className="sr-only">Use Microphone</span>
                Read it
              </Button> */}
            </div> :
            geminiType === "text" ?
              <ChatInput title={title} /> :
              <AudioChat title={title} setIsPromptTypeChosen={setIsPromptTypeChosen} />
          }
        </div>
      }
    </div>
  );
}
