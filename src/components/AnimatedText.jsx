import { useState, useEffect } from "react";

// ⌨️ TYPEWRITER COMPONENT — Types phrases live character-by-character with blinking cursor
export function TypewriterText({
  phrases = [],
  speed = 45,
  deleteSpeed = 25,
  pauseTime = 2200,
  className = "",
  cursorColor = "text-emerald-400",
}) {
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const fullPhrase = phrases[currentPhraseIdx];
    let timer;

    if (!isDeleting) {
      // Typing forward
      if (currentText.length < fullPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(fullPhrase.slice(0, currentText.length + 1));
        }, speed);
      } else {
        // Pause at end of phrase
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullPhrase.slice(0, currentText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIdx, phrases, speed, deleteSpeed, pauseTime]);

  return (
    <span className={`inline-flex items-center font-mono ${className}`}>
      <span>{currentText}</span>
      <span className={`inline-block w-[2px] h-[1em] ml-1 bg-current animate-pulse ${cursorColor}`} />
    </span>
  );
}

// ⬆️ SLIDE-UP WORDS COMPONENT — Splits text into words sliding up from bottom behind overflow-hidden
export function SlideUpWords({
  text = "",
  isVisible = true,
  className = "",
  wordClassName = "",
  delayOffset = 0,
}) {
  const words = text.split(" ");

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.25em] last:mr-0">
          <span
            className={`inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0"
            } ${wordClassName}`}
            style={{
              transitionDelay: `${delayOffset + i * 65}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ⬅️ ➡️ SLIDE-IN COMPONENT — Slides in from Left or Right with smooth easing
export function SlideIn({
  direction = "left", // "left" | "right" | "bottom"
  isVisible = true,
  delay = 0,
  children,
  className = "",
}) {
  const transformMap = {
    left: isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0",
    right: isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0",
    bottom: isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
  };

  return (
    <div
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${transformMap[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
