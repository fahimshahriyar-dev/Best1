"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { MdDelete, MdEdit } from "react-icons/md";
import Loader from "@/app/components/Loader";
import {
    useGetAllEbookTagsQuery,
    useCreateEbookTagMutation,
    useUpdateEbookTagMutation,
    useDeleteEbookTagMutation,
} from "@/redux/features/tags/tagsApi";

type Props = {};

const EbookTags = (props: Props) => {
    const { data, isLoading, refetch } = useGetAllEbookTagsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [createTag, { isSuccess: createSuccess, error: createError }] = useCreateEbookTagMutation();
    const [updateTag, { isSuccess: updateSuccess, error: updateError }] = useUpdateEbookTagMutation();
    const [deleteTag, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteEbookTagMutation();

    const [tags, setTags] = useState<any[]>([]);
    const [newTagTitle, setNewTagTitle] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");

    useEffect(() => {
        if (data?.tags) {
            setTags(data.tags);
        }
    }, [data]);

    useEffect(() => {
        if (createSuccess) {
            toast.success("Tag created successfully!");
            setNewTagTitle("");
            refetch();
        }
        if (updateSuccess) {
            toast.success("Tag updated successfully!");
            setEditingId(null);
            setEditingTitle("");
            refetch();
        }
        if (deleteSuccess) {
            toast.success("Tag deleted successfully!");
            refetch();
        }
    }, [createSuccess, updateSuccess, deleteSuccess]);

    useEffect(() => {
        const err = createError || updateError || deleteError;
        if (err) {
            if ("data" in err) {
                const errorData = err as any;
                toast.error(errorData?.data?.message || "Something went wrong");
            }
        }
    }, [createError, updateError, deleteError]);

    const handleCreate = async () => {
        if (!newTagTitle.trim()) {
            toast.error("Tag title is required.");
            return;
        }
        await createTag({ title: newTagTitle.trim() });
    };

    const handleUpdate = async (id: string) => {
        if (!editingTitle.trim()) {
            toast.error("Tag title is required.");
            return;
        }
        await updateTag({ id, title: editingTitle.trim() });
    };

    const handleDelete = async (id: string) => {
        await deleteTag(id);
    };

    const startEditing = (tag: any) => {
        setEditingId(tag._id);
        setEditingTitle(tag.title);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingTitle("");
    };

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full">
                    <div className="flex justify-between items-center mb-5 bg-background-Card_1 p-4 sm:p-5 rounded-xl border border-text-basic/10 shadow-sm">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-basic">
                                E-Book Tags
                            </h1>
                            <p className="text-xs sm:text-sm opacity-60 mt-0.5">
                                Manage the tags that can be assigned to e-books
                            </p>
                        </div>
                    </div>

                    <div className="bg-background-Card_1 p-4 sm:p-5 rounded-xl border border-text-basic/10 shadow-sm mb-5">
                        <div className="flex items-center gap-3">
                            <input
                                placeholder="Enter new tag title..."
                                value={newTagTitle}
                                onChange={(e) => setNewTagTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                className="flex-1 bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-3.5 py-2.5 text-sm text-text-basic outline-none focus:ring-2 focus:ring-blue-500/30 placeholder:opacity-40"
                            />
                            <button
                                onClick={handleCreate}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm shadow-blue-500/20 flex items-center gap-2 active:scale-95 whitespace-nowrap"
                            >
                                <HiMiniPlusCircle size={18} />
                                Add Tag
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {tags.map((tag: any) => (
                            <div
                                key={tag._id}
                                className="bg-background-Card_1 px-4 py-3 rounded-xl border border-text-basic/10 shadow-sm flex items-center gap-3 transition-all duration-200 hover:ring-2 hover:ring-blue-500/20 group"
                            >
                                {editingId === tag._id ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleUpdate(tag._id);
                                                if (e.key === "Escape") cancelEditing();
                                            }}
                                            className="flex-1 bg-background-bar_2/40 dark:bg-white/5 border border-text-basic/10 rounded-lg px-2.5 py-1.5 text-sm text-text-basic outline-none focus:ring-2 focus:ring-blue-500/30"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdate(tag._id)}
                                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all text-xs font-semibold"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="px-2.5 py-1.5 rounded-lg bg-text-basic/5 text-text-basic hover:bg-text-basic/10 transition-all text-xs"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm sm:text-base font-semibold text-text-basic truncate">
                                                {tag.title}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => startEditing(tag)}
                                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 opacity-0 group-hover:opacity-100 hover:bg-blue-500 hover:text-white transition-all flex-shrink-0"
                                        >
                                            <MdEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tag._id)}
                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {tags.length === 0 && (
                        <div className="text-center py-16 bg-background-Card_1 rounded-xl border border-dashed border-text-basic/20">
                            <p className="text-sm opacity-40 italic">No tags yet. Add your first e-book tag above.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EbookTags;
