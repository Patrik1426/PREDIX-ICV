import { Avatar } from "./Avatar";

type BubbleUserProps = { content: string };

export function BubbleUser({ content }: BubbleUserProps) {
  return (
    <div data-testid="chat-mensaje-usuario" className="ml-auto flex max-w-[70%] flex-row-reverse items-start gap-2.5">
      <Avatar role="user" />
      <div className="rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-2.5">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
