// React / Packages
import React, { useState } from "react";

// Components
// ~

// Assets
import {
    ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon,
    PaperAirplaneIcon, NoSymbolIcon
} from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon } from "@heroicons/react/24/solid";
import { RectangleButton, RoundedButton } from "./Buttons";
import { InputTextBox } from "./Inputs";

// API
// ~

export default function Comment(props) {
    const { commentId, handlePutReply, commentContent, isReply } = props;

    const [replyEnabled, setReplyEnabled] = useState(false);
    const [replyText, setReplyText] = useState('');

    function cleanupReply() {
        setReplyText('');
        setReplyEnabled(false);
    }

    async function handleReply() {
        try {
            await handlePutReply(commentId, replyText);
        } catch (error) {
        }
    };

    return (
        <div
            className={isReply ? 'pl-8' : 'pl-0'}
            id={"comment-" + commentContent._id}>
            <div
                className="flex flex-col gap-2 p-2 border-l-2 border-divider-color"
            >
                <div className="flex flex-row gap-2 items-center">
                    <div className="font-bold text-text-primary text-sm">
                        {commentContent.owner.name}
                    </div>
                    <p className="text-center text-text-primary text-2xl">•</p>
                    <div className="text-text-secondary text-sm">
                        {commentContent.createdAt}
                    </div>
                </div>

                <p className="text-text-primary">
                    {commentContent.content}
                </p>

                <div className="flex mt-auto gap-2 text-text-primary items-center">
                    {commentContent.userIsLiked !== null ?
                        (commentContent.userIsLiked ? <ArrowUpCircleSolidIcon className="h-7" /> : <ArrowUpCircleOutlineIcon className="h-7" />)
                        : <ArrowUpCircleOutlineIcon className="h-7" />}
                    {commentContent.likeValue}
                    {commentContent.userIsLiked !== null ?
                        (!commentContent.userIsLiked ? <ArrowDownCircleSolidIcon className="h-7" /> : <ArrowDownCircleOutlineIcon className="h-7" />)
                        : <ArrowDownCircleOutlineIcon className="h-7" />}
                    <div className="px-2 py-2">
                        <RoundedButton title="Reply" colour="bg-background-transparent" onClick={() => setReplyEnabled(true)} />
                    </div>
                </div>

                {replyEnabled && (
                    <>
                        <InputTextBox
                            title="Replying"
                            placeholder="Reply to Comment"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />

                        <div className="flex flex-row gap-2 items-center">
                            <RectangleButton title="Submit" forForm heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" onClick={() => {
                                handleReply();
                                cleanupReply();
                            }} />
                            <RectangleButton title="Cancel" heroIcon={<NoSymbolIcon />} colour="bg-button-red" onClick={() => {
                                cleanupReply();
                            }} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
