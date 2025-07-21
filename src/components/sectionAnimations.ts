// sectionAnimations.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 60, scale: 0.98, rotateY: 0 },
  visible: { opacity: 1, y: 0, scale: 1, rotateY: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } }
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -80, y: 0, scale: 1, rotateY: 0 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, transition: { duration: 0.7, ease: "easeInOut" } }
};

export const fadeRight = {
  hidden: { opacity: 0, x: 80, y: 0, scale: 1, rotateY: 0 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, transition: { duration: 0.7, ease: "easeInOut" } }
};

export const zoomIn = {
  hidden: { opacity: 0, scale: 0.8, y: 0, rotateY: 0 },
  visible: { opacity: 1, scale: 1, y: 0, rotateY: 0, transition: { duration: 0.7, ease: "easeInOut" } }
};

export const flipIn = {
  hidden: { opacity: 0, scale: 0.95, rotateY: 75, y: 0 },
  visible: { opacity: 1, scale: 1, rotateY: 0, y: 0, transition: { duration: 1, ease: [0.6, 0.05, 0, 0.9] } }
};

export const hardBounceIn = {
  hidden: { opacity: 0, y: 80, scale: 0.9, rotate: -8, rotateY: 0 },
  visible: { opacity: 1, y: 0, scale: 1, rotate: 0, rotateY: 0, transition: { type: "spring", stiffness: 90, damping: 12 } }
};

export const slideSkew = {
  hidden: { opacity: 0, x: 120, skewY: 6, y: 0, scale: 1, rotateY: 0 },
  visible: { opacity: 1, x: 0, skewY: 0, y: 0, scale: 1, rotateY: 0, transition: { duration: 0.85, ease: [0.43, 0.13, 0.23, 0.96] } }
};
