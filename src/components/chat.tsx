import {
  User,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { TermsViewer } from "./terms-viewer";

export function Chat() {


  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">T&C Reader</h1>
          <Button
            onClick={() =>
              toast.info("Feature coming soon!", {
                position: "bottom-center"

                // description: "Sunday, December 03, 2023 at 9:00 AM",
              })
            }
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <User className="size-3.5" />
            Login
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto md:grid-cols-1 lg:grid-cols-3">
          <TermsViewer />
        </main>
      </div>
    </div>
  )
}
