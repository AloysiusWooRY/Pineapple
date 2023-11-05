// React / Packages
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

// Components
import validator from "validator";
import { RectangleButton, StandardDropdown, ToggleButton } from '../components/Buttons';
import Comment from "../components/Comment";
import { SmoothProgressBar } from "../components/CustomProgressBar";
import { InputDate, InputField, InputFile, InputTextBox } from '../components/Inputs';
import { Divider, PostType } from '../components/Miscellaneous';
import Popup from "../components/Popup";
import SideBarOrganisationInfo from '../components/SidebarOrganisationInfo';
import { FormatDateTime, constructImgResourceURL, databaseDateTimeToISO, timeAgo } from "../components/componentUtils";
import Layout from "../layouts/Layout";

// Assets
import { ArrowDownCircleIcon as ArrowDownCircleOutlineIcon, ArrowUpCircleIcon as ArrowUpCircleOutlineIcon } from "@heroicons/react/24/outline";
import { ArrowDownCircleIcon as ArrowDownCircleSolidIcon, ArrowUpCircleIcon as ArrowUpCircleSolidIcon, CreditCardIcon, PaperAirplaneIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";

// API
import { accountPaymentInfoPOST, commentAll, commentIdDislike, commentIdLike, commentNew, postIdDEL, postIdDislike, postIdLike, postIdPATCH, postIdPOST, replyIdDislike, replyIdLike, replyNew, transactionNew } from "../apis/exportedAPIs";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Post() {
    const { user } = useAuthContext();
    const { id } = useParams();

    const navigate = useNavigate();

    const [organisationId, setOrganisationId] = useState(null);
    const [organisationName, setOrganisationName] = useState('');
    const [organisationDetails, setOrganisationDetails] = useState(null);

    const [poster, setPoster] = useState('');
    const [postTime, setPostTime] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState('');
    const [postType, setPostType] = useState('');
    const [postLikes, setPostLikes] = useState(0);
    const [posterLiked, setPosterLiked] = useState(0);
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
    const [allComments, setAllComments] = useState([]);
    const [commentsOrRepliesHaveUpdates, setCommentsOrRepliesHaveUpdates] = useState(false);

    const [creditCardNumber, setCreditCardNumber] = useState(null);
    const [expiryMonthYear, setExpiryMonthYear] = useState(null);

    const [postEdited, setPostEdited] = useState(false);

    // Load the post and organisation details for the selected post
    useEffect(() => {
        async function fetchData() {
            const response = await postIdPOST({ id });
            const json = await response.json();

            if (response.ok) {
                setOrganisationId(json.post.organisation._id);
                setOrganisationName(json.post.organisation.name);
                setOrganisationDetails(json.post.organisation);

                setPostContent(json.post.description);
                setPostTitle(json.post.title);
                setPoster(json.post.owner.name);
                setPostImage(json.post.imagePath);
                setPostType(json.post.donation ? "donation" : json.post.event ? "event" : "discussion");
                setPostTime(timeAgo(json.post.updatedAt));
                setPosterLiked(json.post.liked);
                setPostLikes(json.post.likes);

                if (json.post.donation) {
                    setDonationCurrent(json.post.donation.amount);
                    setDonationGoal(json.post.donation.goal);
                }
                if (json.post.event) {
                    setEventLocation(json.post.event.location);
                    setEventCapacity(json.post.event.capacity);
                    setEventStartDateTime(json.post.event.time);
                }
                setPostEdited(false);
            } else {
                toast.error(json.error);
            }
        }
        fetchData();
    }, [id, postEdited]);

    // Fetches comments, runs on startup or on comment submission
    useEffect(() => {
        async function fetchComments() {
            const response = await commentAll({ post: id });
            const json = await response.json();

            if (response.ok) {
                setAllComments(json.comments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
                setCommentsOrRepliesHaveUpdates(false);
            } else {
                toast.error(json.error);
            }
        }

        fetchComments();
    }, [id, commentsOrRepliesHaveUpdates]);

    useEffect(() => {
        async function getUserPaymentInfo() {
            const response = await accountPaymentInfoPOST();
            const json = await response.json();

            if (response.ok) {
                setCreditCardNumber(json.cardNumber);
                setExpiryMonthYear(json.expirationDate);
            }
        }
        getUserPaymentInfo();
    }, []);

    function validateDate() {
        // Calculate the current date
        const currentDate = new Date();
        const givenDate = new Date(eventStartDateTime);

        // Calculate the difference in milliseconds
        const timeDifference = givenDate - currentDate;

        // Calculate the number of milliseconds in a year
        const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;

        // Check if the date is within 1 year in the future
        const isWithinOneYear = timeDifference >= 0 && timeDifference <= millisecondsInYear;

        if (isWithinOneYear) return true;
        else return false;
    }

    function PopulateComments() {
        let comments = [];

        (allComments && allComments.length > 0) ?
            allComments.map((comment) => {
                comments.push(
                    <div key={"key-comment-" + comment._id}>
                        <Comment id={comment._id} handlePutReply={handlePutReply} isReply={false} commentContent={{
                            '_id': comment._id,
                            'owner': { 'name': comment.owner.name },
                            'createdAt': FormatDateTime(comment.updatedAt),
                            'content': comment.content,
                            'likeValue': comment.likes,
                            'userIsLiked': comment.liked,
                        }} handleLike={handleLikeCommentOrReply} handleDislike={handleDisikeCommentOrReply} />
                    </div>

                );
                if (comment.replies.length > 0) {
                    comment.replies.map(reply => {
                        comments.push(
                            <div key={"key-reply-" + reply._id}>
                                <Comment id={comment._id} handlePutReply={handlePutReply} isReply={true} commentContent={{
                                    '_id': reply._id,
                                    'owner': { 'name': reply.owner.name },
                                    'createdAt': FormatDateTime(reply.updatedAt),
                                    'content': reply.content,
                                    'likeValue': reply.likes,
                                    'userIsLiked': reply.liked,
                                }} handleLike={handleLikeCommentOrReply} handleDislike={handleDisikeCommentOrReply} />
                            </div>

                        );
                    });
                }
            })
            : comments = [];

        return comments;
    }

    async function handleDelete() {
        if (!window.confirm("This action cannot be undone!\nAre you sure you want to delete this post?")) {
            return;
        }

        const response = await postIdDEL({ id, });
        const json = await response.json();

        if (response.ok) {
            navigate(`/organisation/${organisationId}`, { replace: true });
            toast.success("Post has been deleted!");
        } else {
            toast.error(json.error);
        }

    }

    async function handleEdit() {
        let response = null;
        if (editMode) {

            const sanitisdDescription = validator.escape(validator.trim(postContent));
            if (!sanitisdDescription) {
                toast.error("Please do not leave the location blank!");
                return false;
            }

            if (postType === "event") {
                if (!validateDate()) {
                    toast.error("Please select a date within a year from now!");
                    return;
                }

                const sanitisedCapacity = validator.escape(validator.trim(eventCapacity.toString()));
                if (!validator.isNumeric(sanitisedCapacity)) {
                    toast.error("Capacity has be a value!");
                    return;
                }
                if (!validator.isInt(sanitisedCapacity, { gt: 1, lt: 10000 })) {
                    toast.error("Please enter a capacity from 2 to 9999!");
                    return;
                }

                const sanitisedLocation = validator.escape(validator.trim(eventLocation));
                if (!sanitisedLocation) {
                    toast.error("Please do not leave the location blank!");
                    return false;
                }

                response = await postIdPATCH({
                    id,
                    title: postTitle,
                    description: sanitisdDescription,
                    event: true,
                    donation: false,
                    event_time: databaseDateTimeToISO(eventStartDateTime),
                    event_capacity: sanitisedCapacity,
                    event_location: sanitisedLocation,
                    attachment: newImage,
                });
            }
            if (postType === "donation") {
                response = await postIdPATCH({
                    id,
                    title: postTitle,
                    description: sanitisdDescription,
                    event: false,
                    donation: true,
                    attachment: newImage,
                });
            }
            if (postType === "discussion") {
                response = await postIdPATCH({
                    id,
                    title: postTitle,
                    description: sanitisdDescription,
                    event: false,
                    donation: false,
                    attachment: newImage,
                });
            }
            const json = await response.json();

            if (response.ok) {
                toast.success("Post has been successfully changed!");
                setPostEdited(true);
            } else {
                toast.error(json.error);
                return;
            }
        }

        setEditMode(!editMode);
    }

    function handleCancel() {
        setEditMode(false);
        setPostEdited(true);
    }

    async function handlePutComment() {
        const response = await commentNew({
            post: id,
            content: comment,
        });
        const json = await response.json();

        if (response.ok) {
            toast.success("Commented!");
            setComment("");
            setCommentsOrRepliesHaveUpdates(true);
        } else {
            toast.error(json.error);
        }
    }

    async function handlePutReply(commentId, replyContent) {
        const response = await replyNew({
            comment: commentId,
            content: replyContent,
        });
        const json = await response.json();

        if (response.ok) {
            toast.success("Commented a reply!");
            setComment("");
            setCommentsOrRepliesHaveUpdates(true);
        } else {
            toast.error(json.error);
        }
    }

    function isAllowedToDelete() {
        if (user.isAdmin === true) {
            return true;
        }
        else if (user.name === poster) {
            return true;
        }
        else if (user.moderation.includes(organisationId)) {
            return true;
        }
    }

    function handleSort(e) {
        const sortByValue = e.target.value;
        setSortBy(sortByValue);

        if (sortByValue === "newest") {
            setAllComments(allComments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        }
        else if (sortByValue === "top") {
            setAllComments(allComments.sort((a, b) => b.likes - a.likes));
        }
    }

    function handleDeleteImage(e) {
        e.preventDefault();
        setPostImage('');
        setNewImage('');
    }

    async function likeClick(e) {
        e.preventDefault();

        const response = await postIdLike({ id });
        const json = await response.json();

        if (response.ok) {
            setPostLikes(json.total);
            setPosterLiked(json.value);
        } else {
            toast.error(json.error);
        }
    }

    async function disLikeClick(e) {
        e.preventDefault();

        const response = await postIdDislike({ id });
        const json = await response.json();

        if (response.ok) {
            setPostLikes(json.total);
            setPosterLiked(json.value);
        } else {
            toast.error(json.error);
        }
    }

    async function handleLikeCommentOrReply(e, isReply, id) {
        e.preventDefault();

        const response = isReply ? await replyIdLike({ id }) : await commentIdLike({ id });
        const json = await response.json();

        if (response.ok) {
            const newComments = isReply ? allComments.map(comment => {
                const newReplies = comment.replies.map(reply => {
                    if (reply._id !== id) return reply
                    reply.liked = json.value
                    reply.likes = json.total
                    return reply
                })
                comment.replies = newReplies
                return comment
            }) : allComments.map(comment => {
                if (comment._id !== id) return comment
                comment.liked = json.value
                comment.likes = json.total
                return comment
            })

            setAllComments(newComments)

        } else {
            toast.error(json.error);
        }
    }

    async function handleDisikeCommentOrReply(e, isReply, id) {
        e.preventDefault();

        const response = isReply ? await replyIdDislike({ id }) : await commentIdDislike({ id });
        const json = await response.json();

        if (response.ok) {
            const newComments = isReply ? allComments.map(comment => {
                const newReplies = comment.replies.map(reply => {
                    if (reply._id !== id) return reply
                    reply.liked = json.value
                    reply.likes = json.total
                    return reply
                })
                comment.replies = newReplies
                return comment
            }) : allComments.map(comment => {
                if (comment._id !== id) return comment
                comment.liked = json.value
                comment.likes = json.total
                return comment
            })

            setAllComments(newComments)
        } else {
            toast.error(json.error);
        }
    }

    async function newTransaction(e) {
        e.preventDefault();

        const sanitisedCVC = validator.escape(validator.trim(CVC));
        if (!validator.isInt(sanitisedCVC, { gt: 99, lt: 999 })) {
            setDonationError("Please enter a valid CVC!");
            return;
        }

        if (!donationAmount) {
            setDonationError("Please do not leave the donation goal blank!");
            return;
        }

        const sanitisedDonationAmount = validator.escape(validator.trim(donationAmount));
        if (!validator.isNumeric(sanitisedDonationAmount)) {
            setDonationError("Amount has be a value!");
            return;
        }
        if (!validator.isFloat(sanitisedDonationAmount, { gt: 0.00, lt: 1000000 })) {
            setDonationError("Invalid amount!");
            return;
        }
        if (!validator.isCurrency(sanitisedDonationAmount, { digits_after_decimal: [0, 1, 2] })) {
            setDonationError("Invalid currency format!");
            return;
        }

        const response = await transactionNew({
            post: id,
            amount: sanitisedDonationAmount,
            cvc: sanitisedCVC,
        });
        const json = await response.json();

        if (response.ok) {
            toast.success("Transaction completed successfully!");
            setDisplayDonationPopup(false);
            setCVC("");
            setDonationAmount("");
            setPostEdited(true);
            setDonationError("");
        } else {
            toast.error(json.error);
        }
    }

    return (
        <Layout>
            <div className="flex flex-row items-start gap-2">
                <div className="flex flex-none flex-col gap-2 p-2 text-text-primary text-sm">
                    {posterLiked !== null ?
                        (posterLiked === 1 ?
                            <ArrowUpCircleSolidIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />
                            :
                            <ArrowUpCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />)
                        :
                        <ArrowUpCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => likeClick(e)} />}
                    <p className="text-center text-2xl">{postLikes}</p>
                    {posterLiked !== null ?
                        (posterLiked === -1 ?
                            <ArrowDownCircleSolidIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />
                            :
                            <ArrowDownCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />)
                        :
                        <ArrowDownCircleOutlineIcon className="h-7 cursor-pointer" onClick={(e) => disLikeClick(e)} />}
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

                    {postType === 'event' ?
                        <>
                            <Divider padding={2} />

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
                            <Divider padding={2} />

                            <div className="text-text-primary text-xl">
                                Donation Goal
                            </div>
                            <div className="flex flex-row items-center space-x-4 text-text-primary">
                                <div className="flex flex-col px-8 py-2 items-center space-y-4 text-text-primary bg-background-minor rounded-xl">
                                    <p className="font-bold underline">
                                        Current
                                    </p>
                                    ${donationCurrent}
                                </div>

                                <div className="flex flex-row items-center gap-x-4 grow">
                                    $0
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

                    {postImage ?
                        <div className="bg-background-minor rounded-3xl">
                            <img
                                src={constructImgResourceURL(postImage)}
                                alt={postTitle}
                                className="h-72 w-full object-contain max-h-72 rounded"
                            />
                        </div>
                        :
                        <></>}

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
                                    <RectangleButton title="Remove Current Image" onClick={(e) => handleDeleteImage(e)} heroIcon={<TrashIcon />} colour="bg-button-red" />
                                </div>
                            </div>
                        </>
                    }

                    <div className="py-2"></div>


                    <div className="flex flex-row space-x-2 self-start">
                        {(user.name === poster) && <ToggleButton title="Edit" active={editMode} onClick={(e) => { handleEdit() }} />}
                        {editMode && <RectangleButton title="Cancel" onClick={handleCancel} heroIcon={<XCircleIcon />} colour="bg-yellow-500" />}
                        {isAllowedToDelete() && <RectangleButton title="Delete" onClick={handleDelete} heroIcon={<TrashIcon />} colour="bg-button-red" />}
                    </div>

                    <Divider padding={2} />

                    <InputTextBox title="Your Message" placeholder="Write your thoughts here"
                        value={comment} width='full' onChange={(e) => setComment(e.target.value)} />
                    <div className="flex flex-row space-x-2 self-end">
                        <RectangleButton title="Submit" onClick={handlePutComment} heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" />
                    </div>


                    <Divider padding={2} />

                    <div className="w-1/5">
                        <StandardDropdown title="Sort By" value={sortBy} options={['newest', 'top']} onChange={(e) => handleSort(e)} />
                    </div>

                    <div className="flex flex-col gap-4">
                        {allComments && allComments.length > 0 && <PopulateComments />}
                    </div>
                </div>


                {organisationDetails && <SideBarOrganisationInfo
                    organisationContent={{
                        '_id': organisationDetails._id,
                        'name': organisationDetails.name,
                        'description': organisationDetails.description,
                        'posterPath': organisationDetails.imagePath.poster,
                        'posts': organisationDetails.posts,
                        'createDate': organisationDetails.createdAt,
                    }}
                />}
            </div>

            <Popup title="Make Donation"
                variableThatDeterminesIfPopupIsActive={displayDonationPopup}
                setVariableThatDeterminesIfPopupIsActive={setDisplayDonationPopup}
                onSubmit={newTransaction}
            >
                <InputField title="Card Number" type="text" width='full' active={false}
                    value={creditCardNumber ? creditCardNumber : ""} />

                <InputField title="Card Expiry" type="text" width='full' active={false}
                    value={expiryMonthYear ? expiryMonthYear : ""} />

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
