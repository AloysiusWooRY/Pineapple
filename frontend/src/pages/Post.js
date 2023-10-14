import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";

import Layout from "../layouts/Layout";
import SideBarOrganisationInfo from '../components/SidebarOrganisationInfo';
import { InputTextBox } from '../components/Inputs';
import { RectangleButton, StandardDropdown } from '../components/Buttons';
import { PostType } from '../components/Miscellaneous';

import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function Post() {
    const { user } = useAuthContext();

    const [organisationName, setOrganisationName] = useState('Mental Health Hoax');
    const [poster, setPoster] = useState('Wi Tu');
    const [postTime, setPostTime] = useState('6 days');
    const [postTitle, setPostTitle] = useState('On the beach at night');
    const [postContent, setPostContent] = useState(
        <>
            On the beach at night, Stands a child with her father, Watching the east, the autumn sky.
            <br></br>
            <br></br>
            Up through the darkness, While ravening clouds, the burial clouds, in black masses spreading, Lower sullen and fast athwart and down the sky,
            Amid a transparent clear belt of ether yet left in the east, Ascends large and calm the lord-star Jupiter, And nigh at hand, only a very little above,
            Swim the delicate sisters the Pleiades.
            <br></br>
            <br></br>
            Weep not, child, Weep not, my darling, With these kisses let me remove your tears, The ravening clouds shall not long be victorious,
            They shall not long possess the sky, they devour the stars only in apparition, Jupiter shall emerge, be patient, watch again another night,
            the Pleiades shall emerge, They are immortal, all those stars both silvery and golden shall shine out again,
            The great stars and the little ones shall shine out again, they endure, The vast immortal suns and the long-enduring pensive moons shall again shine.
            <br></br>
            <br></br>
            Then dearest child mournest thou only for Jupiter? Considerest thou alone the burial of the stars?
        </>
    );

    const [comment, setComment] = useState('');

    function PopulateComments() {
        let comments = [];

        for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
                comments.push(
                    // Comment
                    <div className="flex flex-col gap-2 p-2 border-l border-gray-500">
                        <div className="flex flex-row gap-2 items-center">
                            <div className="font-bold text-white text-sm">
                                Bang Ding
                            </div>
                            <p className="text-center text-white text-2xl">•</p>
                            <div className="text-gray-400 text-sm">
                                {i} min ago
                            </div>
                        </div>
                        <p className="text-white">How long can this go on?</p>
                        <div className="flex mt-auto gap-2 text-white items-center">
                            <ArrowUpCircleSolidIcon className="h-7" />
                            {69}
                            <ArrowDownCircleOutlineIcon className="h-7" />
                        </div>
                    </div>
                );
            }
            else {
                comments.push(
                    // Reply
                    <div className="pl-8">
                        <div className="flex flex-col gap-2 p-2 border-l border-gray-500">
                            <div className="flex flex-row gap-2 items-center">
                                <div className="font-bold text-white text-sm">
                                    Ho Li
                                </div>
                                <p className="text-center text-white text-2xl">•</p>
                                <div className="text-gray-400 text-sm">
                                    {i} min ago
                                </div>
                            </div>
                            <p className="text-white">Seeing Triple?</p>
                            <div className="flex mt-auto gap-2 text-white items-center">
                                <ArrowUpCircleSolidIcon className="h-7" />
                                {69}
                                <ArrowDownCircleOutlineIcon className="h-7" />
                            </div>
                        </div>
                    </div>
                );
            }
        }

        return comments;
    }

    return (
        <Layout>
            <div className="flex flex-row items-start gap-2">
                <div className="flex flex-none flex-col gap-2 p-2 text-white text-sm border-2 rounded-full border-gray-500">
                    <ArrowUpCircleSolidIcon className="h-7" />
                    <p className="text-center text-2xl">{69}</p>
                    <ArrowDownCircleOutlineIcon className="h-7" />
                </div>

                <div className="flex flex-col gap-2 p-2">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="font-bold text-white text-sm">
                            {organisationName}
                        </div>
                        <p className="text-center text-white text-2xl">•</p>
                        <div className="text-gray-400 text-sm">
                            Posted by {poster}, {postTime} ago
                        </div>
                    </div>

                    <div className="text-white text-2xl">
                        {postTitle}
                    </div>

                    <PostType type="Donation" />

                    <div className="py-2"></div>

                    <div className="text-white">
                        {postContent}
                    </div>

                    <div className="self-end">
                        <RectangleButton title="Edit" heroIcon={<PencilIcon />} onClick={(e) => { console.log("Edit me!") }} />
                    </div>

                    <hr className="h-px my-2 bg-gray-200 border-1"></hr>

                    <InputTextBox title="Your Message" placeholder="Write your thoughts here . . ."
                        value={comment} width='full' onChange={(e) => setComment(e.target.value)} />

                    <hr className="h-px my-2 bg-gray-200 border-1"></hr>

                    <div className="w-1/4">
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

            <div className="py-8"></div>
        </Layout>
    );
}
