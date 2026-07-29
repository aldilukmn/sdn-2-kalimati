"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import toast from "react-hot-toast";

interface TruncatedTextWithInfoProps {
  text: string;
  className?: string;
  iconSize?: number;
  as?: React.ElementType;
}

export default function TruncatedTextWithInfo({
  text,
  className,
  iconSize = 14,
  as: Component = "span",
}: TruncatedTextWithInfoProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    const timeoutId = setTimeout(checkTruncation, 100);
    return () => {
      window.removeEventListener("resize", checkTruncation);
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <Component ref={textRef as React.RefObject<any>} className={`truncate min-w-0 ${className || ""}`} title={text}>
        {text}
      </Component>
      {isTruncated && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast(text, { icon: "ℹ️", duration: 4000 });
          }}
          className="md:hidden shrink-0 text-amber-500 hover:text-amber-600 cursor-pointer"
          title="Lihat teks lengkap"
        >
          <Info size={iconSize} />
        </button>
      )}
    </>
  );
}
