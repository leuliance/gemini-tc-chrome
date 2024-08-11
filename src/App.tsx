import { Toaster } from 'sonner'
import { Chat } from './components/chat'
import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <div className="w-[500px] h-[450px] flex flex-col">
      <TooltipProvider>
        <Chat />
        <Toaster />
      </TooltipProvider>
    </div>
  )
}

export default App
