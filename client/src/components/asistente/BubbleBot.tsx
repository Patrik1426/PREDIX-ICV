import { Avatar } from "./Avatar";
import { renderConMarkdownBold } from "./markdown";

type BubbleBotProps = { content: string };

export function BubbleBot({ content }: BubbleBotProps) {
  return (
    <div data-testid="chat-mensaje-bot" className="flex max-w-[80%] items-start gap-2.5">
      <Avatar role="assistant" />
      <div className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm border bg-muted/40 px-4 py-3 shadow-sm">
        {renderConMarkdownBold(content)}
      </div>
    </div>
  );
}
