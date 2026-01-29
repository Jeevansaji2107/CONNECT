"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export const SearchInput = () => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`relative flex items-center transition-all duration-300 ${isFocused ? "w-full" : "w-full"}`}>
            <div className={`absolute left-4 transition-colors duration-200 ${isFocused ? "text-primary" : "text-muted"}`}>
                <Search className="w-4 h-4" />
            </div>
            <input
                type="text"
                placeholder="Search Connect"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="input-google w-full pl-12 h-11 bg-secondary hover:bg-secondary/80 focus:bg-background border-transparent focus:border-primary/20 text-sm placeholder:text-muted/60"
            />
        </div>
    );
};
