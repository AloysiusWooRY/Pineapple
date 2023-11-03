// React / Packages
import React from "react";

// Components
import { constructResourceURL } from "./componentUtils";
import { PostType } from './Miscellaneous';
import { timeAgo } from "./componentUtils";

// Assets
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon } from "@heroicons/react/24/solid";
import DefaultDiscussion from "../assets/default-cat-discussion-icon.png";
import DefaultDonation from "../assets/default-cat-donation-icon.png";
import DefaultEvent from "../assets/default-cat-event-icon.png";

// API
// ~

export default function DiscussionOverview(props) {
    const { post } = props;

    function getDefaultImage() {
        switch (post.discussionType) {
            case 'discussion':
                return DefaultDiscussion;

            case 'donation':
                return DefaultDonation;

            case 'event':
                return DefaultEvent;

            default:
                return '';
        }
    }

    return (
        <div
            className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-background-minor"
            id={post.id}>
            <a className="w-full flex flex-col justify-start gap-1 flex-shrink"
                href={`/organisation/${post.organisationId}/post/${post.id}`}>
                <span className="w-full text-text-primary text-2xl overflow-hidden text-ellipsis whitespace">
                    {post.title}
                </span>

                <PostType type={post.discussionType} />

                <div className="flex mt-auto p-2 gap-2 w-fit text-text-primary items-center bg-background-blue rounded-xl cursor-default">
                    {post.upvoted !== null ? (post.upvoted ? <ArrowUpCircleSolidIcon className="h-7" /> : <ArrowUpCircleOutlineIcon className="h-7" />)
                        : <ArrowUpCircleOutlineIcon className="h-7 cursor-pointer" />}
                    {post.votes}
                    {post.upvoted !== null ? (!post.upvoted ? <ArrowDownCircleSolidIcon className="h-7" /> : <ArrowDownCircleOutlineIcon className="h-7" />)
                        : <ArrowDownCircleOutlineIcon className="h-7 cursor-pointer" />}
                    •
                    <div className="flex text-sm text-text-secondary">
                        Posted by {post.username} • {timeAgo(post.createdAt)} ago
                    </div>
                </div>
            </a>

            <div className="h-36 w-36 shrink-0 bg-cover bg-center rounded"
                style={{ backgroundImage: post.imagePath ? constructResourceURL(post.imagePath) : `url(${getDefaultImage()})` }}></div>
        </div>
    );
};
