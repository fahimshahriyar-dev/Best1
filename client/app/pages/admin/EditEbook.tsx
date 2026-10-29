"use client";
import React, { useState, useEffect } from "react";
import {
  useEditEbookMutation,
  useGetEbookDetailsQuery,
} from "../../../redux/features/ebook/ebookApi";
import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import { useGetAllEbookTagsQuery } from "../../../redux/features/tags/tagsApi";
import { useGetAllDiscountCouponsQuery } from "../../../redux/features/discountCoupon/discountCouponApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import Loader from "../../components/Loader";
import { IoClose } from "react-icons/io5";

type Props = {
  id: string;
};

const EditEbook: React.FC<Props> = ({ id }) => {
  const { data, isLoading: isFetching } = useGetEbookDetailsQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [editEbook, { isLoading: isEditing, isSuccess, error }] =
    useEditEbookMutation();
  const { data: categoriesData } = useGetHeroDataQuery("EbookCategories", {});
  const { data: tagsData } = useGetAllEbookTagsQuery(undefined, {});
  const { data: couponsData } = useGetAllDiscountCouponsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [couponSearch, setCouponSearch] = useState("");
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);

  const isDrafting = data?.ebook?.status === "drafting";

  const [ebookInfo, setEbookInfo] = useState({
    name: "",
    author: "",
    description: "",
    price: "",
    pdf: "",
    thumbnail: "",
    categories: "",
    ebookType: "",
    tags: [] as string[],
    discountCoupon: "",
    discountPercent: "",
    couponExpiry: "",
  });

  useEffect(() => {
    if (categoriesData?.layout?.categories) {
      setCategories(categoriesData.layout.categories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (tagsData?.tags) {
      setAllTags(tagsData.tags);
    }
  }, [tagsData]);

  useEffect(() => {
    if (couponsData?.coupons) {
      const activeCoupons = couponsData.coupons.filter((c: any) => {
        if (!c.isActive) return false;
        if (!c.expiryDate) return true;
        const today = new Date(new Date().toDateString());
        const expiry = new Date(c.expiryDate);
        return expiry >= today;
      });
      setCoupons(activeCoupons);
    }
  }, [couponsData]);

  const [dragging, setDragging] = useState(false);
  const [pdfDragging, setPdfDragging] = useState(false);

  useEffect(() => {
    if (data?.ebook) {
      setEbookInfo({
        name: data.ebook.name,
        author: data.ebook.author || "",
        description: data.ebook.description,
        categories: data.ebook.categories?._id || data.ebook.categories || "",
        ebookType: data.ebook.ebookType || "",
        tags: data.ebook.tags || [],
        price: data.ebook.price,
        discountCoupon: data.ebook.discountCoupon || "",
        discountPercent: data.ebook.discountPercent || "",
        couponExpiry: data.ebook.couponExpiry || "",
        pdf: data.ebook.pdfFile?.url || "",
        thumbnail: data.ebook.thumbnail?.url || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("E-Book updated successfully!");
      redirect("/admin/ebooks");
    }
    if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message || "Something went wrong.");
    }
  }, [isEditing, isSuccess, error]);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setEbookInfo({ ...ebookInfo, thumbnail: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a valid PDF file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setEbookInfo({ ...ebookInfo, pdf: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEbookInfo({ ...ebookInfo, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfDrop = (e: any) => {
    e.preventDefault();
    setPdfDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a valid PDF file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setEbookInfo({ ...ebookInfo, pdf: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any, status?: string) => {
    e.preventDefault();
    if (
      !ebookInfo.name ||
      !ebookInfo.author ||
      !ebookInfo.description ||
      !ebookInfo.price ||
      !ebookInfo.pdf ||
      !ebookInfo.thumbnail
    ) {
      toast.error(
        "Please fill all required fields, including the author, cover image and PDF file.",
      );
      return;
    }

    const submitData = {
      name: ebookInfo.name,
      author: ebookInfo.author,
      description: ebookInfo.description,
      categories: ebookInfo.categories,
      ebookType: ebookInfo.ebookType,
      tags: ebookInfo.tags,
      price: Number(ebookInfo.price),
      discountCoupon: ebookInfo.discountCoupon || undefined,
      discountPercent: ebookInfo.discountPercent
        ? Number(ebookInfo.discountPercent)
        : undefined,
      couponExpiry: ebookInfo.couponExpiry || undefined,
      pdf: ebookInfo.pdf,
      thumbnail: ebookInfo.thumbnail,
      ...(status ? { status } : {}),
    };

    await editEbook({ id, data: submitData });
  };

  const inputClass =
    "w-full bg-[#E6E6E6] dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-text-basic placeholder-gray-500 dark:placeholder-text-input outline-none focus:border-hover-text-1 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-text-basic mb-1.5";

  if (isFetching) return <Loader />;

  return (
    <div className="w-[92%] sm:w-[80%] mx-auto pt-20 sm:pt-24 pb-20">
      <h1 className="text-3xl font-bold text-center text-text-basic mb-10">
        Edit E-Book
      </h1>

      <form
        onSubmit={(e) => handleSubmit(e, isDrafting ? "pending" : undefined)}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div className="w-full sm:w-1/2">
            <label className={labelClass}>
              E-Book Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={ebookInfo.name}
              onChange={(e) =>
                setEbookInfo({ ...ebookInfo, name: e.target.value })
              }
              id="name"
              placeholder="e.g. Mastering Next.js"
              className={inputClass}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className={labelClass}>
              Author Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={ebookInfo.author}
              onChange={(e) =>
                setEbookInfo({ ...ebookInfo, author: e.target.value })
              }
              id="author"
              placeholder="e.g. John Doe"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            cols={30}
            rows={8}
            value={ebookInfo.description}
            onChange={(e) =>
              setEbookInfo({ ...ebookInfo, description: e.target.value })
            }
            id="description"
            placeholder="Write a detailed description of the e-book..."
            className={inputClass}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>E-Book Type</label>
            <select
              value={ebookInfo.ebookType}
              className={inputClass}
              onChange={(e) =>
                setEbookInfo({ ...ebookInfo, ebookType: e.target.value })
              }
            >
              <option value="">Select type</option>
              <option value="Certificate E-Book">Certificate E-Book</option>
              <option value="Academic E-Book">Academic E-Book</option>
              <option value="Religious E-Book">Religious E-Book</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>E-Book Category</label>
            <select
              value={ebookInfo.categories}
              className={inputClass}
              onChange={(e) =>
                setEbookInfo({ ...ebookInfo, categories: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((item: any) => (
                <option value={item._id} key={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full">
          <label className={labelClass}>E-Book Tags</label>
          <div className="relative">
            <input
              type="text"
              value={tagSearch}
              placeholder="Search and add tags..."
              className={inputClass}
              onChange={(e) => {
                setTagSearch(e.target.value);
                setShowTagDropdown(true);
              }}
              onFocus={() => setShowTagDropdown(true)}
              onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
            />
            {showTagDropdown && tagSearch && (
              <div className="absolute top-full left-0 right-0 bg-background-Card_1 border border-[#ffffff1a] rounded-xl mt-1 max-h-40 overflow-y-auto z-50 shadow-xl">
                {allTags
                  .filter(
                    (t: any) =>
                      t.title.toLowerCase().includes(tagSearch.toLowerCase()) &&
                      !ebookInfo.tags.includes(t.title),
                  )
                  .map((tag: any) => (
                    <div
                      key={tag._id}
                      className="px-4 py-2.5 hover:bg-hover-bg-1 cursor-pointer text-text-basic text-sm transition-all"
                      onMouseDown={() => {
                        setEbookInfo({
                          ...ebookInfo,
                          tags: [...ebookInfo.tags, tag.title],
                        });
                        setTagSearch("");
                        setShowTagDropdown(false);
                      }}
                    >
                      {tag.title}
                    </div>
                  ))}
                {allTags.filter(
                  (t: any) =>
                    t.title.toLowerCase().includes(tagSearch.toLowerCase()) &&
                    !ebookInfo.tags.includes(t.title),
                ).length === 0 && (
                  <div className="px-4 py-2.5 text-text-basic opacity-40 text-sm">
                    No tags found
                  </div>
                )}
              </div>
            )}
          </div>
          {ebookInfo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {ebookInfo.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-hover-text-1/20 text-text-basic rounded-full text-sm font-medium"
                >
                  {tag}
                  <IoClose
                    className="cursor-pointer hover:text-red-400 transition-colors"
                    size={16}
                    onClick={() => {
                      setEbookInfo({
                        ...ebookInfo,
                        tags: ebookInfo.tags.filter((t) => t !== tag),
                      });
                    }}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-5">
          <div className="w-full sm:w-1/2">
            <label className={labelClass}>
              Price (৳) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={ebookInfo.price}
              onChange={(e) =>
                setEbookInfo({ ...ebookInfo, price: e.target.value })
              }
              id="price"
              placeholder="e.g. 500"
              className={inputClass}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className={labelClass}>Discount Coupon</label>
            <div className="relative">
              <input
                type="text"
                value={couponSearch}
                placeholder="Search and select a coupon..."
                className={inputClass}
                onChange={(e) => {
                  setCouponSearch(e.target.value);
                  setShowCouponDropdown(true);
                }}
                onFocus={() => setShowCouponDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowCouponDropdown(false), 200)
                }
              />
              {showCouponDropdown && couponSearch && (
                <div className="absolute top-full left-0 right-0 bg-background-Card_1 border border-[#ffffff1a] rounded-xl mt-1 max-h-40 overflow-y-auto z-50 shadow-xl">
                  {coupons
                    .filter(
                      (c: any) =>
                        c.code
                          .toLowerCase()
                          .includes(couponSearch.toLowerCase()) &&
                        c.code !== ebookInfo.discountCoupon,
                    )
                    .map((c: any) => (
                      <div
                        key={c._id}
                        className="px-4 py-2.5 hover:bg-hover-bg-1 cursor-pointer text-text-basic text-sm transition-all"
                        onMouseDown={() => {
                          setEbookInfo({
                            ...ebookInfo,
                            discountCoupon: c.code,
                            discountPercent: c.discountPercent,
                            couponExpiry: c.expiryDate,
                          });
                          setCouponSearch("");
                          setShowCouponDropdown(false);
                        }}
                      >
                        {c.code} - {c.discountPercent}% off
                      </div>
                    ))}
                  {coupons.filter(
                    (c: any) =>
                      c.code
                        .toLowerCase()
                        .includes(couponSearch.toLowerCase()) &&
                      c.code !== ebookInfo.discountCoupon,
                  ).length === 0 && (
                    <div className="px-4 py-2.5 text-text-basic opacity-40 text-sm">
                      No coupons found
                    </div>
                  )}
                </div>
              )}
            </div>
            {ebookInfo.discountCoupon && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">
                  {ebookInfo.discountCoupon} — {ebookInfo.discountPercent}% OFF
                  <IoClose
                    className="cursor-pointer hover:text-red-400 transition-colors"
                    size={16}
                    onClick={() => {
                      setEbookInfo({
                        ...ebookInfo,
                        discountCoupon: "",
                        discountPercent: "",
                        couponExpiry: "",
                      });
                    }}
                  />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* PDF Upload */}
        <div className="w-full">
          <label className={labelClass}>
            E-Book PDF <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            id="pdf-file"
            className="hidden"
            onChange={handlePdfChange}
          />
          <label
            htmlFor="pdf-file"
            className={`w-full min-h-[150px] border-2 border-dashed border-white/40 hover:border-white/60 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${pdfDragging ? "bg-blue-500/10 border-blue-500" : "bg-transparent hover:bg-white/5"}`}
            onDragOver={(e) => {
              e.preventDefault();
              setPdfDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setPdfDragging(false);
            }}
            onDrop={handlePdfDrop}
          >
            {ebookInfo.pdf ? (
              <div className="text-center">
                <div className="bg-green-500/20 text-green-500 p-4 rounded-full mb-3 mx-auto w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-text-basic font-medium text-green-500">
                  PDF File Ready!
                </p>
                <p className="text-xs opacity-60 mt-1">
                  Click or drop to replace the current file
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-text-basic font-medium">
                  Drop your e-book PDF file here
                </p>
                <p className="text-xs opacity-40 mt-1">
                  or click to browse from files
                </p>
              </div>
            )}
          </label>
        </div>

        <div className="w-full">
          <label className={labelClass}>
            E-Book Cover (1410 x 2250) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`w-full min-h-[40vh] border-[#00000026] dark:border-white p-3 border flex items-center justify-center rounded-xl cursor-pointer ${
              dragging ? "bg-blue-500/10" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {ebookInfo.thumbnail ? (
              <img
                src={ebookInfo.thumbnail}
                alt="Cover"
                className="max-h-[500px] w-auto object-cover rounded-md"
              />
            ) : (
              <span className="text-text-basic dark:text-white">
                Drag and drop your cover image here or click to browse
              </span>
            )}
          </label>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
          {isDrafting && (
            <button
              type="button"
              disabled={isEditing}
              onClick={(e) => handleSubmit(e, "drafting")}
              className="w-full 800px:w-[200px] h-[50px] bg-background-Card_2 border border-[#ffffff1a] text-text-basic rounded-xl mt-8 flex items-center justify-center font-semibold cursor-pointer disabled:opacity-50"
            >
              {isEditing ? "Saving..." : "Save as Draft"}
            </button>
          )}
          <button
            type="submit"
            className="w-full 800px:w-[250px] h-[50px] bg-blue-600 text-center text-white rounded-xl mt-8 flex items-center justify-center font-semibold cursor-pointer disabled:opacity-50"
            disabled={isEditing}
          >
            {isEditing ? "Saving..." : isDrafting ? "Create" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEbook;
