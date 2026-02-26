import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

// Context flag — true means we're already inside a PageWrapper
const WrappedContext = createContext(false);

function PageWrapper({ children }) {
  const alreadyWrapped = useContext(WrappedContext);

  // If embedded inside Home's single-page layout,
  // just render children — no extra wrapper or background
  if (alreadyWrapped) {
    return <>{children}</>;
  }

  // Standalone mode
  return (
    <WrappedContext.Provider value={true}>
      <AnimatedBackground />
      <motion.div
        className="page-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </WrappedContext.Provider>
  );
}

export { WrappedContext };
export default PageWrapper;