import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const defaultVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

const defaultTransition = { duration: 0.7, ease: [0.4, 0, 0.2, 1] };

const SectionWrapper = ({
  children,
  className = "",
  variants = defaultVariants,
  transition = defaultTransition,
  ...props
}) => {
  const ref = useRef(null);
  // 👇 set once: false
  const inView = useInView(ref, { once: false, margin: "-100px" }); 

  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden"); // 👈 animate out when not in view
  }, [inView, controls]);

  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={transition}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
