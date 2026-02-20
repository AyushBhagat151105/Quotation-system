import { motion } from "motion/react";

interface SendMailAnimationProps {
    success: boolean;
}

export default function SendMailAnimation({ success }: SendMailAnimationProps) {
    return (
        <div className="w-full flex justify-center py-4">
            <svg
                viewBox="0 0 64 64"
                width="64"
                height="64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {!success ? (
                    <>
                        {/* Envelope body */}
                        <motion.rect
                            x="8"
                            y="18"
                            width="48"
                            height="32"
                            rx="4"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        {/* Envelope flap */}
                        <motion.path
                            d="M8 22L32 38L56 22"
                            stroke="#94a3b8"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    </>
                ) : (
                    /* Success checkmark - emerald */
                    <motion.path
                        d="M20 34L28 42L44 22"
                        stroke="#34d399"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                )}
            </svg>
        </div>
    );
}
