// React / Packages
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import { constructDivResourceURL } from "./componentUtils";
import { PostType } from './Miscellaneous';
import { timeAgo } from "./componentUtils";

// Assets
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon } from "@heroicons/react/24/solid";
import DefaultDiscussion from "../assets/default-cat-discussion-icon.png";
import DefaultDonation from "../assets/default-cat-donation-icon.png";
import DefaultEvent from "../assets/default-cat-event-icon.png";

// API
import { postIdLike, postIdDislike } from "../apis/exportedAPIs";

export default function DiscussionOverview(props) {
    const { post, handleLike, handleDislike } = props;

    const navigate = useNavigate();

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

    async function likeClick(e) {
        e.preventDefault();

        await handleLike(post.id);
    }

    async function disLikeClick(e) {
        e.preventDefault();

        await handleDislike(post.id);
    }

    const handleDivClick = (e) => {
        let target = e.target;
        let shouldNavigate = true;

        while (target.classList !== undefined && !target.classList.contains('div-click-constrain')) {
            if (target.classList.contains('div-click-exclude')) {
                shouldNavigate = false;
                break;
            }
            target = target.parentNode;
        }

        if (shouldNavigate) {
            navigate(`../organisation/${post.organisationId}/post/${post.id}`);
        }
    };

    return (
        <div
            className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-background-minor div-click-constrain"
            onClick={(e) => handleDivClick(e)}
            id={post.id}>
            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                <span className="w-full text-text-primary text-2xl overflow-hidden text-ellipsis whitespace">
                    {post.title}
                </span>

                <PostType type={post.discussionType} />

                <div className="flex mt-auto p-2 gap-2 w-fit text-text-primary items-center bg-background-blue rounded-xl cursor-default div-click-exclude">
                    {post.upvoted !== null ? (post.upvoted === 1 ?
                        <ArrowUpCircleSolidIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />
                        :
                        <ArrowUpCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />
                    )
                        : <ArrowUpCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />}
                    {post.votes}
                    {post.upvoted !== null ? (post.upvoted === -1 ?
                        <ArrowDownCircleSolidIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />
                        :
                        <ArrowDownCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />
                    )
                        : <ArrowDownCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />}
                    •
                    <div className="flex text-sm text-text-secondary">
                        Posted by {post.username} • {timeAgo(post.createdAt)} ago
                    </div>
                </div>
            </div>

            <div className="h-36 w-36 shrink-0 bg-cover bg-center rounded"
                style={{ backgroundImage: post.imagePath ? constructDivResourceURL(post.imagePath) : `url(${getDefaultImage()})` }}></div>
        </div>
    );
};
