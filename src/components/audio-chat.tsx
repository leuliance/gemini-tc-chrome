import { useSpeech } from "react-text-to-speech";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";

export function AudioChat({ title, setIsPromptTypeChosen }: { title: string, setIsPromptTypeChosen: Dispatch<SetStateAction<boolean>> }) {
    const {
        // Text, // Component that returns the modified text property
        speechStatus, // String that stores current speech status
        // isInQueue, // Boolean that stores whether a speech utterance is either being spoken or present in queue
        start, // Function to start the speech or put it in queue
        pause, // Function to pause the speech
        stop, // Function to stop the speech or remove it from queue
    } = useSpeech({ text: title });

    return (
        <div className="flex flex-col gap-4">
            {/* <Text /> */}
            <div className='flex flex-row w-full gap-4'>
                <Button
                    onClick={() => {
                        if (speechStatus !== "started") {
                            start()
                        } else {
                            pause()
                        }
                    }}
                    className="w-full gap-4"
                >
                    {speechStatus !== "started" ? "Start" : "Pause"}
                </Button>
                <Button
                    variant="outline"
                    onClick={stop}
                    className="w-full gap-4"
                >

                    Stop
                </Button>
            </div>
            <Button
                variant="destructive"
                onClick={() => setIsPromptTypeChosen(false)}
                className="w-full gap-4"
            >

                Cancel
            </Button>
        </div>
    );
}