import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
    content: React.ReactNode
    children: React.ReactNode
    className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [coords, setCoords] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setCoords({
                top: rect.top - 10, // Position above
                left: rect.left + rect.width / 2
            })
        }
    }, [isVisible])

    return (
        <div
            ref={triggerRef}
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {createPortal(
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            initial={{ opacity: 0, x: "-50%", y: "-90%", scale: 0.95 }}
                            animate={{ opacity: 1, x: "-50%", y: "-100%", scale: 1 }}
                            exit={{ opacity: 0, x: "-50%", y: "-90%", scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'fixed',
                                top: coords.top,
                                left: coords.left,
                                zIndex: 9999
                            }}
                            className="bg-[#1A1A1A] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                        >
                            {content}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A1A] border-r border-b border-white/10 rotate-45"></div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )
            }
        </div >
    )
}
