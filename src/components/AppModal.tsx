import React, { useEffect } from "react";

type Variant = "success" | "error" | "info" | "warning" | "plain";

type AppModalProps = {
  open: boolean;
  onClose: () => void;

  // content
  title?: string;
  message?: React.ReactNode;         // supports JSX
  variant?: Variant;
  icon?: React.ReactNode;            // custom icon overrides variant icon
  children?: React.ReactNode;        // fully custom body (optional)

  // actions
  primaryText?: string;
  onPrimary?: () => void;
  secondaryText?: string;
  onSecondary?: () => void;

  // behavior & style
  dismissible?: boolean;             // close on overlay/ESC
  size?: "sm" | "md" | "lg";
  zIndexClass?: string;              // e.g. "z-[999]"
  className?: string;                // extra panel classes
};

const iconByVariant: Record<Variant, JSX.Element> = {
  success: (
    <svg width={70} height={70} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#ff3131" />
      <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width={70} height={70} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#ff3131" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width={70} height={70} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#ff3131" />
      <path d="M12 7.5v.5M12 10v6" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width={70} height={70} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#ff3131" />
      <path d="M12 7v6M12 16.5h.01" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  ),
  plain: <></>,
};

const sizeMap = {
  sm: "md:w-[380px] w-[90vw]",
  md: "md:w-[460px] w-[92vw]",
  lg: "md:w-[640px] w-[94vw]",
};

const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title,
  message,
  variant = "plain",
  icon,
  children,

  primaryText = "OK",
  onPrimary,
  secondaryText,
  onSecondary,

  dismissible = true,
  size = "md",
  zIndexClass = "z-[999]",
  className = "",
}) => {
  // ESC to close
  useEffect(() => {
    if (!open || !dismissible) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  const handleOverlay = () => {
    if (dismissible) onClose();
  };

  const handlePrimary = () => {
    if (onPrimary) onPrimary();
    else onClose();
  };
  console.log('opened');
  

  return (
    <div className={`fixed inset-0 ${zIndexClass} flex items-center justify-center`}>
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={handleOverlay} />

      {/* panel */}
      <div
        className={`relative bg-[#232323] rounded-xl shadow-lg py-8 px-4 ${sizeMap[size]} flex flex-col items-center ${className}`}
      >
        {/* close button (top-right) */}
        {dismissible && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        )}

        {/* icon */}
        {(icon || variant !== "plain") && <div className="mb-3">{icon || iconByVariant[variant]}</div>}

        {/* title */}
        {title && <h2 className="text-white text-[28px] md:text-[32px] font-bold mb-2 text-center">{title}</h2>}

        {/* body */}
        {children ? (
          <div className="w-full">{children}</div>
        ) : message ? (
          <p className="text-[#ccc] text-base md:text-lg mb-6 text-center">{message}</p>
        ) : null}

        {/* actions */}
        <div className="mt-2 flex w-full">
            {/* {secondaryText && (
              <button
                className="h-[45px] bg-[#2E2E2E] hover:bg-[#3a3a3a] text-white font-[600] text-[16px] rounded-none transition-all"
                onClick={onSecondary || onClose}
              >
                {secondaryText}
              </button>
            )} */}
            <button
              className="h-[45px] px-[25px] mx-auto bg-[#ff3131] hover:bg-[#e03228] text-white font-[600] text-[16px] rounded-none transition-all col-span-1"
              onClick={handlePrimary}
            >
              {primaryText}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AppModal;
