"use client";
import React, { useEffect, useState } from "react";
import DataTableBox from "../components/DataTableBox";

const rows = Array.from({ length: 40 }).map((_, i) => ({
  _id: `id-${i}`,
  name: `User ${i}`,
  email: `user${i}@example.com`,
  role: "user",
  createdAt: new Date().toISOString(),
}));

const columns = [
  { key: "_id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "createdAt", header: "Created At" },
  { key: "a", header: "Extra A", render: () => "A" },
  { key: "b", header: "Extra B", render: () => "B" },
  { key: "c", header: "Extra C", render: () => "C" },
  { key: "d", header: "Extra D", render: () => "D" },
];

export default function Page() {
  const [metrics, setMetrics] = useState<Record<string, any>>({});

  useEffect(() => {
    const measure = () => {
      const scroll = document.querySelector(".table-scroll-x") as HTMLElement;
      const box = scroll?.parentElement as HTMLElement;
      const card = box?.parentElement as HTMLElement;
      const inner = card?.parentElement as HTMLElement;
      const root = inner?.parentElement as HTMLElement;
      const content = root?.parentElement as HTMLElement;
      const m: Record<string, any> = {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
      };
      const add = (name: string, el?: HTMLElement | null) => {
        if (!el) return;
        const cs = getComputedStyle(el);
        m[name] = {
          clientH: el.clientHeight,
          scrollH: el.scrollHeight,
          clientW: el.clientWidth,
          scrollW: el.scrollWidth,
          overflowX: cs.overflowX,
          overflowY: cs.overflowY,
          height: cs.height,
        };
      };
      add("root", root);
      add("content", content);
      add("inner", inner);
      add("card", card);
      add("box", box);
      add("scroll", scroll);
      setMetrics(m);
    };
    const t = setTimeout(measure, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <pre id="metrics" style={{ display: "none" }}>
        {JSON.stringify(metrics)}
      </pre>
      <div className="flex h-screen overflow-hidden">
        <div className="w-0 lg:w-[220px] xl:w-[250px] 2xl:w-[280px] bg-black shrink-0">
          <div className="fixed left-0 top-0 h-screen w-[220px] bg-green-700 text-white z-[120]">
            SIDEBAR
          </div>
        </div>
        <div className="w-full lg:w-[calc(100%-220px)] xl:w-[calc(100%-250px)] 2xl:w-[calc(100%-280px)] transition-all duration-300 h-screen overflow-y-auto">
          <div className="w-full flex items-center justify-end p-3 sm:p-6 fixed top-0 right-0 z-30 bg-[#F8F9FA]/90 dark:bg-background-Theme/80 backdrop-blur-md border-b border-black/5 dark:border-[#ffffff1a]">
            HEADER
          </div>
          <div className="bg-background-Theme pt-16 sm:pt-20 lg:pt-24 px-3 sm:px-6 lg:px-8 pb-3 sm:pb-5 h-screen flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-background-Card_1 border border-text-basic/10 flex items-center justify-center text-text-basic flex-shrink-0 shadow-sm">
                  ICON
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-basic leading-tight">
                    All Users
                  </h1>
                  <p className="text-xs sm:text-sm text-text-basic opacity-50 mt-0.5">
                    View and manage all registered users
                  </p>
                </div>
              </div>
            </div>
            <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden flex-1 flex flex-col min-h-0">
                <DataTableBox
                  data={rows}
                  columns={columns}
                  filters={{
                    role: { type: "text", options: ["admin", "user"] },
                    createdAt: { type: "date" },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
