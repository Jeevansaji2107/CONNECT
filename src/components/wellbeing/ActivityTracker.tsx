"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface ActivityMetrics {
    sessionStart: number;
    sessionDuration: number;
    scrollEvents: number;
    clickEvents: number;
    lastScrollTime: number;
    scrollVelocity: number;
    interactionRate: number;
    contentCreated: number;
    rapidActions: number;
}

interface ActivityTrackerProps {
    onSilenceModeTriggered: () => void;
}

export const ActivityTracker = ({ onSilenceModeTriggered }: ActivityTrackerProps) => {
    const pathname = usePathname();
    const metricsRef = useRef<ActivityMetrics>({
        sessionStart: 0,
        sessionDuration: 0,
        scrollEvents: 0,
        clickEvents: 0,
        lastScrollTime: 0,
        scrollVelocity: 0,
        interactionRate: 0,
        contentCreated: 0,
        rapidActions: 0,
    });

    const [lastCheckTime, setLastCheckTime] = useState(0);

    // Detect burnout, rage spirals, and doom scrolling
    const checkForSilenceMode = () => {
        const metrics = metricsRef.current;
        const now = Date.now();
        metrics.sessionDuration = (now - metrics.sessionStart) / 1000 / 60; // minutes

        // Calculate interaction rate
        const totalActions = metrics.scrollEvents + metrics.clickEvents + metrics.contentCreated;
        metrics.interactionRate = totalActions > 0 ? metrics.contentCreated / totalActions : 0;

        // BURNOUT DETECTION
        // Session > 120 minutes with high activity
        const isBurnout =
            metrics.sessionDuration > 120 &&
            metrics.clickEvents > 1000 &&
            metrics.interactionRate < 0.05;

        // DOOM SCROLLING DETECTION
        // High scroll velocity with low engagement
        const isDoomScrolling =
            metrics.scrollVelocity > 50 &&
            metrics.sessionDuration > 45 &&
            metrics.interactionRate < 0.03;

        // RAGE SPIRAL DETECTION
        // Rapid actions in short time
        const isRageSpiral = metrics.rapidActions > 30;

        // LATE NIGHT DETECTION
        const currentHour = new Date().getHours();
        const isLateNight = currentHour >= 23 || currentHour <= 5;

        // Trigger Silence Mode if any condition is met
        if ((isBurnout || isDoomScrolling || isRageSpiral) && isLateNight) {
            console.log("🔕 Silence Mode Triggered", {
                isBurnout,
                isDoomScrolling,
                isRageSpiral,
                metrics,
            });
            onSilenceModeTriggered();
        }
    };

    useEffect(() => {
        metricsRef.current.sessionStart = Date.now();
        setLastCheckTime(Date.now());

        let scrollTimeout: NodeJS.Timeout;
        let rapidActionWindow: number[] = [];

        const handleScroll = () => {
            const now = Date.now();
            metricsRef.current.scrollEvents++;

            // Calculate scroll velocity
            if (metricsRef.current.lastScrollTime) {
                const timeDiff = (now - metricsRef.current.lastScrollTime) / 1000;
                metricsRef.current.scrollVelocity = timeDiff > 0 ? 1 / timeDiff : 0;
            }
            metricsRef.current.lastScrollTime = now;

            // Clear previous timeout and set new one
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                metricsRef.current.scrollVelocity = 0;
            }, 1000);
        };

        const handleClick = () => {
            const now = Date.now();
            metricsRef.current.clickEvents++;

            // Track rapid actions (within 2 seconds)
            rapidActionWindow.push(now);
            rapidActionWindow = rapidActionWindow.filter((time) => now - time < 2000);
            metricsRef.current.rapidActions = rapidActionWindow.length;
        };

        // Add event listeners
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("click", handleClick);

        // Check every 30 seconds
        const checkInterval = setInterval(() => {
            checkForSilenceMode();
            setLastCheckTime(Date.now());
        }, 30000);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("click", handleClick);
            clearInterval(checkInterval);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // Track content creation (posts, comments)
    useEffect(() => {
        const handleContentCreated = () => {
            metricsRef.current.contentCreated++;
        };

        window.addEventListener("content-created", handleContentCreated);
        return () => window.removeEventListener("content-created", handleContentCreated);
    }, []);

    // Reset metrics on page navigation
    useEffect(() => {
        metricsRef.current.scrollEvents = 0;
        metricsRef.current.clickEvents = 0;
        metricsRef.current.rapidActions = 0;
    }, [pathname]);

    return null; // This component doesn't render anything
};
