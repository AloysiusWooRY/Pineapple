// React / Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Layout from "../layouts/Layout";
import SideBarOrganisationInfo from '../components/SidebarOrganisationInfo';
import { InputTextBox } from '../components/Inputs';
import { ToggleButton, RoundedButton, StandardDropdown, RectangleButton } from '../components/Buttons';
import { Divider, PostType } from '../components/Miscellaneous';

// Assets
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function Post() {
    const { user } = useAuthContext();

    const [organisationName, setOrganisationName] = useState('Mental Health Hoax');
    const [poster, setPoster] = useState('Wi Tu');
    const [postTime, setPostTime] = useState('6 days');
    const [postTitle, setPostTitle] = useState('On the beach at night');
    const [postContent, setPostContent] = useState(
        'On the beach at night, Stands a child with her father, Watching the east, the autumn sky.\n\n\
Up through the darkness, While ravening clouds, the burial clouds, in black masses spreading, Lower sullen and fast athwart and down the sky,\n\
Amid a transparent clear belt of ether yet left in the east, Ascends large and calm the lord-star Jupiter, And nigh at hand, only a very little above,\n\
Swim the delicate sisters the Pleiades.\n\n\
Weep not, child, Weep not, my darling, With these kisses let me remove your tears, The ravening clouds shall not long be victorious,\n\
They shall not long possess the sky, they devour the stars only in apparition, Jupiter shall emerge, be patient, watch again another night,\n\
the Pleiades shall emerge, They are immortal, all those stars both silvery and golden shall shine out again,\n\n\
The great stars and the little ones shall shine out again, they endure, The vast immortal suns and the long-enduring pensive moons shall again shine.\n\n\
Then dearest child mournest thou only for Jupiter? Considerest thou alone the burial of the stars?'
    );

    const [editMode, setEditMode] = useState(false);
    const [comment, setComment] = useState('');

    function PopulateComments() {
        let comments = [];

        for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
                comments.push(
                    // Comment
                    <div
                        className="flex flex-col gap-2 p-2 border-l-2 border-divider-color"
                        key={"comment-" + i}
                    >
                        <div className="flex flex-row gap-2 items-center">
                            <div className="font-bold text-text-primary text-sm">
                                Bang Ding
                            </div>
                            <p className="text-center text-text-primary text-2xl">•</p>
                            <div className="text-text-secondary text-sm">
                                {i} min ago
                            </div>
                        </div>
                        <p className="text-text-primary">How long can this go on?</p>
                        <div className="flex mt-auto gap-2 text-text-primary items-center">
                            <ArrowUpCircleSolidIcon className="h-7" />
                            {69}
                            <ArrowDownCircleOutlineIcon className="h-7" />
                            <div className="px-2 py-2">
                                <RoundedButton title="Reply" colour="bg-background-transparent" />
                            </div>
                        </div>
                    </div>
                );
            }
            else {
                comments.push(
                    // Reply
                    <div
                        className="pl-8"
                        key={"comment-" + i}
                    >
                        <div className="flex flex-col gap-2 p-2 border-l-2 border-divider-color">
                            <div className="flex flex-row gap-2 items-center">
                                <div className="font-bold text-text-primary text-sm">
                                    Ho Li
                                </div>
                                <p className="text-center text-text-primary text-2xl">•</p>
                                <div className="text-text-secondary text-sm">
                                    {i} min ago
                                </div>
                            </div>
                            <p className="text-text-primary">Seeing Triple?</p>
                            <div className="flex mt-auto gap-2 text-text-primary items-center">
                                <ArrowUpCircleSolidIcon className="h-7" />
                                {69}
                                <ArrowDownCircleOutlineIcon className="h-7" />
                                <div className="px-2 py-2">
                                    <RoundedButton title="Reply" colour="bg-background-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        return comments;
    }

    function handleDelete() {
        console.log("handle delete!");
    }

    return (
        <Layout>
            <div className="flex flex-row items-start gap-2">
                <div className="flex flex-none flex-col gap-2 p-2 text-text-primary text-sm">
                    <ArrowUpCircleSolidIcon className="h-7" />
                    <p className="text-center text-2xl">{69}</p>
                    <ArrowDownCircleOutlineIcon className="h-7" />
                </div>

                <div className="flex flex-col grow gap-2 p-2">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="font-bold text-text-primary text-sm">
                            {organisationName}
                        </div>
                        <p className="text-center text-text-primary text-2xl">•</p>
                        <div className="text-text-secondary text-sm">
                            Posted by {poster}, {postTime} ago
                        </div>
                    </div>

                    <div className="text-text-primary text-2xl">
                        {postTitle}
                    </div>

                    <PostType type="Donation" />

                    <div className="py-2"></div>

                    {!editMode ?
                        <div className="text-text-primary whitespace-pre">
                            {postContent}
                        </div>
                        :
                        <InputTextBox title="Editing Post" placeholder="Editing Post" height='96'
                            value={postContent} width='full' onChange={(e) => setPostContent(e.target.value)} />
                    }

                    <div className="py-2"></div>

                    <div className="flex flex-row space-x-2 self-start">
                        <ToggleButton title="Edit" active={editMode} onClick={(e) => { setEditMode(!editMode) }} />
                        {editMode && <RectangleButton title="Delete" onClick={handleDelete} heroIcon={<TrashIcon />} colour="bg-button-red" />}
                    </div>

                    <Divider padding={2} />

                    <InputTextBox title="Your Message" placeholder="Write your thoughts here"
                        value={comment} width='full' onChange={(e) => setComment(e.target.value)} />

                    <Divider padding={2} />

                    <div className="w-1/5">
                        <StandardDropdown title="Sort By" options={['Newest', 'Top']} onChange={(e) => { console.log(e.target.value); }} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <PopulateComments />
                    </div>
                </div>

                <div className="flex-none">
                    <SideBarOrganisationInfo
                        organisationName="Mental Health Hoax"
                        organisationDescription="Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy."
                        createDate="July 22, 1999"
                        numberPosts={30}
                        numberMembers={60}
                    />
                </div>
            </div>
        </Layout>
    );
}
