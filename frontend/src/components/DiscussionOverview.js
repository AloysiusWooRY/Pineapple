// React / Packages
import React, { useState } from "react";
import toast from "react-hot-toast";

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
    const { post } = props;
    const [likeValues, setLikeValues] = useState(post.votes);
    const [userUpvoted, setUserUpvoted] = useState(post.upvoted);

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
        
        const response = await postIdLike({ id: post.id });
        const json = await response.json();

        if (response.ok) {
            setLikeValues(json.total);
            setUserUpvoted(json.value);
        } else {
            toast.error(json.error);
        }
    }

    async function disLikeClick(e) {
        e.preventDefault();
        
        const response = await postIdDislike({ id: post.id });
        const json = await response.json();

        if (response.ok) {
            setLikeValues(json.total);
            setUserUpvoted(json.value);
        } else {
            toast.error(json.error);
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
                    {userUpvoted !== null ? (userUpvoted === 1? <ArrowUpCircleSolidIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} /> : <ArrowUpCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />)
                        : <ArrowUpCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />}
                    {likeValues}
                    {userUpvoted !== null ? (userUpvoted === -1 ? <ArrowDownCircleSolidIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} /> : <ArrowDownCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />)
                        : <ArrowDownCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />}
                    •
                    <div className="flex text-sm text-text-secondary">
                        Posted by {post.username} • {timeAgo(post.createdAt)} ago
                    </div>
                </div>
            </a>

            <div className="h-36 w-36 shrink-0 bg-cover bg-center rounded"
                style={{ backgroundImage: post.imagePath ? constructDivResourceURL(post.imagePath) : `url(${getDefaultImage()})` }}></div>
        </div>
    );
};
