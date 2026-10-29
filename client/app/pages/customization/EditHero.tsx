import Blob from "@/app/components/animation/Blob";
import {
    useEditLayoutMutation,
    useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoCamera } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const EditHero: FC = () => {
    const [image, setImage] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [subTitle, setSubTitle] = useState<string>("");
    const [isTitleEditable, setIsTitleEditable] = useState(false);
    const [isSubTitleEditable, setIsSubTitleEditable] = useState(false);

    const { data, refetch } = useGetHeroDataQuery("Banner", {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout] = useEditLayoutMutation();

    useEffect(() => {
        if (data?.layout?.banner) {
            setTitle(data.layout.banner.title ?? "");
            setSubTitle(data.layout.banner.subTitle ?? "");
            setImage(
                data.layout.banner.image?.url ?? "/assets/default-banner.jpg"
            );
        }
    }, [data]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    setImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await editLayout({
                type: "Banner",
                image,
                title,
                subTitle,
            }).unwrap();

            toast.success(response.message || "Hero updated successfully!");
            refetch();
            setIsTitleEditable(false);
            setIsSubTitleEditable(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong!");
        }
    };

    const handleCancelEdit = () => {
        // Revert to the original data when canceling
        if (data?.layout?.banner) {
            setTitle(data.layout.banner.title ?? "");
            setSubTitle(data.layout.banner.subTitle ?? "");
        }
        setIsTitleEditable(false);
        setIsSubTitleEditable(false);
    };

    // Define a state to track if any changes have been made
    const [hasChanges, setHasChanges] = useState(false);

    // Update hasChanges whenever title, subTitle, or image changes
    useEffect(() => {
        if (data?.layout?.banner) {
            setHasChanges(
                data.layout.banner.title !== title ||
                data.layout.banner.subTitle !== subTitle ||
                data.layout.banner.image?.url !== image
            );
        }
    }, [title, subTitle, image, data]);

    return (
        <div className="w-full flex flex-col 1000px:flex-row items-center bg-background-Theme">
            {/* Image Upload Section */}
            <div className="w-full 1000px:w-[40%] flex justify-center 1000px:justify-end items-center ml-0 1000px:ml-[120px] pt-[70px] 1000px:pt-0 z-10 relative">
                <div className="relative w-[800px] max-w-full aspect-square">
                    <Blob />
                    <img
                        src={image}
                        alt="Banner"
                        className="absolute inset-0 w-[calc(70%_-_130px)] h-[calc(70%_-_130px)] m-auto object-contain z-10"
                    />
                    <label
                        htmlFor="banner"
                        className="absolute bottom-0 right-0 z-20 bg-button-btn_6 hover:bg-hover-bg-2 p-2 rounded-full cursor-pointer"
                    >
                        <IoCamera className="text-white text-2xl" />
                    </label>
                </div>
                <input
                    type="file"
                    id="banner"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Text Edit Section */}
            <div className="1000px:w-[60%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left mt-[50px] 1000px:mt-0 1000px:pr-20">
                <div className="flex items-end w-full border-b border-b-text-basic mb-8">
                    <textarea
                        rows={2}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Hero Title"
                        className="text-text-basic bg-transparent resize-none text-[30px] w-full h-full 1000px:text-[50px] font-semibold focus:outline-none"
                        readOnly={!isTitleEditable}
                    />
                    {isTitleEditable ? (
                        <RxCross2
                            className="text-white text-2xl font-extrabold bg-red-500 rounded-full w-[30px] h-[30px] p-[6px] mb-3 cursor-pointer"
                            onClick={handleCancelEdit}
                        />
                    ) : (
                        <MdEdit
                            className="text-white text-2xl bg-button-btn_6 hover:bg-hover-bg-2 rounded-full w-[30px] h-[30px] p-[6px] mb-3 cursor-pointer"
                            onClick={() => setIsTitleEditable(!isTitleEditable)}
                        />
                    )}
                </div>
                <div className="flex items-end w-full border-b border-b-text-basic">
                    <textarea
                        rows={2}
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                        placeholder="Enter Hero Subtitle"
                        className="text-text-basic bg-transparent resize-none font-Josefin font-semibold text-[18px] w-full focus:outline-none mt-4"
                        readOnly={!isSubTitleEditable}
                    />
                    {isSubTitleEditable ? (
                        <RxCross2
                            className="text-white text-2xl bg-red-500 rounded-full w-[30px] h-[30px] p-[6px] mb-3 cursor-pointer"
                            onClick={handleCancelEdit}
                        />
                    ) : (
                        <MdEdit
                            className="text-white text-2xl bg-button-btn_6 hover:bg-hover-bg-2 rounded-full w-[30px] h-[30px] p-[6px] mb-3 cursor-pointer"
                            onClick={() => setIsSubTitleEditable(!isSubTitleEditable)}
                        />
                    )}
                </div>

                <div
                    className={`button !w-[100px] !min-h-[40px] !h-[40px] text-white bg-button-btn_disable ${
                        hasChanges ? "!cursor-pointer !bg-button-btn_enable" : "!cursor-not-allowed"
                    } !rounded absolute bottom-12 right-12`}
                    onClick={hasChanges ? handleEdit : () => null}
                >
                    Save
                </div>
            </div>
        </div>
    );
};

export default EditHero;