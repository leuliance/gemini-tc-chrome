import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CornerDownLeft, Mic, Paperclip, X } from "lucide-react";
import { ChangeEvent, SetStateAction } from "react";

interface MessageFormProps {
  input: string;
  loading: boolean;
  handleChangeSearch: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  setIsPromptTypeChosen: (value: SetStateAction<boolean>) => void
  setGeminiType: (value: SetStateAction<"text" | "audio">) => void
}

export const MessageForm = ({
  input,
  loading,
  handleChangeSearch,
  handleSend,
  setIsPromptTypeChosen,
  setGeminiType
}: MessageFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Textarea
        id="message"
        value={input}
        disabled={loading}
        onChange={handleChangeSearch}
        placeholder="Type your message here... (max 7 lines)"
        className="min-h-12 max-h-40 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        style={{ whiteSpace: 'pre-wrap' }}
      />
      <div className="flex items-center p-3 pt-0">
        <div className='flex flex-row gap-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={loading} onClick={() => setIsPromptTypeChosen(false)} size="icon" variant={"destructive"}>
                <X className="size-3.5" />
                <span className="sr-only">Cancel</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Cancel</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>
          <Tooltip>
            <Button
              onClick={() => {
                setIsPromptTypeChosen(true)
                setGeminiType("audio");
              }}
              variant="ghost"
              size="icon"
            >
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>
            <TooltipContent side="top">Use Microphone</TooltipContent>
          </Tooltip>
        </div>
        <Button disabled={loading} type="submit" size="sm" className="ml-auto gap-1.5">
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  );
};
