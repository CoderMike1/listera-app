import React, { useEffect, useMemo, useRef, useState } from "react";
import "./AutocompleteItemSelect.css";

// props.items: [{ id, name, sku, size, imageUrl? }, ...]
// props.onSelect: (item) => void
export default function AutocompleteItemSelect({ items = [], onSelect }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const listRef = useRef(null);
    const inputRef = useRef(null);

    const suggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items.slice(0, 5);

        const score = (it) => {
            const hay = `${it.name ?? ""} ${it.sku ?? ""} ${it.size ?? ""}`.toLowerCase();
            if (hay.startsWith(q)) return 0;
            if (hay.includes(q)) return 1;
            return 99;
        };

        return items
            .map((it) => ({ it, s: score(it) }))
            .filter((x) => x.s < 99)
            .sort((a, b) => a.s - b.s)
            .slice(0, 5)
            .map((x) => x.it);
    }, [items, query]);

    useEffect(() => {
        const onDoc = (e) => {
            if (
                listRef.current?.contains(e.target) ||
                inputRef.current?.contains(e.target)
            ) return;
            setOpen(false);
            setActiveIndex(-1);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const handleSelect = (item) => {
        setQuery(`${item.name} • ${item.sku} • ${item.size}`);
        setOpen(false);
        setActiveIndex(-1);
        onSelect?.(item);
    };

    const onKeyDown = (e) => {
        if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setOpen(true);
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            if (open && activeIndex >= 0 && suggestions[activeIndex]) {
                e.preventDefault();
                handleSelect(suggestions[activeIndex]);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
        }
    };

    return (
        <div className="ais-root">
            <label className="ais-label">Item</label>
            <input
                ref={inputRef}
                className="ais-input"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder="Szukaj po name / SKU / size…"
                aria-autocomplete="list"
                aria-expanded={open}
                role="combobox"
            />

            {open && suggestions.length > 0 && (
                <ul ref={listRef} role="listbox" className="ais-list">
                    {suggestions.map((it, idx) => (
                        <li
                            key={it.id}
                            role="option"
                            aria-selected={idx === activeIndex}
                            className={`ais-item ${idx === activeIndex ? "is-active" : ""}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelect(it)}
                            onMouseEnter={() => setActiveIndex(idx)}
                        >
                            {it.imageUrl ? (
                                <img className="ais-thumb" src={it.imageUrl} alt="" />
                            ) : (
                                <div className="ais-thumb ais-thumb--placeholder" />
                            )}
                            <div className="ais-texts">
                                <span className="ais-name">{it.name}</span>
                                <span className="ais-meta">
                  {it.sku} • {it.size}
                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
