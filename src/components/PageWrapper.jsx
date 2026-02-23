import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

function PageWrapper({ children }) {
  return (
    <>
    <AnimatedBackground />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
    </>
  );
}

export default PageWrapper;