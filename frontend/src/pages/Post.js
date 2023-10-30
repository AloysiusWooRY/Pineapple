// React / Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { FormatDateTime } from "../components/componentUtils";
import Layout from "../layouts/Layout";
import SideBarOrganisationInfo from '../components/SidebarOrganisationInfo';
import Comment from "../components/Comment";
import Popup from "../components/Popup";
import { InputField, InputTextBox, InputDate, InputFile } from '../components/Inputs';
import { ToggleButton, RoundedButton, StandardDropdown, RectangleButton } from '../components/Buttons';
import { Divider, PostType } from '../components/Miscellaneous';

// Assets
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon, CreditCardIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { SmoothProgressBar } from "../components/CustomProgressBar";

export default function Post() {
    const { user } = useAuthContext();

    const [organisationName, setOrganisationName] = useState('Mental Health Hoax');
    const [organisationDescription, setOrganisationDescription] = useState('Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.');
    const [organisationCreateDate, setOrganisationCreateDate] = useState('July 22, 1999');
    const [organisationPosts, setOrganisationPosts] = useState(30);

    const [postType, setPostType] = useState('donation');

    const [eventStartDateTime, setEventStartDateTime] = useState('2023-10-28T08:14:26.868Z');
    const [eventEndDateTime, setEventEndDateTime] = useState('2023-10-28T08:15:00.000Z');
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

    const [donationCurrent, setDonationCurrent] = useState(34);
    const [donationGoal, setDonationGoal] = useState(124);
    const [displayDonationPopup, setDisplayDonationPopup] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [CVC, setCVC] = useState('');

    const [editMode, setEditMode] = useState(false);
    const [comment, setComment] = useState('');

    function PopulateComments() {
        let comments = [];

        for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
                comments.push(
                    <Comment isReply={false} commentContent={{
                        '_id': i,
                        'owner': { 'name': 'Ho Li' },
                        'createdAt': '01-01-1970',
                        'content': 'Get em\', boys!',
                        'likeValue': i * 2,
                        'userIsLiked': true,
                    }} />
                );
            }
            else {
                comments.push(
                    <Comment isReply={true} commentContent={{
                        '_id': i,
                        'owner': { 'name': 'Bang Ding' },
                        'createdAt': '01-01-1980',
                        'content': 'Seeing Triple?',
                        'likeValue': i * 2,
                        'userIsLiked': false,
                    }} />
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

                    <PostType type={postType} />

                    <div className="py-2"></div>

                    {postType === 'event' ?
                        <div className="flex flex-row space-x-2 self-start">
                            {!editMode ?
                                <>
                                    <InputField title="Event Start" placeholder="Event Start" active={false}
                                        value={FormatDateTime(eventStartDateTime)} width='full' />
                                    <InputField title="Event End" placeholder="Event End" active={false}
                                        value={FormatDateTime(eventEndDateTime)} width='full' />
                                </>
                                :
                                <>
                                    <InputDate title="Event Start" width='full' value={eventStartDateTime} onChange={(e) => setEventStartDateTime(e.target.value)} />
                                    <InputDate title="Event End" width='full' value={eventEndDateTime} onChange={(e) => setEventEndDateTime(e.target.value)} />
                                </>
                            }
                        </div>
                        :
                        <></>
                    }

                    {postType === 'donation' ?
                        <>
                            <div className="text-text-primary text-xl">
                                Donation Goal
                            </div>
                            <div className="flex flex-row items-center space-x-4 text-text-primary">
                                <div className="flex flex-row items-center gap-x-4 w-1/2">
                                    ${donationCurrent}
                                    <div className="grow">
                                        <SmoothProgressBar title='Donation' floorValue={donationCurrent} ceilingValue={donationGoal} />
                                    </div>
                                    ${donationGoal}
                                </div>
                                <RectangleButton title="Donate" onClick={() => setDisplayDonationPopup(!displayDonationPopup)}
                                    heroIcon={<CreditCardIcon />} colour="bg-button-green" />
                            </div>
                        </>
                        :
                        <></>
                    }

                    <Divider padding={2} />

                    {!editMode ?
                        <div className="text-text-primary whitespace-pre">
                            {postContent}
                        </div>
                        :
                        <>
                            <InputTextBox title="Editing Post" placeholder="Editing Post" height='96'
                                value={postContent} width='full' onChange={(e) => setPostContent(e.target.value)} />
                            <div className="flex flex-row items-center space-x-2 justify-between">
                                <div className="grow">
                                    <InputFile title="Upload Image" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { return }} />
                                </div>
                                <div className="pt-4">
                                    <RectangleButton title="Remove Current Image" onClick={handleDelete} heroIcon={<TrashIcon />} colour="bg-button-red" />
                                </div>
                            </div>
                        </>
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
                        organisationName={organisationName}
                        organisationDescription={organisationDescription}
                        createDate={organisationCreateDate}
                        numberPosts={organisationPosts}
                    />
                </div>
            </div>

            <Popup title="Make Donation"
                variableThatDeterminesIfPopupIsActive={displayDonationPopup}
                setVariableThatDeterminesIfPopupIsActive={setDisplayDonationPopup}
                onSubmit={undefined}
            >
                <InputField title="Card Number" type="text" width='full' active={false}
                    value={'12781298367918236'} />

                {/* todo expiry month and year */}

                <InputField title="CVC" placeholder="Enter CVC" type="number" width='full' additionalProps={{ min: '1', max: '999', step: '1' }}
                    value={CVC} onChange={(e) => setCVC(e.target.value)} />

                <InputField title="Donation Amount" placeholder="Enter Donation Amount" type="number" width='full' additionalProps={{ min: '1', step: '0.01' }}
                    value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
            </Popup>
        </Layout>
    );
}
