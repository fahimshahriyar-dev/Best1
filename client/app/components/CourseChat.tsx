"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { useSendCourseMessageMutation, useDeleteCourseMessageMutation, useEditCourseMessageMutation } from "@/redux/features/courses/coursesApi";
import { MdSend, MdMic, MdImage, MdVideoLibrary, MdClose, MdStop, MdDelete, MdArrowBack, MdPeople, MdPhotoLibrary, MdMoreVert, MdOutlineModeEdit } from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { extractLinks } from "../utils/linkExtractor";
import toast from "react-hot-toast";
import Image from "next/image";
import { socketId } from "../utils/socket";
import { useRouter } from "next/navigation";

type Props = {
    courseId: string;
    user: any;
    messages: any[];
    refetch: () => void;
    enrolled?: any[];
    teachers?: any[];
    courseName?: string;
};

const CourseChat: FC<Props> = ({ courseId, user, messages, refetch, enrolled = [], teachers = [], courseName }) => {
    const router = useRouter();
    useEffect(() => {
        socketId.on("newCourseMessage", (data: any) => {
            if (data.courseId === courseId) {
                refetch();
            }
        });

        socketId.on("updateCourse", (data: any) => {
            if (data.courseId === courseId) {
                refetch();
            }
        });

        socketId.on("updateUserRole", () => {
            refetch();
        });

        return () => {
            socketId.off("newCourseMessage");
            socketId.off("updateCourse");
            socketId.off("updateUserRole");
        };
    }, [courseId, refetch]);

    const isAdmin = user?.role === "superadmin" || user?.role === "admin" || user?.role === "moderator" || user?.role === "teacher";
    const [text, setText] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [video, setVideo] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [sendMessage, { isSuccess, error, isLoading }] = useSendCourseMessageMutation();
    const [deleteMessage] = useDeleteCourseMessageMutation();
    const [editMessage] = useEditCourseMessageMutation();
    const [showInfo, setShowInfo] = useState(false);
    const [activeTab, setActiveTab] = useState<"media" | "members">("media");
    const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);
    const [showTimeForMsgId, setShowTimeForMsgId] = useState<string | null>(null);
    const hoverTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Extract media
    const media = messages.filter((m) => m.image || m.video);

    // Extract links
    const links = messages.reduce((acc: string[], m) => {
        if (m.text) {
            const extracted = extractLinks(m.text);
            if (extracted) acc.push(...extracted);
        }
        return acc;
    }, []);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleEdit = (msg: any) => {
        setText(msg.text);
        setEditingMsgId(msg._id);
        setActiveMenuMsgId(null);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const submitEdit = async () => {
        if (!editingMsgId || !text.trim()) return;
        try {
            await editMessage({ id: courseId, messageId: editingMsgId, text }).unwrap();
            setEditingMsgId(null);
            setText("");
            toast.success("Message updated");
        } catch (err) {
            toast.error("Failed to update message");
        }
    };

    const handleDelete = async (messageId: string) => {
        setDeleteConfirmId(messageId);
        setActiveMenuMsgId(null);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await deleteMessage({ id: courseId, messageId: deleteConfirmId }).unwrap();
            setDeleteConfirmId(null);
            toast.success("Message unsent");
        } catch (err) {
            toast.error("Failed to unsend message");
        }
    };

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isSuccess) {
            setText("");
            setImage(null);
            setVideo(null);
            setAudioBlob(null);
            setAudioUrl(null);
            refetch();
            toast.success("Message sent!");
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error, refetch]);

    const handleSendMessage = async () => {
        if (!text && !image && !video && !audioUrl) return;

        if (editingMsgId) {
            await submitEdit();
            return;
        }

        const data: any = { id: courseId };
        if (text) data.text = text;
        if (image) data.image = image;
        if (video) data.video = video;

        if (audioUrl && audioBlob) {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = reader.result as string;
                try {
                    await sendMessage({ ...data, voice: base64Audio }).unwrap();
                    setAudioBlob(null);
                    setAudioUrl(null);
                } catch (err) {
                    toast.error("Failed to send voice message");
                }
            };
        } else {
            await sendMessage(data);
        }
    };

    const handleFileChange = (e: any, type: "image" | "video") => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    if (type === "image") setImage(reader.result as string);
                    if (type === "video") setVideo(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            toast.error("Microphone access denied or error occurred");
            console.error(err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    return (
        <div className="flex flex-col h-[85vh] bg-background-Card_1 rounded-xl shadow-2xl overflow-hidden border border-border-basic">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-basic bg-background-Card_1">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-hover-bg-1 rounded-full transition-all text-text-basic group"
                        title="Go Back"
                    >
                        <MdArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-hover-bg-1 flex items-center justify-center text-text-basic font-bold shadow-inner">
                        {courseName?.charAt(0) || "C"}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-text-basic">{courseName || "Course Chat"}</h2>
                        <p className="text-[10px] text-text-basic opacity-50 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Discussion
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`p-2 rounded-full transition-all ${showInfo ? 'bg-hover-bg-1 text-text-basic shadow-md' : 'hover:bg-hover-bg-1/20 text-text-basic'}`}
                    title="Chat Info"
                >
                    <HiOutlineInformationCircle size={24} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Messages Display */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="flex-center h-full text-text-basic opacity-50">
                                No messages in this course yet.
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`flex flex-col ${msg.adminId === user?._id ? "items-end" : "items-start"}`}>
                                    <p className="text-xs font-bold opacity-70 mb-1">{msg.adminName}</p>
                                    <div className={`flex items-start gap-1 group`}>
                                        {msg.adminId === user?._id && (
                                            <div className="relative mt-1 order-first">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setActiveMenuMsgId(activeMenuMsgId === msg._id ? null : msg._id)}
                                                        className="p-1 rounded hover:bg-black/10"
                                                    >
                                                        <MdMoreVert size={18} />
                                                    </button>
                                                </div>
                                                {activeMenuMsgId === msg._id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setActiveMenuMsgId(null)} />
                                                        <div className="absolute right-full mr-1 top-0 z-50 bg-background-Card_1 border border-border-basic rounded-xl shadow-2xl overflow-hidden min-w-[140px]">
                                                            <button
                                                                onClick={() => handleEdit(msg)}
                                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-basic hover:bg-hover-bg-1 transition-colors"
                                                            >
                                                                <MdOutlineModeEdit size={16} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(msg._id)}
                                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-message-error hover:bg-hover-bg-1 transition-colors"
                                                            >
                                                                <MdDelete size={16} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <div>
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl relative ${msg.adminId === user?._id ? "bg-hover-bg-1 text-text-basic rounded-tr-none" : "bg-background-Theme text-text-basic rounded-tl-none border border-border-basic"}`}
                                                onMouseEnter={() => {
                                                    const timer = setTimeout(() => {
                                                        setShowTimeForMsgId(msg._id);
                                                    }, 2000);
                                                    hoverTimers.current.set(msg._id, timer);
                                                }}
                                                onMouseLeave={() => {
                                                    const timer = hoverTimers.current.get(msg._id);
                                                    if (timer) {
                                                        clearTimeout(timer);
                                                        hoverTimers.current.delete(msg._id);
                                                    }
                                                    setShowTimeForMsgId((prev) => prev === msg._id ? null : prev);
                                                }}
                                            >
                                                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}

                                                {msg.image && (
                                                    <div className="mt-2 rounded-lg overflow-hidden border border-border-basic">
                                                        <Image src={msg.image.url} alt="Shared" width={400} height={300} layout="responsive" objectFit="cover" />
                                                    </div>
                                                )}

                                                {msg.video && (
                                                    <div className="mt-2 rounded-lg overflow-hidden border border-border-basic">
                                                        <video src={msg.video.url} controls className="w-full" />
                                                    </div>
                                                )}

                                                {msg.voice && (
                                                    <div className="mt-2">
                                                        <audio src={msg.voice} controls className="h-8 w-full min-w-[200px]" />
                                                    </div>
                                                )}

                                                {/* Timestamp on 3s hover */}
                                                {showTimeForMsgId === msg._id && (
                                                    <p className="text-[10px] text-right mt-1 opacity-50">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Admin/User Input Area */}
                    {isAdmin ? (
                        <div className="p-4 bg-background-Theme border-t border-border-basic">
                            {/* Media Preview */}
                            {(image || video || audioUrl) && (
                                <div className="mb-3 p-2 bg-background-Card_1 rounded-lg flex items-center gap-3 relative">
                                    {image && <Image src={image} alt="Preview" width={50} height={50} className="rounded object-cover" />}
                                    {video && <video src={video} className="w-[50px] h-[50px] rounded object-cover" />}
                                    {audioUrl && <audio src={audioUrl} controls className="h-8" />}
                                    <button onClick={() => { setImage(null); setVideo(null); setAudioUrl(null); }} className="absolute -top-2 -right-2 bg-message-error text-white rounded-full p-1 shadow-lg">
                                        <MdClose size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-end gap-2">
                                <div className="flex gap-1 mb-1">
                                    <label className="cursor-pointer p-2 hover:bg-hover-bg-1 rounded-full transition-colors text-text-basic" title="Upload Image">
                                        <MdImage size={24} />
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "image")} />
                                    </label>
                                    <label className="cursor-pointer p-2 hover:bg-hover-bg-1 rounded-full transition-colors text-text-basic" title="Upload Video">
                                        <MdVideoLibrary size={24} />
                                        <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, "video")} />
                                    </label>
                                    {isRecording ? (
                                        <button onClick={stopRecording} className="p-2 bg-message-error text-white rounded-full animate-pulse" title="Stop Recording">
                                            <MdStop size={24} />
                                        </button>
                                    ) : (
                                        <button onClick={startRecording} className="p-2 hover:bg-hover-bg-1 rounded-full transition-colors text-text-basic" title="Record Voice">
                                            <MdMic size={24} />
                                        </button>
                                    )}
                                </div>

                                <textarea
                                    ref={inputRef}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={editingMsgId ? "Edit your message..." : "Type a message..."}
                                    className="flex-1 bg-background-Card_1 text-text-basic rounded-2xl p-3 px-4 outline-none border border-border-basic resize-none max-h-32 text-sm"
                                    rows={1}
                                />

                                {editingMsgId && (
                                    <button
                                        onClick={() => { setEditingMsgId(null); setText(""); }}
                                        className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all mb-1"
                                        title="Cancel edit"
                                    >
                                        <MdClose size={24} />
                                    </button>
                                )}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || (!text && !image && !video && !audioUrl)}
                                    className={`p-3 rounded-full transition-all ${isLoading ? "bg-gray-500" : editingMsgId ? "bg-green-500 hover:scale-110 active:scale-95" : "bg-hover-bg-1 hover:scale-110 active:scale-95"} text-white mb-1 shadow-lg`}
                                >
                                    {editingMsgId ? <MdOutlineModeEdit size={24} /> : <MdSend size={24} />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-background-Theme border-t border-border-basic text-center">
                            <p className="text-text-basic opacity-70 italic font-Poppins text-sm">
                                you are not allowed to send message here
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Panel - Media & Members Tabs */}
                {showInfo && (
                    <div className="w-80 border-l border-border-basic bg-background-Card_1 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl z-10">
                        {/* Tab Header */}
                        <div className="flex border-b border-border-basic bg-background-Theme/30">
                            <button
                                onClick={() => setActiveTab("media")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${activeTab === "media" ? "bg-background-Card_1 text-text-basic border-b-2 border-hover-bg-1" : "text-text-basic opacity-50 hover:opacity-80"}`}
                            >
                                <MdPhotoLibrary size={18} />
                                Media
                            </button>
                            <button
                                onClick={() => setActiveTab("members")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${activeTab === "members" ? "bg-background-Card_1 text-text-basic border-b-2 border-hover-bg-1" : "text-text-basic opacity-50 hover:opacity-80"}`}
                            >
                                <MdPeople size={18} />
                                Members
                            </button>
                        </div>

                        {/* Media Tab */}
                        {showInfo && activeTab === "media" && (
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-background-Theme/20">
                                {media.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {media.map((m, i) => (
                                            <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border border-border-basic bg-background-Theme shadow-sm hover:shadow-md transition-shadow">
                                                {m.image ? (
                                                    <Image src={m.image.url} alt="Media" layout="fill" objectFit="cover" className="group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <video src={m.video.url} className="w-full h-full object-cover" />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <a href={m.image?.url || m.video?.url} target="_blank" rel="noreferrer" className="text-white text-[10px] bg-black/60 px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors">View</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-50 text-sm">
                                        <MdImage size={40} className="mb-2" />
                                        <p>No media shared yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Members Tab */}
                        {showInfo && activeTab === "members" && (
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-background-Theme/20">
                                <h4 className="text-sm font-bold text-text-basic mb-3">Teachers ({teachers?.length || 0})</h4>
                                <div className="space-y-2 mb-6">
                                    {teachers?.map((t, i) => (
                                        <div key={i} className="flex items-center gap-2 text-text-basic text-sm">
                                            <div className="w-8 h-8 rounded-full bg-hover-bg-1 flex items-center justify-center text-xs font-bold">
                                                {(t.name?.charAt(0) || t?.charAt(0) || "T")}
                                            </div>
                                            <span>{t.name || t}</span>
                                        </div>
                                    ))}
                                </div>
                                <h4 className="text-sm font-bold text-text-basic mb-3">Students ({enrolled?.length || 0})</h4>
                                <div className="space-y-2">
                                    {enrolled?.map((s, i) => (
                                        <div key={i} className="flex items-center gap-2 text-text-basic text-sm">
                                            <div className="w-8 h-8 rounded-full bg-background-Theme flex items-center justify-center text-xs font-bold border border-border-basic">
                                                {(s.name?.charAt(0) || s.email?.charAt(0) || "S")}
                                            </div>
                                            <span>{s.name || s.email || s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background-Card_1 rounded-2xl shadow-2xl border border-border-basic p-6 mx-4 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-text-basic mb-2">Delete Message</h3>
                        <p className="text-sm text-text-basic/70 mb-6">Are you sure you want to unsend this message? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-basic bg-background-Theme border border-border-basic hover:bg-hover-bg-1 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseChat;
