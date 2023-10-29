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

export function OrganisationType(props) {
    const { type } = props;

    const org_map = {
        'health': 'text-red-400',
        'education': 'text-violet-400',
        'environment': 'text-green-400',
        'humanitarian': 'text-sky-400',
    };

    let type_to_lower = type.toLowerCase();
    if (type_to_lower in org_map) {
        return (
            <div className={`flex items-center gap-1 text-xs ${org_map[type_to_lower]} capitalize`}>
                <span className="rounded-full bg-background-minor px-2 py-[0.5px]">
                    {type}
                </span>
            </div>
        );
    } else {
        return (
            <div className={`flex items-center gap-1 text-xs text-text-primary capitalize`}>
                <span className="rounded-full bg-background-minor px-2 py-[0.5px]">
                    {type}
                </span>
            </div>
        );
    }
}

export function PostType(props) {
    const { type } = props;

    const post_map = {
        'discussion': 'bg-fuchsia-800',
        'event': 'bg-amber-800',
        'donation': 'bg-lime-800',
    };

    let type_to_lower = type.toLowerCase();
    if (type_to_lower in post_map) {
        return (
            <div className={`w-fit h-fit px-2 py-0.5 rounded-full text-text-primary ${post_map[type_to_lower]} text-sm capitalize`}>
                {type}
            </div>
        );
    } else {
        return (
            <div className={`w-fit h-fit px-2 py-0.5 rounded-full text-text-primary bg-background-minor capitalize`}>
                {type}
            </div>
        );
    }
};

export function UserType(props) {
    const { type } = props;

    const user_map = {
        'user': 'bg-[#252A34]',
        'administrator': 'bg-[#FF2E63]',
        'moderator': 'bg-[#176B87]',
    };

    let type_to_lower = type.toLowerCase();
    if (type_to_lower in user_map) {
        return (
            <div className={`w-fit h-fit px-2 py-0.5 rounded-full text-text-primary ${user_map[type_to_lower]} text-sm capitalize`}>
                {type}
            </div>
        );
    } else {
        return (
            <div className={`w-fit h-fit px-2 py-0.5 rounded-full text-text-primary bg-background-minor capitalize`}>
                {type}
            </div>
        );
    }
};

export function ApprovalType(props) {
    const { type } = props;

    const approval_map = {
        'pending': 'bg-cyan-600',
        'approved': 'bg-green-700',
        'rejected': 'bg-red-600',
    };

    let type_to_lower = type.toLowerCase();
    if (type_to_lower in approval_map) {
        return (
            <div className={`w-fit h-fit px-2 py-0.5 rounded-full text-text-primary ${approval_map[type_to_lower]} text-sm capitalize`}>
                {type}
            </div>
        );
    } else {
        return (
            <div className={`w-fit h-fit px-2 py-0.5 rounded-full text-text-primary bg-background-minor capitalize`}>
                {type}
            </div>
        );
    }
};
