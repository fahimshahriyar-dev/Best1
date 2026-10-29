"use client";
import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  zIndex?: number;
};

const AnimatedPopup = ({ isOpen, onClose, children, className = "", overlayClassName = "", zIndex = 999 }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ${overlayClassName}`}
      style={{ zIndex }}
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimatedPopup;
