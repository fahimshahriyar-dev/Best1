import React, { FC, useEffect, useState, useMemo } from "react";
import {
    useDeleteUserMutation,
    useGetAllUserQuery,
    useUpdateUserRoleMutation,
} from "../../../redux/features/user/userApi";
import Loader from "../../../app/components/Loader";
import { format } from "timeago.js";
import { MdDelete, MdEmail } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import toast from "react-hot-toast";
import DataTableBox from "../../components/DataTableBox";
import { BiSolidVideoPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import { socketId } from "../../utils/socket";
import AnimatedPopup from "../../components/AnimatedPopup";
import AdminPageHeader from "../../components/AdminPageHeader";
import { MdGroups2 } from "react-icons/md";
import { RiGroupFill } from "react-icons/ri";

type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    courses: any[];
    createdAt: string;
};

type Props = {
    isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
    const { user: currentUser } = useSelector((state: any) => state.auth);
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [
        updateUserRole,
        { error: updateError, isSuccess: updateSuccess, isLoading: isUpdatingRole },
    ] = useUpdateUserRoleMutation();
    const { isLoading, data, refetch } = useGetAllUserQuery(
        {},
        { refetchOnMountOrArgChange: true }
    );
    const [deleteUser, { isSuccess: deleteSuccess, error: deleteError, isLoading: isDeletingUser }] =
        useDeleteUserMutation();
    const [selectedRole, setSelectedRole] = useState("admin");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [addMemberPopUp, setAddMemberPopUp] = useState(false);
    const [usersData, setUsersData] = useState<User[]>([]);

    useEffect(() => {
        if (data?.users) {
            const formattedUsers = data.users.map((item: any) => ({
                _id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses,
                createdAt: item.createdAt,
            }));
            setUsersData(formattedUsers);
        }
    }, [data]);

    // Derive the live role of the current user from usersData (updated by refetch)
    // This avoids stale Redux state when e.g. the old superadmin is auto-demoted
    const currentUserLiveRole = useMemo(() => {
        const found = usersData.find(u => u._id === currentUser?._id);
        return found?.role || currentUser?.role;
    }, [usersData, currentUser]);

    useEffect(() => {
        socketId.on("updateUserRole", () => {
            refetch();
        });

        return () => {
            socketId.off("updateUserRole");
        };
    }, [refetch]);

    useEffect(() => {
        if (updateSuccess) {
            toast.success("User role updated successfully!");
            refetch();
            setAddMemberPopUp(false);
            setNewMemberEmail("");
            setSelectedRole("admin");
        }
        if (updateError) {
            const errorData = updateError as any;
            toast.error(errorData?.data?.message || "Failed to update user role.");
        }
        if (deleteSuccess) {
            toast.success("User deleted successfully!");
            refetch();
            setOpen(false);
        }
        if (deleteError) {
            const errorData = deleteError as any;
            toast.error(errorData?.data?.message || "Failed to delete user.");
        }
    }, [updateError, updateSuccess, deleteSuccess, deleteError, refetch]);

    const columns = useMemo<any[]>(
        () => [
            { key: "_id", header: "ID" },
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            {
                key: "role",
                header: "Role",
                render: (user: User) => (
                    <span className={`font-semibold ${
                        user.role === 'superadmin' ? 'text-red-600' :
                        user.role === 'admin' ? 'text-green-500' :
                        user.role === 'moderator' ? 'text-purple-500' :
                        user.role === 'teacher' ? 'text-orange-500' :
                        'text-blue-500'
                    }`}>
                        {user.role.toUpperCase()}
                    </span>
                ),
            },
            {
                key: "courses",
                header: "Courses",
                render: (user: User) => (user.courses || []).length,
            },
            {
                key: "createdAt",
                header: "Created At",
                render: (user: User) => format(user.createdAt),
            },
            {
                key: "updateRole",
                header: "Update Role",
                render: (user: User) => {
                    const isRestricted = (user.role === "superadmin" && currentUserLiveRole !== "superadmin") || user._id === currentUser?._id;
                    return (
                        <button
                            onClick={() => {
                                if (!isRestricted) {
                                    setAddMemberPopUp(true);
                                    setNewMemberEmail(user.email);
                                    setSelectedRole(user.role);
                                }
                            }}
                            disabled={isRestricted}
                            className={`${isRestricted ? "opacity-30 cursor-not-allowed" : "text-blue-500 hover:text-blue-600 cursor-pointer"} font-bold px-[14px] transition-colors`}
                        >
                            <AiOutlineEdit size={22}/>
                        </button>
                    );
                },
            },
            {
                key: "delete",
                header: "Delete",
                render: (user: User) => {
                    const isRestricted = user.role === "superadmin" || user._id === currentUser?._id;
                    return (
                        <button
                            onClick={() => {
                                if (!isRestricted) {
                                    setOpen(!open);
                                    setUserId(user._id);
                                }
                            }}
                            disabled={isRestricted}
                            className={`${isRestricted ? "opacity-30 cursor-not-allowed" : "text-message-error cursor-pointer"} font-bold px-[14px]`}
                        >
                            <MdDelete size={20}/>
                        </button>
                    );
                },
            },
            {
                key: "emailLink",
                header: "Email",
                render: (user) => (
                    <div className="px-[10px]">
                        <a
                            href={`mailto:${user.email}`}
                            className="text-text-basic hover:underline"
                        >
                            <MdEmail size={20} />
                        </a>
                    </div>
                ),
            },
        ],
        [open, currentUser, usersData]
    );

    // Filter columns based on context:
    // - Users view: hide "Update Role" column
    // - Manage Team view: hide "Courses" column
    const filteredColumns = useMemo(() => {
        if (isTeam) {
            return columns.filter(col => col.key !== "courses");
        } else {
            return columns.filter(col => col.key !== "updateRole");
        }
    }, [columns, isTeam]);

    const teamMembers = useMemo(() => {
        return isTeam
            ? usersData.filter((user) => user.role === "superadmin" || user.role === "admin" || user.role === "moderator" || user.role === "teacher")
            : usersData;
    }, [usersData, isTeam]);

    const handleDelete = async () => {
        await deleteUser(userId);
    };

    const handleRoleChange = (e: any) => {
        setSelectedRole(e.target.value);
    };

    const handleAddMember = async () => {
        if (!newMemberEmail || !selectedRole) {
            toast.error("Please enter email and select a role.");
            return;
        }
        await updateUserRole({ email: newMemberEmail, role: selectedRole });
    };

    return (
        <div className="bg-background-Theme pt-20 sm:pt-24 px-4 sm:px-8 pb-6">
            <AdminPageHeader
                icon={isTeam ? <RiGroupFill size={20} /> : <MdGroups2 size={20} />}
                title={isTeam ? "Manage Team" : "All Users"}
                subtitle={isTeam ? "Manage team members and their roles" : "View and manage all registered users"}
            />
            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-w-[1600px] mx-auto">

                    {/* Table Section */}
                    <div className="bg-background-Card_1 rounded-2xl border border-[#ffffff1a] shadow-xl overflow-hidden max-h-[calc(100vh-210px)] flex flex-col">
                        <DataTableBox
                                data={teamMembers}
                                columns={filteredColumns}
                                filters={{
                                    role: { 
                                        type: 'text',
                                        options: currentUser?.role === 'superadmin' ? ['superadmin', 'admin', 'moderator', 'teacher', 'user'] : ['admin', 'moderator', 'teacher', 'user']
                                    },
                                    createdAt: { type: 'date' },
                                }}
                                headerAction={
                                    isTeam ? (
                                        <button
                                            onClick={() => {
                                                setNewMemberEmail("");
                                                setSelectedRole("admin");
                                                setAddMemberPopUp(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-all shadow-md shadow-blue-500/20 whitespace-nowrap text-sm"
                                        >
                                            <span className="text-lg leading-none">+</span>
                                            Add Member
                                        </button>
                                    ) : undefined
                                }
                            />
                    </div>

                    {/* Modals */}
                    <AnimatedPopup isOpen={addMemberPopUp} onClose={() => setAddMemberPopUp(false)} zIndex={9999}>
                            <div className="bg-background-Card_1 w-full max-w-md p-8 rounded-3xl border border-[#ffffff1a] shadow-2xl relative z-10">
                                <h2 className="text-2xl font-bold text-text-basic mb-6">
                                    Add Team Member
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium opacity-60 mb-2">Member Email</label>
                                        <input
                                            type="email"
                                            placeholder="e.g. mentor@best1.com"
                                            value={newMemberEmail}
                                            onChange={(e) => setNewMemberEmail(e.target.value)}
                                            className="w-full p-4 rounded-xl bg-background-bar_2 border border-[#ffffff1a] outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium opacity-60 mb-2">Assign Role</label>
                                        <select
                                            value={selectedRole}
                                            onChange={handleRoleChange}
                                            className="w-full p-4 rounded-xl bg-background-bar_2 border border-[#ffffff1a] outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                        >
                                            {currentUser?.role === "superadmin" && (
                                                <option value="superadmin">Superadmin</option>
                                            )}
                                            <option value="admin">Admin</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button
                                        className="flex-1 py-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold transition-all"
                                        onClick={() => setAddMemberPopUp(false)}
                                        disabled={isUpdatingRole || isDeletingUser}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
                                        onClick={handleAddMember}
                                        disabled={isUpdatingRole || isDeletingUser}
                                    >
                                        {isUpdatingRole ? "Processing..." : "Add Member"}
                                    </button>
                                </div>
                            </div>
                    </AnimatedPopup>

                    <AnimatedPopup isOpen={open} onClose={() => setOpen(false)} zIndex={9999}>
                            <div className="bg-background-Card_1 w-full max-sm p-8 rounded-3xl border border-[#ffffff1a] shadow-2xl relative z-10 text-center">
                                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MdDelete size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-text-basic mb-2">
                                    Delete User?
                                </h2>
                                <p className="text-sm opacity-60 mb-8">
                                    This action cannot be undone. All data associated with this user will be permanently removed.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-text-basic font-bold transition-all"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20"
                                        onClick={handleDelete}
                                    >
                                        {isDeletingUser ? "Deleting..." : "Confirm Delete"}
                                    </button>
                                </div>
                            </div>
                    </AnimatedPopup>
                </div>
            )}
        </div>
    );
};

export default AllUsers;
