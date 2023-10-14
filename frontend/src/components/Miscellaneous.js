import React from "react";

export function PostType(props) {
    const { type } = props;

    switch (type.toLowerCase()) {
        case 'discussion':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-orange-800">
                    Discussion
                </div>
            );
        case 'event':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-purple-800">
                    Event
                </div>
            );
        case 'donation':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-green-800">
                    Donation
                </div>
            );
        default:
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-gray-500">
                    {type}
                </div>
            );
    }
};

export function UserType(props) {
    const { type } = props;

    switch (type.toLowerCase()) {
        case 'user':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-green-800">
                    User
                </div>
            );
        case 'administrator':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-purple-800">
                    Administrator
                </div>
            );
        case 'moderator':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-blue-800">
                    Moderator
                </div>
            );
        default:
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-gray-500">
                    {type}
                </div>
            );
    }
};

export function ApprovalType(props) {
    const { type } = props;

    switch (type.toLowerCase()) {
        case 'pending':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-yellow-800">
                    Pending
                </div>
            );
        case 'approved':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-green-800">
                    Approved
                </div>
            );
        case 'rejected':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-red-500">
                    Rejected
                </div>
            );
        default:
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-gray-500">
                    {type}
                </div>
            );
    }
};
