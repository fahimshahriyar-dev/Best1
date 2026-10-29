import React, { useState, useMemo, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";

interface Column {
    key: string;
    header: string;
    render?: (item: any) => React.ReactNode;
}

interface DataTableBoxProps<T> {
    data: T[];
    columns: Column[];
    filters?: {
        [key: string]: {
            type: "text" | "date";
            options?: string[];
        };
    };
    hideTopBar?: boolean;
    headerAction?: React.ReactNode;
}

const DataTableBox = <T,>({ data, columns, filters, hideTopBar, headerAction }: DataTableBoxProps<T>) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValues, setFilterValues] = useState<{ [key: string]: string }>(
        {}
    );
    const [filterOptions, setFilterOptions] = useState<{
        [key: string]: string[];
    }>({});
    const [sortedData, setSortedData] = useState<T[]>(data);

    // Extract unique filter options for text filters
    useMemo(() => {
        if (filters && data) {
            const newFilterOptions: { [key: string]: string[] } = {};
            for (const filterKey in filters) {
                if (filters[filterKey].type === "text") {
                    const uniqueValues = filters[filterKey].options || [
                        ...new Set(
                            data
                                .map((item) => (item as any)[filterKey])
                                .filter(Boolean)
                        ),
                    ];
                    newFilterOptions[filterKey] = [
                        "",
                        ...(uniqueValues as string[]),
                    ];
                } else {
                    newFilterOptions[filterKey] = [""];
                }
            }
            setFilterOptions(newFilterOptions);
        } else {
            setFilterOptions({});
        }
    }, [data, filters]);

    // Filtered data based on search term and multiple filter values
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const searchableText = Object.values(item).join(" ").toLowerCase();
            const searchMatch = searchTerm
                ? searchableText.includes(searchTerm.toLowerCase())
                : true;

            let allFiltersMatch = true;
            if (filters) {
                for (const filterKey in filters) {
                    const filterConfig = filters[filterKey];
                    const filterValue = filterValues[filterKey];
                    const itemValue = (item as any)[filterKey];

                    if (filterConfig.type === "text") {
                        if (
                            filterValue &&
                            itemValue?.toString().toLowerCase() !==
                                filterValue.toLowerCase()
                        ) {
                            allFiltersMatch = false;
                            break;
                        }
                    }
                }
            }

            return searchMatch && allFiltersMatch;
        });
    }, [data, searchTerm, filterValues, filters]);

    // Sort the filtered data based on the date filter
    useEffect(() => {
        const newData = [...filteredData];
        if (filters?.createdAt?.type === "date" && filterValues.createdAt) {
            newData.sort((a, b) => {
                const dateA = new Date((a as any).createdAt).getTime();
                const dateB = new Date((b as any).createdAt).getTime();
                if (filterValues.createdAt === "first") {
                    return dateA - dateB; // Oldest to newest
                } else if (filterValues.createdAt === "last") {
                    return dateB - dateA;
                }
                return 0;
            });
        }
        setSortedData(newData);
    }, [filteredData, filterValues.createdAt, filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-3 sm:p-4 bg-background-Card_1 rounded-2xl flex flex-col h-full">
            {!hideTopBar && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 flex-shrink-0">
                    {/* search bar */}
                    <div className="relative w-full md:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border rounded-xl p-2.5 pr-10 w-full bg-background-bar_2 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IoIosSearch className="absolute text-[22px] right-3 top-1/2 -translate-y-1/2 text-text-input pointer-events-none"/>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {headerAction && headerAction}
                        <div className="flex flex-wrap items-center gap-2">
                        {filters &&
                            Object.entries(filters).map(([filterKey, config]) => (
                                <div key={filterKey} className="flex-1 sm:flex-none">
                                    <select
                                        id={`filter-${filterKey}`}
                                        className="w-full sm:w-auto h-[38px] border rounded-xl px-2.5 bg-background-bar_2 outline-none text-xs sm:text-sm cursor-pointer"
                                        value={filterValues[filterKey] || ""}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                filterKey,
                                                e.target.value
                                            )
                                        }
                                    >
                                        {config.type === "text" &&
                                            filterOptions[filterKey]?.map(
                                                (option) => (
                                                    <option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option ||
                                                            `All ${filterKey
                                                                .replace(
                                                                    /([A-Z])/g,
                                                                    " $1"
                                                                )
                                                                .trim()}`}
                                                    </option>
                                                )
                                            )}
                                        {config.type === "date" && (
                                            <>
                                                <option value="">Date</option>
                                                <option value="first">
                                                    First Created
                                                </option>
                                                <option value="last">
                                                    Last Created
                                                </option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="overflow-x-scroll overflow-y-auto flex-1 custom-scrollbar table-scroll-x">
                <table className="table-auto min-w-[700px] w-full">
                    <thead className="sticky top-0 z-10 bg-background-Card_1">
                        <tr className="bg-background-bar_1">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-2 text-left whitespace-nowrap"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <tr
                                key={index}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-2 whitespace-nowrap">
                                        {column.render
                                            ? column.render(item)
                                            : (item as any)[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {sortedData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTableBox;
