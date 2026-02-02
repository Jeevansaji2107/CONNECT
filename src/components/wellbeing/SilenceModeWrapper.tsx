"use client";

import { useState } from "react";
import { ActivityTracker } from "./ActivityTracker";
import { SilenceModeOverlay } from "./SilenceModeOverlay";

export const SilenceModeWrapper = () => {
    const [isSilenceModeActive, setIsSilenceModeActive] = useState(false);

    return (
        <>
            <ActivityTracker onSilenceModeTriggered={() => setIsSilenceModeActive(true)} />
            <SilenceModeOverlay
                isActive={isSilenceModeActive}
                onDismiss={() => setIsSilenceModeActive(false)}
            />
        </>
    );
};
