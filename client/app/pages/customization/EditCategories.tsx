import Loader from "@/app/components/Loader";
import {
    useEditLayoutMutation,
    useGetHeroDataQuery,
} from "../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// icons
import { HiMiniPlusCircle } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

type Props = {
    categoryType?: string;
};

const labels: Record<string, { title: string; desc: string }> = {
    Categories: { title: "Course Categories", desc: "Manage the course categories displayed on your platform" },
    EbookCategories: { title: "E-Book Categories", desc: "Manage the e-book categories displayed on your platform" },
};

const EditCategories = ({ categoryType = "Categories" }: Props) => {
    const { data, isLoading, refetch } = useGetHeroDataQuery(categoryType, {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout, { isSuccess: layoutSuccess, error }] =
        useEditLayoutMutation();
    const [categories, setCategories] = useState<any>([]);
    const current = labels[categoryType] || labels.Categories;

    useEffect(() => {
        if (data?.layout?.categories) {
            setCategories(data.layout.categories);
        }

        if (layoutSuccess) {
            refetch();
            toast.success(`${current.title} updated successfully!`);
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [data, layoutSuccess, error]);

    const handleAddCategory = (id: any, value: string) => {
        setCategories((prevCategories: any) =>
            prevCategories.map((i: any) =>
                i._id === id ? { ...i, title: value } : i
            )
        );
    };

    const newCategoriesHandler = () => {
        if (
            categories.length > 0 &&
            categories[categories.length - 1].title === ""
        ) {
            toast.error("Category title is required.");
        } else {
            setCategories((prevCategory: any) => [
                ...prevCategory,
                { _id: Date.now(), title: "" },
            ]);
        }
    };

    const areCategoriesUnchanged = (
        originalCategories: any[],
        newCategories: any[]
    ) => {
        return (
            JSON.stringify(originalCategories) === JSON.stringify(newCategories)
        );
    };

    const isAnyCategoryTitleEmpty = (categories: any[]) => {
        return categories.some((q) => q.title === "");
    };

    const editCategoriesHandler = async () => {
        if (
            !areCategoriesUnchanged(
                data?.layout?.categories || [],
                categories
            ) &&
            !isAnyCategoryTitleEmpty(categories)
        ) {
            await editLayout({
                type: categoryType,
                categories,
            });
        }
    };

    return (
        <div className="w-full flex-1 flex flex-col h-full min-h-0">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full flex-1 flex flex-col h-full min-h-0">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-background-Card_1 p-5 rounded-xl border border-text-basic/10 shadow-sm shrink-0">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-text-basic tracking-tight">
                                {current.title}
                            </h1>
                            <p className="text-xs sm:text-sm opacity-60 mt-0.5">
                                {current.desc}
                            </p>
                        </div>
                        <button 
                            onClick={newCategoriesHandler}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm flex items-center gap-2 active:scale-95 shrink-0"
                        >
                            <HiMiniPlusCircle size={18} />
                            Add Category
                        </button>
                    </div>

                    {/* Scrollable Categories Grid Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2 min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {categories &&
                                categories.map((item: any) => (
                                    <div
                                        key={item._id}
                                        className="bg-background-Card_1 px-4 py-3 rounded-xl border border-text-basic/10 shadow-sm flex items-center gap-3 transition-all duration-200 hover:border-text-basic/25 group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <input
                                                placeholder="Category title..."
                                                value={item.title}
                                                className="w-full bg-transparent text-sm sm:text-base font-semibold text-text-basic outline-none placeholder:opacity-40"
                                                onChange={(e: any) =>
                                                    handleAddCategory(item._id, e.target.value)
                                                }
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCategories((prevCategories: any) =>
                                                    prevCategories.filter((i: any) => i._id !== item._id)
                                                );
                                            }}
                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0"
                                            title="Delete"
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    </div>
                                ))}
                        </div>

                        {categories.length === 0 && (
                            <div className="text-center py-16 bg-background-Card_1 rounded-xl border border-dashed border-text-basic/20">
                                <p className="text-sm opacity-50 italic">No categories yet. Click &quot;Add Category&quot; to create your first one.</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Save Bar (Docked at bottom, data cannot overlap or cross it) */}
                    <div className="pt-3 pb-2 flex justify-end shrink-0 z-10 border-t border-text-basic/5">
                        <button
                            onClick={
                                areCategoriesUnchanged(data?.layout?.categories || [], categories) || 
                                isAnyCategoryTitleEmpty(categories) 
                                ? () => null 
                                : editCategoriesHandler
                            }
                            disabled={
                                areCategoriesUnchanged(data?.layout?.categories || [], categories) || 
                                isAnyCategoryTitleEmpty(categories)
                            }
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center gap-2 ${
                                !areCategoriesUnchanged(data?.layout?.categories || [], categories) && 
                                !isAnyCategoryTitleEmpty(categories)
                                ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer hover:scale-105 active:scale-95 shadow-blue-500/30' 
                                : 'bg-black/10 dark:bg-white/5 text-text-basic/30 cursor-not-allowed'
                            }`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCategories;
