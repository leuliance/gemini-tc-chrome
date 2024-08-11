import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils";

export const RenderMessage = ({ message, msgIndex, loading, messageLength }: {
  message: {
    role: "model" | "user";
    parts: { text: string }[];
  };
  msgIndex: number;
  loading: boolean;
  messageLength: number;
}) => {

  const { parts, role } = message;

  const Loader = () => (
    msgIndex === messageLength - 1 && loading && (
      <div className="flex flex-col gap-2 self-start">
        <div className="h-5 w-full origin-left animate-loading rounded-sm bg-gradient-to-r from-blue-50 from-40% via-blue-500/60 to-blue-50 to-70% bg-[length:200%] opacity-0"></div>
        <div className="h-5 w-5/6 origin-left animate-loading rounded-sm bg-gradient-to-r from-blue-50 from-40% via-blue-500/60 to-blue-50 to-70% bg-[length:200%] opacity-0"></div>
        <div className="h-5 w-1/2 origin-left animate-loading rounded-sm bg-gradient-to-r from-blue-50 from-40% via-blue-500/60 to-blue-50 to-70% bg-[length:200%] opacity-0"></div>
      </div>
    )
  );

  return (
    <>
      {parts.map((part, index) => (
        part.text ? (
          <div key={index} className='flex flex-col gap-4'>
            <motion.div
              className={cn(
                "flex overflow-auto w-auto items-end my-2 p-2 rounded-md",
                role === 'user' ? 'self-end bg-blue-500 text-white' : 'self-start bg-gray-200 text-black'
              )}
              initial={{ opacity: 0, scale: 0.5, y: 20, x: role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            >
              <ReactMarkdown
                className="text-sm"
                components={{
                  p: ({ node, ...props }) => <p {...props} className="text-sm" />,
                  code: ({ node, ...props }: any) => (
                    <pre
                      {...props}
                      className="text-sm font-mono text-white bg-slate-800 rounded-md p-2 overflow-auto m-2"
                    />
                  )
                }}
              >
                {part.text}
              </ReactMarkdown>
            </motion.div>
            <Loader />
          </div>
        ) : (
          <Loader key={index} />
        )
      ))}
    </>
  );
};
