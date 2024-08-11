import { useState, useRef, useEffect } from 'react';
import useGemini from '@/hooks/useGemini';
import { RenderMessage } from './render-message';
import { promptHelper1, promptHelper2 } from '@/lib/constants';
import { Country, CountryData, Message } from '@/lib/types';
import { AudioChat } from './audio-chat';
import { MessageForm } from './message-form';
import { Check, ChevronsUpDown, CornerDownLeft, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';


function ChatInput({ title }: { title: string }) {
  const { messages, loading, sendMessages, updateMessage } = useGemini(promptHelper1 + title);
  const [input, setInput] = useState('');
  const [isPromptTypeChosen, setIsPromptTypeChosen] = useState<boolean>(false);
  const [isSummarizedMore, setIsSummarizedMore] = useState<boolean>(false);
  const [geminiType, setGeminiType] = useState<"text" | "audio">("text");
  const [open, setOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, [messages]);
    return <div ref={elementRef} />;
  };

  const handleSend = async () => {
    const newUserMessage = { role: "user", parts: [{ text: input }] } as Message;
    updateMessage([...messages, newUserMessage]);
    setInput('');
    await sendMessages({ message: input, history: [...messages, newUserMessage] });
  };

  const handleSummarizeMore = async () => {
    const newUserMessage = { role: "user", parts: [{ text: promptHelper2 }] } as Message;
    updateMessage([...messages, newUserMessage]);
    setInput('');
    await sendMessages({ message: input, history: [...messages, newUserMessage] });
    setIsSummarizedMore(true)
  };

  const handleTranslate = async (country: any) => {
    const newUserMessage = { role: "user", parts: [{ text: `translate to ${country} language` }] } as Message;
    updateMessage([...messages, newUserMessage]);
    setInput('');
    await sendMessages({ message: input, history: [...messages, newUserMessage] });
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data: CountryData) => {
        setCountries(data.countries);
        // setSelectedCountry(data.userSelectValue);
      });
  }, []);

  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 lg:col-span-3">
      <div className="flex-1 overflow-auto mb-2">
        <div>
          {messages.map((message, index) => (
            <RenderMessage
              key={index}
              message={message}
              msgIndex={index}
              loading={loading}
              messageLength={messages.length}
            />
          ))}
          <AlwaysScrollToBottom />
        </div>
      </div>

      {!isPromptTypeChosen ?
        <motion.div className='flex flex-col gap-4 items-start'>
          <motion.div className='flex flex-row w-full gap-4'>
            {!isSummarizedMore && <Button
              size="sm"
              disabled={loading}
              onClick={() => {
                handleSummarizeMore()
              }}
              className="w-full gap-4"
            >
              <CornerDownLeft className="size-3.5" />
              Summarize More
            </Button>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={loading}
                  className="w-full justify-between"
                >
                  {selectedCountry
                    ? countries.find((country) => country.label === selectedCountry)?.label
                    : "Translate"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.label}
                          onSelect={(currentValue) => {
                            handleTranslate(currentValue)
                            setSelectedCountry(currentValue === selectedCountry ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCountry === country.label ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {country.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              size="sm"
              variant={isSummarizedMore ? "default" : "outline"}
              disabled={loading}
              onClick={() => {
                setIsPromptTypeChosen(true)
                setGeminiType("audio");
              }}
              className="w-full gap-4"
            >
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
              Read it
            </Button>
          </motion.div>
          <Button
            disabled={loading}
            onClick={() => {
              setIsPromptTypeChosen(true)
              setGeminiType("text");
            }}
            variant="link"
          >
            Ask my own questions
          </Button>
        </motion.div>
        :
        geminiType === "text" ?
          <MessageForm
            input={input}
            loading={loading}
            handleChangeSearch={handleChangeSearch}
            handleSend={handleSend}
            setIsPromptTypeChosen={setIsPromptTypeChosen}
            setGeminiType={setGeminiType}
          /> :
          <AudioChat
            title={messages[messages.length - 1].parts[0].text}
            setIsPromptTypeChosen={setIsPromptTypeChosen}
          />
      }

    </div>
  );
}

export default ChatInput;
