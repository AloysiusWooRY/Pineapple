// React / Packages
import React from "react";

// Components
// ~

// Assets
// ~

// API
// ~

export function Divider(props) {
    const { thickness = 1, padding = 8 } = props;

    return (<>
        <div className={`py-${padding / 2}`}></div>
        <div className={`border-${thickness} border-divider-color`}></div>
        <div className={`py-${padding / 2}`}></div>
    </>
    );
}

export function PostType(props) {
    const { type } = props;

    switch (type.toLowerCase()) {
        case 'discussion':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-post-discussion">
                    Discussion
                </div>
            );
        case 'event':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-post-event">
                    Event
                </div>
            );
        case 'donation':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-post-donation">
                    Donation
                </div>
            );
        default:
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-background-minor">
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
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-role-user">
                    User
                </div>
            );
        case 'administrator':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-role-administrator">
                    Administrator
                </div>
            );
        case 'moderator':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-role-moderator">
                    Moderator
                </div>
            );
        default:
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-background-minor">
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
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-button-blue">
                    Pending
                </div>
            );
        case 'approved':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-button-green">
                    Approved
                </div>
            );
        case 'rejected':
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-button-red">
                    Rejected
                </div>
            );
        default:
            return (
                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-text-primary text-sm bg-background-minor">
                    {type}
                </div>
            );
    }
};
