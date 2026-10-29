"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGetAllCompaniesQuery } from "@/redux/features/company/companyApi";

const defaultBrands = [
  { name: "fazli7.com", website: "https://fazli7.com" },
  { name: "myhandy.online", website: "https://myhandy.online" },
  { name: "srbd.online", website: "https://srbd.online" },
  { name: "postman.1", website: "https://postman.com" },
  { name: "roby.bd", website: "https://roby.bd" },
  { name: "friendz.my", website: "https://friendz.my" },
  { name: "best1.aca", website: "https://best1.aca" },
  { name: "aanando.shop", website: "https://aanando.shop" },
  { name: "best1.ai", website: "https://best1.ai" },
  { name: "mbmosjid.com", website: "https://mbmosjid.com" },
];

const BrandSlider: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data } = useGetAllCompaniesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const displayBrands =
    data?.companies && data.companies.length > 0
      ? data.companies
      : defaultBrands;

  useEffect(() => {
    const handleScroll = () => {
      if (sentinelRef.current) {
        setIsSticky(sentinelRef.current.getBoundingClientRect().top <= 80);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderItems = () =>
    displayBrands.map((item: any, i: number) => {
      const href = item.website?.startsWith("http")
        ? item.website
        : `https://${item.website}`;

      return (
        <React.Fragment key={i}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-basic font-medium text-base sm:text-lg lg:text-xl whitespace-nowrap font-Poppins hover:text-blue-500 hover:underline transition-colors cursor-pointer"
          >
            {item.name}
          </a>
          {/* real shaped dot instead of a text glyph */}
          <span
            className="inline-block rounded-full bg-text-basic shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 opacity-60"
            aria-hidden="true"
          />
        </React.Fragment>
      );
    });

  return (
    <>
      <div
        ref={sentinelRef}
        className={isSticky ? "h-[80px]" : "h-0"}
      />
      <div
        className={`w-full h-[80px] flex items-center overflow-hidden border-y border-text-basic/10 backdrop-blur-md bg-white/80 dark:bg-background-Theme/80 ${
          isSticky
            ? "fixed top-[80px] left-0 z-40 shadow-xl"
            : "relative"
        }`}
      >
        <div className="flex items-center gap-14 marquee-track">
          <div className="flex items-center shrink-0 gap-14 marquee-content">
            {renderItems()}
          </div>
          <div className="flex items-center shrink-0 gap-14 marquee-content">
            {renderItems()}
          </div>
        </div>
        <style>{`
          .marquee-track {
            animation: marquee 60s linear infinite;
            width: fit-content;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </>
  );
};

export default BrandSlider;