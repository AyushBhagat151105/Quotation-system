import { motion } from "motion/react";

export default function SendMailAnimation({ success }: { success: boolean }) {
    return (
        <div className="flex items-center justify-center w-full py-6">
            {!success ? (
                <motion.svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.path
                        d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
                        stroke="#ff64d4"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2 }}
                    />
                </motion.svg>
            ) : (
                <motion.svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <motion.path
                        d="M20 6L9 17L4 12"
                        stroke="#34D399"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                    />
                </motion.svg>
            )}
        </div>
    );
}
