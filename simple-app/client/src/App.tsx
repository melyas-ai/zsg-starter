import { useState, useEffect } from "react";

function useTypewriter(text: string, speed: number, startDelay: number) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function App() {
  const heading = useTypewriter("Starter App", 100, 400);
  const subtitle = useTypewriter("Ask Claude Code to start building.", 40, 1800);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const showCursor = !subtitle.done;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-gradient-shift" />

      <div className="text-center relative z-10">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight min-h-[1.2em]">
          {heading.displayed.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block animate-letter-pop"
              style={{ animationDelay: `${i * 100 + 400}ms` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
          {!heading.done && (
            <span
              className={`inline-block w-[3px] h-[0.8em] bg-foreground ml-1 align-middle transition-opacity duration-100 ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </h1>

        <div className="mt-6 min-h-[2em]">
          {heading.done && (
            <p className="text-lg sm:text-2xl text-muted-foreground font-light">
              {subtitle.displayed}
              {showCursor && (
                <span
                  className={`inline-block w-[2px] h-[0.85em] bg-muted-foreground ml-0.5 align-middle transition-opacity duration-100 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </p>
          )}
        </div>

        {subtitle.done && (
          <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 border border-border/50 rounded-full px-4 py-2 animate-pulse-subtle">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow" />
              Ready
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
