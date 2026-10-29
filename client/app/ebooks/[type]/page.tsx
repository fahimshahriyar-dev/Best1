"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGetAllEbooksQuery } from "@/redux/features/ebook/ebookApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Loader from "../../components/Loader";
import Heading from "../../utils/Heading";
import Header from "../../components/Header";
import EbookCard from "../../components/EbookCard";
import { useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiOutlineClock } from "react-icons/hi";
import { translations } from "../../utils/translations";
import { useParams, useRouter } from "next/navigation";
import AnimatedPopup from "../../components/AnimatedPopup";

const STORAGE_KEY = "ebook_search_history";

const typeMapping: Record<string, string> = {
  "certificate-ebook": "Certificate E-Book",
  "academic-ebook": "Academic E-Book",
  "religious-ebook": "Religious E-Book",
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const typeSlug = params?.type as string;
  const ebookTypeFilter = typeMapping[typeSlug] || "";

  const { data, isLoading } = useGetAllEbooksQuery({}, { refetchOnMountOrArgChange: true });
  const { data: categoriesData } = useGetHeroDataQuery("EbookCategories", {});
  const allEbooks = data?.ebooks || [];

  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { language } = useSelector((state: any) => state.language);
  const categories = categoriesData?.layout?.categories || [];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSearchHistory(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const saveToHistory = (query: string) => {
    const updated = [query, ...searchHistory.filter((h) => h !== query)].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeFromHistory = (query: string) => {
    const updated = searchHistory.filter((h) => h !== query);
    setSearchHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    saveToHistory(trimmed);
    setSearch(trimmed);
    setIsSearchOpen(false);
  };

  const handleSelectEbook = (item: any) => {
    const trimmed = item.name?.trim();
    if (!trimmed) return;
    saveToHistory(trimmed);
    setIsSearchOpen(false);
    setSearch("");
    router.push(`/ebook/${item._id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(search);
    }
  };

  const filteredSuggestions = search.trim()
    ? allEbooks.filter(
        (b: any) =>
          (!ebookTypeFilter || b.ebookType === ebookTypeFilter) &&
          (b.name?.toLowerCase().includes(search.toLowerCase()) ||
            (b.tags || []).some((tag: string) =>
              tag.toLowerCase().includes(search.toLowerCase())
            ))
      )
    : [];

  const titleText =
    translations[language]?.[typeSlug?.replace("-", "_")] || ebookTypeFilter;

  useEffect(() => {
    if (data?.ebooks) {
      let filtered = [...data.ebooks];
      if (ebookTypeFilter) {
        filtered = filtered.filter((item: any) => item.ebookType === ebookTypeFilter);
      }
      if (search) {
        filtered = filtered.filter(
          (item: any) =>
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            (item.tags || []).some((tag: string) =>
              tag.toLowerCase().includes(search.toLowerCase())
            )
        );
      }
      if (selectedCategory) {
        filtered = filtered.filter((item: any) => {
          const catId = item.categories?._id || item.categories;
          return catId === selectedCategory;
        });
      }
      setEbooks(filtered);
    }
  }, [data, search, selectedCategory, ebookTypeFilter]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Heading
            title={`${ebookTypeFilter} - Best1 Academy`}
            description={"Browse and purchase our comprehensive collection of E-Books."}
            keywords={"ebooks, programming, learn, coding, store"}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
          />
          <div className="bg-background-Theme min-h-screen">
            <div className="w-[95%] 800px:w-[85%] m-auto pt-28">
              <div className="w-full flex flex-col lg:flex-row lg:flex-wrap lg:justify-between lg:items-center gap-4 mb-8">
                <h1 className="font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-[clamp(26px,2.6vw,36px)] text-text-basic 800px:!leading-[60px] lg:!leading-[1.2] font-[700] tracking-tight lg:min-w-0">
                  {titleText}
                </h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:flex-1 lg:min-w-0 lg:justify-end lg:gap-4 w-full lg:w-auto">
                  <div
                    onClick={() => setIsSearchOpen(true)}
                    className="relative flex-1 min-w-0 lg:max-w-[320px] cursor-pointer"
                  >
                    <div className="bg-background-Card_1 border border-[#ffffff1a] rounded-xl p-3 w-full h-[46px] text-text-basic font-medium text-[14px] pl-4 pr-12 flex items-center">
                      {search || (
                        <span className="opacity-40">
                          {language === "bangla" ? "ই-বুক খুঁজুন..." : "Search E-Books..."}
                        </span>
                      )}
                      {search && <span className="truncate">{search}</span>}
                    </div>
                    <div className="absolute flex items-center justify-center w-[46px] h-[46px] right-0 top-0 text-text-basic opacity-50">
                      <IoIosSearch size={20} />
                    </div>
                  </div>

                  <AnimatedPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
                    <div className="w-[700px] h-[500px] bg-background-Card_1 rounded-2xl shadow-2xl border border-[#ffffff1a] flex flex-col">
                      <div className="flex items-center gap-3 p-4 border-b border-[#ffffff1a] shrink-0">
                        <FiSearch className="shrink-0 opacity-40" size={20} />
                        <input
                          ref={inputRef}
                          type="text"
                          value={search}
                          placeholder={
                            language === "bangla"
                              ? "নাম বা ট্যাগ দিয়ে ই-বুক খুঁজুন..."
                              : "Search e-books by name or tag..."
                          }
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
                        {search.trim() && filteredSuggestions.length > 0 && (
                          <div>
                            <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider opacity-40">
                              E-Books
                            </p>
                            {filteredSuggestions.slice(0, 8).map((item: any) => (
                              <button
                                key={item._id}
                                type="button"
                                onClick={() => handleSelectEbook(item)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-text-basic hover:bg-hover-bg-1 transition-colors"
                              >
                                <FiSearch className="shrink-0 opacity-40" size={16} />
                                <span className="truncate">{item.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {search.trim() && filteredSuggestions.length === 0 && (
                          <div className="px-4 py-3 text-sm opacity-40">
                            {language === "bangla"
                              ? "কোন ই-বুক পাওয়া যায়নি"
                              : "No e-books found"}
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
                                  onClick={() => handleSearch(item)}
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
                              {language === "bangla"
                                ? "কোন ই-বুক খোঁজা হয়নি"
                                : "No e-books have been searched yet"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AnimatedPopup>

                  <div className="w-full sm:w-auto sm:flex-1 sm:min-w-0 lg:flex-none">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-background-Card_1 border border-[#ffffff1a] rounded-xl p-3 h-[46px] outline-none text-text-basic font-medium text-[14px] cursor-pointer w-full lg:w-[clamp(150px,15vw,220px)]"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {ebooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-none">
                  {ebooks.map((item: any, index: number) => (
                    <EbookCard item={item} key={index} />
                  ))}
                </div>
              ) : (
                <p className="text-text-basic flex justify-center min-h-[50vh] items-center text-lg opacity-60">
                  {search || selectedCategory
                    ? language === "bangla"
                      ? "কোন ই-বুক পাওয়া যায়নি!"
                      : "No e-books found!"
                    : language === "bangla"
                    ? `এই মুহূর্তে কোনো ${titleText} উপলব্ধ নেই।`
                    : `No ${ebookTypeFilter.toLowerCase()} available at the moment.`}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
