// React / Packages
import React from "react";

// Components
import { timeAgo } from "./componentUtils";

// Assets
// ~

// API
// ~

export default function CardHome(props) {
    const { post } = props;
    return (
        <a
            id={"card-home-" + post.id}
            className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-background-minor">
            <img src={"http://localhost:4000/" + post.image} className="h-36 basis-28 shrink-0 rounded object-cover object-center" />
            <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                <div className="w-full flex gap-1">
                    <span className="w-full text-text-primary text-2xl">
                        {post.title}
                    </span>
                </div>
                <div className="flex flex-row items-center space-x-1">
                    <div className="text-text-yellow-pineapple">
                        {post.organisationName}
                    </div>
                    <p className="text-text-primary text-2xl">•</p>
                    <div className="capitalize text-text-green-pineapple">
                        {post.category}
                    </div>
                </div>
                <div className="text-sm text-text-secondary capitalize">
                    {post.type}
                </div>
                <div className="flex flex-row items-center space-x-1">
                    <div className="text-sm text-text-yellow-pineapple">
                        {timeAgo(post.createdAt)} ago
                    </div>
                    <p className="text-text-primary text-2xl">•</p>
                    <div className="text-sm capitalize text-text-green-pineapple">
                        {post.likes} Likes
                    </div>
                </div>
            </div>
        </a>
    );
}
