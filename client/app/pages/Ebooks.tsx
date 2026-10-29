"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGetAllEbooksQuery } from "../../redux/features/ebook/ebookApi";
import { useGetHeroDataQuery } from "../../redux/features/layout/layoutApi";
import Loader from "../components/Loader";
import EbookCard from "../components/EbookCard";
import { useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiOutlineClock } from "react-icons/hi";
import { useRouter } from "next/navigation";
import AnimatedPopup from "../components/AnimatedPopup";

const STORAGE_KEY = "ebook_search_history";

const Ebooks = () => {
    const { data, isLoading } = useGetAllEbooksQuery({}, { refetchOnMountOrArgChange: true });
    const { data: categoriesData } = useGetHeroDataQuery("EbookCategories", {});
    const { language } = useSelector((state: any) => state.language);
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [ebooks, setEbooks] = useState<any[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const categories = categoriesData?.layout?.categories || [];

    const titleText = language === "bangla" ? "আমাদের ই-বুকসমূহ" : "Our E-Books";

    useEffect(() => {
        if (data?.ebooks) {
            let filtered = [...data.ebooks];
            if (selectedCategory) {
                filtered = filtered.filter((item: any) => {
                    const catId = item.categories?._id || item.categories;
                    return catId === selectedCategory;
                });
            }
            setEbooks(filtered);
        }
    }, [data, selectedCategory]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSearchHistory(JSON.parse(stored));
            } catch {}
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);

    const allEbooks = data?.ebooks || [];

    const filteredEbooks = search.trim()
        ? allEbooks.filter((item: any) => {
              const nameMatch = item.name?.toLowerCase().includes(search.toLowerCase());
              const tagMatch = (item.tags || []).some((tag: string) =>
                  tag.toLowerCase().includes(search.toLowerCase())
              );
              return nameMatch || tagMatch;
          })
        : [];

    const saveToHistory = (query: string) => {
        const updated = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
        setSearchHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const removeFromHistory = (query: string) => {
        const updated = searchHistory.filter(h => h !== query);
        setSearchHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleSearch = (item: any) => {
        const trimmed = item.name?.trim();
        if (!trimmed) return;
        saveToHistory(trimmed);
        setIsSearchOpen(false);
        setSearch("");
        router.push(`/ebook/${item._id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && filteredEbooks.length > 0) {
            handleSearch(filteredEbooks[0]);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-[90%] 800px:w-[80%] m-auto py-[102px]">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h1 className="font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-text-basic font-[700] tracking-tight">
                    {titleText}
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Search trigger bar */}
                    <div className="relative w-full md:w-[300px]">
                        <div
                            onClick={() => setIsSearchOpen(true)}
                            className="bg-background-Card_1 border border-[#ffffff1a] rounded-xl p-3 w-full h-[46px] flex items-center cursor-pointer text-text-basic text-[14px] font-medium"
                        >
                            <span className="opacity-40">
                                {language === "bangla" ? "ই-বুক খুঁজুন..." : "Search E-Books..."}
                            </span>
                        </div>
                        <div className="absolute flex items-center justify-center w-[46px] h-[46px] right-0 top-0 text-text-basic opacity-50 pointer-events-none">
                            <IoIosSearch size={20} />
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="w-full md:w-auto">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-background-Card_1 border border-[#ffffff1a] rounded-xl p-3 h-[46px] outline-none text-text-basic font-medium text-[14px] cursor-pointer w-full md:w-[220px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat: any) => (
                                <option key={cat._id} value={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Search Popup */}
            <AnimatedPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
                <div ref={popupRef} className="w-[700px] h-[500px] bg-background-Card_1 rounded-2xl shadow-2xl border border-[#ffffff1a] flex flex-col">
                    <div className="flex items-center gap-3 p-4 border-b border-[#ffffff1a] shrink-0">
                        <FiSearch className="shrink-0 opacity-40" size={20} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            placeholder={language === "bangla" ? "নাম বা ট্যাগ দিয়ে ই-বুক খুঁজুন..." : "Search e-books by name or tag..."}
                            className="flex-1 bg-transparent outline-none text-text-basic text-lg"
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <IoClose size={20} className="text-text-basic" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {search.trim() && filteredEbooks.length > 0 && (
                            <div>
                                <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider opacity-40">
                                    E-Books
                                </p>
                                {filteredEbooks.slice(0, 8).map((item: any) => (
                                    <button
                                        key={item._id}
                                        type="button"
                                        onClick={() => handleSearch(item)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-text-basic hover:bg-hover-bg-1 transition-colors"
                                    >
                                        <FiSearch className="shrink-0 opacity-40" size={16} />
                                        <span className="truncate">{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {search.trim() && filteredEbooks.length === 0 && (
                            <div className="px-4 py-3 text-sm opacity-40">
                                {language === "bangla" ? "কোন ই-বুক পাওয়া যায়নি" : "No e-books found"}
                            </div>
                        )}

                        {!search.trim() && searchHistory.length > 0 && (
                            <div>
                                <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider opacity-40">
                                    Recent Searches
                                </p>
                                {searchHistory.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 px-4 py-3 group"
                                    >
                                        <HiOutlineClock className="shrink-0 opacity-40" size={16} />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch(item);
                                                inputRef.current?.focus();
                                            }}
                                            className="flex-1 text-left text-text-basic truncate hover:text-blue-500 transition-colors"
                                        >
                                            {item}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromHistory(item);
                                            }}
                                            className="shrink-0 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                                        >
                                            <IoClose size={16} className="text-text-basic" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!search.trim() && searchHistory.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <FiSearch size={48} className="opacity-20 mb-4" />
                                <p className="text-sm opacity-40">
                                    {language === "bangla" ? "কোন ই-বুক খোঁজা হয়নি" : "No e-books have been searched yet"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </AnimatedPopup>

            {ebooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                    {ebooks.map((item: any, index: number) => (
                        <EbookCard item={item} key={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center mt-16">
                    <h2 className="text-xl text-text-basic opacity-60">
                        {language === "bangla" ? "কোন ই-বুক পাওয়া যায়নি।" : "No e-books found."}
                    </h2>
                </div>
            )}
        </div>
    );
};

export default Ebooks;
