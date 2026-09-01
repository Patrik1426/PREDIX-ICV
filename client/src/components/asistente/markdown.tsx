export function renderConMarkdownBold(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-sm leading-relaxed" style={{ margin: i < lines.length - 1 ? "0 0 6px" : 0 }}>
        {parts.map((part, j) =>
          part.startsWith("**") ? (
            <strong key={j} className="font-semibold text-primary">{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}
