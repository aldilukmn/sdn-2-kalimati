"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import gsap from "gsap";

interface LogoutButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export default function LogoutButton({
  onClick,
  isLoading = false,
}: LogoutButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const icon = iconRef.current;

    // Hover animation
    const handleMouseEnter = () => {
      setIsHovering(true);

      if (isLoading) return;

      // Scale animation untuk button
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out",
      });

      // Pulse effect dengan shadow
      gsap.to(button, {
        boxShadow: "0 0 20px rgba(220, 38, 38, 0.6)",
        duration: 0.3,
        ease: "power2.out",
      });

      // Rotate icon slightly
      if (icon) {
        gsap.to(icon, {
          rotation: 15,
          duration: 0.3,
          ease: "back.out",
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);

      if (isLoading) return;

      // Reset scale
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "back.out",
      });

      // Reset shadow
      gsap.to(button, {
        boxShadow: "0 0 0px rgba(220, 38, 38, 0)",
        duration: 0.3,
        ease: "power2.out",
      });

      // Reset icon rotation
      if (icon) {
        gsap.to(icon, {
          rotation: 0,
          duration: 0.3,
          ease: "back.out",
        });
      }
    };

    const handleClick = () => {
      if (isLoading) return;

      // Pulse animation on click
      gsap.to(button, {
        scale: 0.95,
        duration: 0.15,
        ease: "power2.in",
      });

      gsap.to(button, {
        scale: 1.05,
        delay: 0.15,
        duration: 0.3,
        ease: "back.out",
      });

      // Icon rotation on click
      if (icon) {
        gsap.to(icon, {
          rotation: 360,
          duration: 0.6,
          ease: "back.out",
        });
      }

      // Fade out animation before logout
      gsap.to(button, {
        opacity: 0.7,
        delay: 0.2,
        duration: 0.3,
        ease: "power2.out",
      });

      onClick();
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick);
    };
  }, [onClick, isLoading]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      title={isLoading ? "Logging out..." : "Logout"}
    >
      <LogOut ref={iconRef} size={20} />
      <span className="text-sm font-medium">
        {isLoading ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
}
