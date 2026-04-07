import fs from "fs/promises";
import path from "path";
import ReactMarkdown from "react-markdown";

type MarkdownFileProps = {
  filePath: string;
  className?: string;
};

export default async function MarkdownFile({
  filePath,
  className = "",
}: MarkdownFileProps) {
  const fullPath = path.join(process.cwd(), filePath);
  const content = await fs.readFile(fullPath, "utf-8");

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-extrabold text-neutral-900 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-extrabold text-neutral-900 mt-8 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-neutral-900 mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-neutral-700 leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-3 mb-4 ml-1">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-3 text-neutral-700 leading-relaxed">
              <span className="text-neutral-900 font-bold mt-0.5">•</span>
              <span>{children}</span>
            </li>
          ),
          hr: () => <hr className="my-6 border-neutral-200" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-neutral-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
