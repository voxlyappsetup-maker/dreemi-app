import { Fragment } from "react";

/**
 * Renders story text with proper paragraph breaks.
 * - Double newlines (\n\n) become separate <p> tags
 * - Single newlines (\n) within a paragraph become <br/>
 */
export function StoryContent({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        const lines = trimmed.split(/\n/);

        return (
          <p key={i} className="mb-4 leading-loose text-slate-800">
            {lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
