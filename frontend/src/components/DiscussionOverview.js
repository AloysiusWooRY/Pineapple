import React from 'react';

import { PostType } from './Miscellaneous';

import Sample1 from "../assets/sample-nuts.jpg";

import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon } from "@heroicons/react/24/solid";

export default function DiscussionOverview(props) {
    const { title, discussionType, votes, timeSincePost, posterUsername, upvoted = null } = props;

    return (
        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                    {title}
                </span>

                <PostType type={discussionType} />

                <div className="flex mt-auto gap-2 text-white items-center">
                    {upvoted !== null ? (upvoted ? <ArrowUpCircleSolidIcon className="h-7" /> : <ArrowUpCircleOutlineIcon className="h-7" />)
                        : <ArrowUpCircleOutlineIcon className="h-7" />}
                    {votes}
                    {upvoted !== null ? (!upvoted ? <ArrowDownCircleSolidIcon className="h-7" /> : <ArrowDownCircleOutlineIcon className="h-7" />)
                        : <ArrowDownCircleOutlineIcon className="h-7" />}
                    •
                    <div className="flex text-sm text-neutral-400">
                        Posted by {posterUsername}, {timeSincePost} ago
                    </div>
                </div>
            </div>
            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />
        </a>
    );
};
