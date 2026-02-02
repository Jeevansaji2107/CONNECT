"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const SearchInput = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Sync query with URL on mount or URL change
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setQuery(q);
    }, [searchParams]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && query.trim()) {
            router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className={`relative flex items-center transition-all duration-300 ${isFocused ? "w-full" : "w-full"}`}>
            <div className={`absolute left-4 transition-colors duration-200 ${isFocused ? "text-primary" : "text-muted"}`}>
                <Search className="w-4 h-4" />
            </div>
            <input
                type="text"
                placeholder="Search Connect"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="input-google w-full pl-12 h-11 bg-secondary hover:bg-secondary/80 focus:bg-background border-transparent focus:border-primary/20 text-sm placeholder:text-muted/60"
            />
        </div>
    );
};
