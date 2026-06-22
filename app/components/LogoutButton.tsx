"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import gsap from "gsap";
import AuthService from "@/services/auth.service";

export default function LogoutButton() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch {
      // proceed with local logout regardless
    } finally {
      sessionStorage.removeItem("user_session");
      sessionStorage.removeItem("user_identifier");
      sessionStorage.removeItem("user_role");
      document.cookie = "user_session=; path=/; max-age=0";
      router.replace("/login");
    }
  };

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const icon = iconRef.current;

    const handleMouseEnter = () => {
      setIsHovering(true);
      if (isLoading) return;
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out",
      });
      gsap.to(button, {
        boxShadow: "0 0 20px rgba(220, 38, 38, 0.6)",
        duration: 0.3,
        ease: "power2.out",
      });
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
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "back.out",
      });
      gsap.to(button, {
        boxShadow: "0 0 0px rgba(220, 38, 38, 0)",
        duration: 0.3,
        ease: "power2.out",
      });
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
      if (icon) {
        gsap.to(icon, {
          rotation: 360,
          duration: 0.6,
          ease: "back.out",
        });
      }
      gsap.to(button, {
        opacity: 0.7,
        delay: 0.2,
        duration: 0.3,
        ease: "power2.out",
      });
      handleLogout();
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick);
    };
  }, [isLoading]);

  return (
    <button
      ref={buttonRef}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
      title={isLoading ? "Logging out..." : "Logout"}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <LogOut ref={iconRef} size={20} />
      )}
      <span className="text-sm font-medium">
        {isLoading ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
}
