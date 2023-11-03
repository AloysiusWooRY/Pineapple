// React / Packages
import React from "react";

// Components
import { timeAgo } from "./componentUtils";

// Assets
import DefaultDiscussion from "../assets/default-cat-discussion-icon.png";
import DefaultDonation from "../assets/default-cat-donation-icon.png";
import DefaultEvent from "../assets/default-cat-event-icon.png";

// API
// ~

export default function CardHome(props) {
    const { postContent } = props;

    function getDefaultImage() {
        switch (postContent.type) {
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
        <a
            id={"card-home-" + postContent.postId}
            href={`/organisation/${postContent.organisationId}/post/${postContent.postId}`}
            className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-background-minor">
            <div className="h-36 w-36 shrink-0 bg-cover bg-center rounded"
                style={{ backgroundImage: postContent.image ? `url(http://localhost:4000/${postContent.image})` : `url(${getDefaultImage()})` }}></div>
            <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                <div className="w-full flex gap-1">
                    <span className="w-full text-text-primary text-2xl">
                        {postContent.title}
                    </span>
                </div>
                <div className="flex flex-row items-center space-x-1">
                    <div className="text-text-yellow-pineapple">
                        {postContent.organisationName}
                    </div>
                    <p className="text-text-primary text-2xl">•</p>
                    <div className="capitalize text-text-green-pineapple">
                        {postContent.organisationCategory}
                    </div>
                </div>
                <div className="text-sm text-text-secondary capitalize">
                    {postContent.type}
                </div>
                <div className="flex flex-row items-center space-x-1">
                    <div className="text-sm text-text-yellow-pineapple">
                        {timeAgo(postContent.createdAt)} ago
                    </div>
                    <p className="text-text-primary text-2xl">•</p>
                    <div className="text-sm capitalize text-text-green-pineapple">
                        {postContent.likes} Likes
                    </div>
                </div>
            </div>
        </a>
    );
}
