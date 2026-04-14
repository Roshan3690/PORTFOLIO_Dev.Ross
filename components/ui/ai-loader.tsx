'use client';

import * as React from "react";

interface LoaderProps {
  size?: number; 
  text?: string;
}

export const AiLoader: React.FC<LoaderProps> = ({ size = 180, text = "Loading" }) => {
  const letters = text.split("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-900">
      <div
        className="relative flex items-center justify-center font-heading select-none"
        style={{ width: size, height: size }}
      >
       
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block text-white opacity-40 animate-loaderLetter font-display"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}

        <div
          className="absolute inset-0 rounded-full animate-loaderCircle"
        ></div>
      </div>

      <style jsx>{`
        @keyframes loaderCircle {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 6px 12px 0 #a78bfa inset,
              0 12px 18px 0 #7c3aed inset,
              0 36px 36px 0 #5b21b6 inset,
              0 0 3px 1.2px rgba(167, 139, 250, 0.3),
              0 0 6px 1.8px rgba(124, 58, 237, 0.2);
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 6px 12px 0 #c4b5fd inset,
              0 12px 6px 0 #8b5cf6 inset,
              0 24px 36px 0 #7c3aed inset,
              0 0 3px 1.2px rgba(167, 139, 250, 0.3),
              0 0 6px 1.8px rgba(124, 58, 237, 0.2);
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 6px 12px 0 #ddd6fe inset,
              0 12px 18px 0 #7c3aed inset,
              0 36px 36px 0 #5b21b6 inset,
              0 0 3px 1.2px rgba(167, 139, 250, 0.3),
              0 0 6px 1.8px rgba(124, 58, 237, 0.2);
          }
        }

        @keyframes loaderLetter {
          0%,
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.15);
          }
          40% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }

        .animate-loaderCircle {
          animation: loaderCircle 5s linear infinite;
        }

        .animate-loaderLetter {
          animation: loaderLetter 3s infinite;
        }
      `}</style>
    </div>
  );
};
