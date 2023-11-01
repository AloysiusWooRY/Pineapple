// React / Packages
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import { FormatDateTime, databaseDateTimeToISO } from "../components/componentUtils";
import Layout from "../layouts/Layout";
import SideBarOrganisationInfo from '../components/SidebarOrganisationInfo';
import Comment from "../components/Comment";
import Popup from "../components/Popup";
import { InputField, InputTextBox, InputDate, InputFile } from '../components/Inputs';
import { ToggleButton, RoundedButton, StandardDropdown, RectangleButton } from '../components/Buttons';
import { Divider, PostType } from '../components/Miscellaneous';
import { SmoothProgressBar } from "../components/CustomProgressBar";

// Assets
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowUpCircleIcon as ArrowUpCircleSolidIcon, ArrowDownCircleIcon as ArrowDownCircleSolidIcon, CreditCardIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { postIdPOST, postIdDEL, postIdPATCH, postIdLike } from "../apis/exportedAPIs";

export default function Post() {
    const { user } = useAuthContext();
    const { id } = useParams();

    const navigate = useNavigate();

    const [organisationId, setOrganisationId] = useState(null);
    const [organisationName, setOrganisationName] = useState('');
    const [organisationDescription, setOrganisationDescription] = useState('');
    const [organisationCreateDate, setOrganisationCreateDate] = useState('');
    const [organisationPosts, setOrganisationPosts] = useState(0);

    const [poster, setPoster] = useState('');
    const [postTime, setPostTime] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postType, setPostType] = useState('event');
    const [sortBy, setSortBy] = useState('newest');

    const [eventLocation, setEventLocation] = useState('');
    const [eventCapacity, setEventCapacity] = useState(0);
    const [eventStartDateTime, setEventStartDateTime] = useState('');

    const [donationCurrent, setDonationCurrent] = useState(0);
    const [donationGoal, setDonationGoal] = useState(0);

    const [displayDonationPopup, setDisplayDonationPopup] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [CVC, setCVC] = useState('');
    const [donationError, setDonationError] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const [newImage, setNewImage] = useState(null);

    const [comment, setComment] = useState('');
    
    // This is to load the post and organisation details for the selected post
    useEffect(() => {
        async function fetchData() {
            const response = await postIdPOST({ id });
            const json = await response.json();

            if (response.ok) {
                setOrganisationName(json.post.organisation.name);
                setOrganisationDescription(json.post.organisation.description);
                setOrganisationCreateDate(json.post.organisation.createdAt);
                setOrganisationPosts(json.post.organisation.posts);

                setPostContent(json.post.description);
                setPostTitle(json.post.title);
                setPoster(json.post.owner.name);
                setPostType(json.post.donation ? "donation" : json.post.event ? "event" : "discussion");
                setPostTime(json.post.updatedAt);
                setOrganisationId(json.post.organisation._id);

                if (json.post.donation) {
                    setDonationCurrent(json.post.donation.amoount);
                    setDonationGoal(json.post.donation.goal);
                }
                if (json.post.event) {
                    setEventLocation(json.post.event.location);
                    setEventCapacity(json.post.event.capacity);
                    setEventStartDateTime(json.post.event.time);
                }
            } else {
                toast.error(json.error);
            }
        }
        fetchData();
    }, []);

    function PopulateComments() {
        let comments = [];

        for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
                comments.push(
                    <div key={"key-comment-" + i}>
                        <Comment isReply={false} commentContent={{
                            '_id': i,
                            'owner': { 'name': 'Ho Li' },
                            'createdAt': '01-01-1970',
                            'content': 'Get em\', boys!',
                            'likeValue': i * 2,
                            'userIsLiked': true,
                        }} />
                    </div>

                );
            }
            else {
                comments.push(
                    <div key={"key-comment-" + i}>
                        <Comment isReply={true} commentContent={{
                            '_id': i,
                            'owner': { 'name': 'Bang Ding' },
                            'createdAt': '01-01-1980',
                            'content': 'Seeing Triple?',
                            'likeValue': i * 2,
                            'userIsLiked': false,
                        }} />
                    </div>
                );
            }
        }

        return comments;
    }

    function handleDelete() {
        console.log("handle delete!");
    }

    async function handleEdit() {
        if (editMode) {
            const response = await postIdPATCH({
                id,
                title: postTitle,
                description: postContent,
                event: (postType === 'event' ? true : false),
                event_time: databaseDateTimeToISO(eventStartDateTime),
                event_capacity: eventCapacity,
                event_location: eventLocation,
                donation: (postType === 'donation' ? true : false),
                attachment: newImage,
            });
            const json = await response.json();

            if (response.ok) {
                toast.success("Post has been successfully changed!");
            } else {
                toast.error(json.error);
            }
        }

        setEditMode(!editMode);
    }

    function handleCreatePost() {
        navigate(`../organisation/${organisationId}/post/new`);
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
                        <>
                            {!editMode ?
                                <div className="flex flex-col flex-wrap">
                                    <div className="w-1/5 min-w-fit">
                                        <InputField title="Event Start" active={false} value={FormatDateTime(eventStartDateTime)} />
                                    </div>
                                    <div className="w-1/5 min-w-fit">
                                        <InputField title="Capacity" type="number" active={false} value={eventCapacity} />
                                    </div>
                                    <div className="w-full min-w-fit">
                                        <InputField title="Location" type="text" active={false} value={eventLocation} />
                                    </div>
                                </div>
                                :
                                <div className="flex flex-col flex-wrap">
                                    <div className="w-1/5 min-w-fit">
                                        <InputDate title="Event Start" value={databaseDateTimeToISO(eventStartDateTime)} onChange={(e) => setEventStartDateTime(e.target.value)} />
                                    </div>
                                    <div className="w-1/5 min-w-fit">
                                        <InputField title="Capacity" type="number"
                                            value={eventCapacity} onChange={(e) => setEventCapacity(e.target.value)} additionalProps={{ min: '1', step: '1' }} />
                                    </div>
                                    <div className="w-full min-w-fit">
                                        <InputField title="Location" type="text"
                                            value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                                    </div>
                                </div>
                            }

                            <Divider padding={2} />
                        </>
                        :
                        <></>
                    }

                    {postType === 'donation' ?
                        <>
                            <div className="text-text-primary text-xl">
                                Donation Goal
                            </div>
                            <div className="flex flex-row items-center space-x-4 text-text-primary">
                                <div className="flex flex-row items-center gap-x-4 grow">
                                    ${donationCurrent}
                                    <div className="grow">
                                        <SmoothProgressBar title='Donation' floorValue={donationCurrent} ceilingValue={donationGoal} />
                                    </div>
                                    ${donationGoal}
                                </div>
                                <div className="grow-0">
                                    <RectangleButton title="Donate" onClick={() => setDisplayDonationPopup(!displayDonationPopup)}
                                        heroIcon={<CreditCardIcon />} colour="bg-button-green" />
                                </div>
                            </div>

                            <Divider padding={2} />
                        </>
                        :
                        <></>
                    }

                    {!editMode ?
                        <div className="text-text-primary whitespace-pre-wrap">
                            {postContent}
                        </div>
                        :
                        <>
                            <InputTextBox title="Editing Post" placeholder="Editing Post" height='96'
                                value={postContent} width='full' onChange={(e) => setPostContent(e.target.value)} />
                            <div className="flex flex-row items-center space-x-2 justify-between">
                                <div className="grow">
                                    <InputFile title="Upload Image" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setNewImage(e.target.files[0]) }} />
                                </div>
                                <div className="pt-4">
                                    <RectangleButton title="Remove Current Image" onClick={handleDelete} heroIcon={<TrashIcon />} colour="bg-button-red" />
                                </div>
                            </div>
                        </>
                    }

                    <div className="py-2"></div>

                    <div className="flex flex-row space-x-2 self-start">
                        {(user.name === poster) && <ToggleButton title="Edit" active={editMode} onClick={(e) => { handleEdit() }} />}
                        {editMode && <RectangleButton title="Delete" onClick={handleDelete} heroIcon={<TrashIcon />} colour="bg-button-red" />}
                    </div>

                    <Divider padding={2} />

                    <InputTextBox title="Your Message" placeholder="Write your thoughts here"
                        value={comment} width='full' onChange={(e) => setComment(e.target.value)} />

                    <Divider padding={2} />

                    <div className="w-1/5">
                        <StandardDropdown title="Sort By" value={sortBy} options={['newest', 'top']} onChange={(e) => setSortBy(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <PopulateComments />
                    </div>
                </div>


                <SideBarOrganisationInfo
                    organisationName={organisationName}
                    organisationDescription={organisationDescription}
                    createDate={FormatDateTime(organisationCreateDate)}
                    numberPosts={organisationPosts}
                    onCreateClicked={handleCreatePost}
                />

            </div>

            <Popup title="Make Donation"
                variableThatDeterminesIfPopupIsActive={displayDonationPopup}
                setVariableThatDeterminesIfPopupIsActive={setDisplayDonationPopup}
                onSubmit={undefined}
            >
                <InputField title="Card Number" type="text" width='full' active={false}
                    value={'12781298367918236'} />

                <InputField title="Card Expiry" type="text" width='full' active={false}
                    value={'12/24'} />

                <InputField title="CVC" placeholder="Enter CVC" type="number" width='full' additionalProps={{ min: '1', max: '999', step: '1' }}
                    value={CVC} onChange={(e) => setCVC(e.target.value)} />

                <InputField title="Donation Amount ($)" placeholder="Enter Donation Amount" type="number" width='full' additionalProps={{ min: '1', step: '0.01' }}
                    value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />

                <label id="error-post-donate" className="text-text-warn">
                    {donationError ?? ''}
                </label>
            </Popup>
        </Layout>
    );
}
