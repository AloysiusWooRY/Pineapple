// React / Packages
import React from "react";

// Components
import { PostType } from './Miscellaneous';
import { textNerfer } from "./componentUtils";

// Assets
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon } from "@heroicons/react/24/solid";
import Sample1 from "../assets/sample-nuts.jpg";

// API
// ~

export default function DiscussionOverview(props) {
    const { post } = props;

    return (
        <a
            className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-background-minor"
            id={post.id}>
            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                <span className="w-full text-text-primary text-2xl overflow-hidden text-ellipsis whitespace">
                    {post.title}
                </span>

                <PostType type={post.discussionType} />

                <div className="flex mt-auto gap-2 text-text-primary items-center">
                    {post.upvoted !== null ? (post.upvoted ? <ArrowUpCircleSolidIcon className="h-7" /> : <ArrowUpCircleOutlineIcon className="h-7" />)
                        : <ArrowUpCircleOutlineIcon className="h-7" />}
                    {post.votes}
                    {post.upvoted !== null ? (!post.upvoted ? <ArrowDownCircleSolidIcon className="h-7" /> : <ArrowDownCircleOutlineIcon className="h-7" />)
                        : <ArrowDownCircleOutlineIcon className="h-7" />}
                    •
                    <div className="flex text-sm text-text-secondary">
                        Posted by {post.username}, {post.timeSincePost} ago
                    </div>
                </div>
            </div>
            {/* imagePath ? imagePath : Sample1 (Use this for src once the images are available) */}
            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" /> 
        </a>
    );
};
