// React / Packages
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import validator from "validator";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import { InputField, InputTextBox, InputFile, InputDate } from "../components/Inputs";
import { RectangleButton, Tabs } from "../components/Buttons";
import { Divider } from "../components/Miscellaneous";

// Assets
import { CalendarDaysIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/org-banner.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { postNew } from "../apis/exportedAPIs";
import { useParams } from "react-router-dom";

export default function NewPost() {
    const { user } = useAuthContext();
    const { id } = useParams();

    const navigate = useNavigate();

    const [selectedElement, setSelectedElement] = useState('discussion');

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [eventStartDateTime, setEventStartDateTime] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventCapacity, setEventCapacity] = useState('');
    const [donation, setDonation] = useState('');
    const [image, setImage] = useState([]);

    function handlePostCreated() {
        navigate(`../organisation/${id}`);
    }

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

    async function handleCreatePost() {
        let response = null;

        const sanitisedTitle = validator.escape(validator.trim(title));
        const sanitisedMessage = validator.escape(validator.trim(message));

        if (!sanitisedTitle) {
            toast.error("Please do not leave the title blank!");
            return false;
        }
        if (!sanitisedMessage) {
            toast.error("Please do not leave the message blank!");
            return false;
        }

        if (selectedElement === "discussion") {
            response = await postNew({
                title: sanitisedTitle,
                description: sanitisedMessage,
                organisation: id,
                attachment: image,
            });
        }
        else if (selectedElement === "event") {
            if (!validateDate()) {
                toast.error("Please select a date within a year from now!");
                return;
            }

            const sanitisedCapacity = validator.escape(validator.trim(eventCapacity));
            if (!validator.isNumeric(sanitisedCapacity)) {
                toast.error("Capacity has be a value!");
                return;
            }
            if(!validator.isInt(sanitisedCapacity, {gt: 1, lt: 100})) {
                toast.error("Please enter a capacity from 2 to 100!");
                return;
            }

            const sanitisedLocation = validator.escape(validator.trim(eventLocation));
            if (!sanitisedLocation) {
                toast.error("Please do not leave the location blank!");
                return false;
            }

            response = await postNew({
                title: sanitisedTitle,
                description: sanitisedMessage,
                organisation: id,
                event: selectedElement === "event",
                event_location: sanitisedLocation,
                event_capacity: sanitisedCapacity,
                event_time: eventStartDateTime,
                attachment: image,
            });
        }
        else if (selectedElement === "donation") {
            if (!donation) {
                toast.error("Please do not leave the donation goal blank!");
                return;
            }

            const sanitisedDonationGoal = validator.escape(validator.trim(donation));
            if (!validator.isNumeric(sanitisedDonationGoal)) {
                toast.error("Amount has be a value!");
                return;
            }
            if (!validator.isFloat(sanitisedDonationGoal, {gt: 0.00, lt: 1000000})) {
                toast.error("Invalid amount!");
                return;
            }
            if (!validator.isCurrency(sanitisedDonationGoal, {digits_after_decimal: [0, 1, 2]})) {
                toast.error("Invalid currency format!");
                return;
            }

            response = await postNew({
                title: sanitisedTitle,
                description: sanitisedMessage,
                organisation: id,
                donation: selectedElement === "donation",
                donation_goal: sanitisedDonationGoal,
                attachment: image,
            });
        }
        
        const json = await response.json();

        if (response.ok) {
            toast.success("Successfully created a new post!");
            handlePostCreated();
        } else {
            toast.error(json.error);
        }
    }

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="New Post" />
            </section>

            <div className="flex flex-col p-4 gap-2">
                <Tabs title="Post Categories" tabs={['discussion', 'event', 'donation']} heroIconsArr={[<ChatBubbleLeftRightIcon />, <CalendarDaysIcon />, <CurrencyDollarIcon />]}
                    onClick={(e) => setSelectedElement(e.target.getAttribute('data-value'))} />

                <div className="-mt-2">
                    <Divider padding={0} />
                </div>

                <InputField title="Post Title" placeholder="Enter Post Title" type="text" width='full'
                    value={title} onChange={(e) => setTitle(e.target.value)} />

                <InputTextBox title="Your Message" placeholder="Write your thoughts here" width='full'
                    value={message} onChange={(e) => setMessage(e.target.value)} />

                {selectedElement === 'event' &&
                    <div className="flex flex-col flex-wrap">
                        <div className="w-1/5 min-w-fit">
                            <InputDate title="Event Start" value={eventStartDateTime} onChange={(e) => setEventStartDateTime(e.target.value)} />
                        </div>
                        <div className="w-1/5 min-w-fit">
                            <InputField title="Capacity" placeholder="Enter Event Capacity" type="number"
                                value={eventCapacity} onChange={(e) => setEventCapacity(e.target.value)} additionalProps={{ min: '1', step: '1' }} />
                        </div>
                        <div className="w-full min-w-fit">
                            <InputField title="Location" placeholder="Enter Event Location" type="text"
                                value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                        </div>
                    </div>
                }

                {selectedElement === 'donation' &&
                    <InputField title="Donation Goal ($)" placeholder="Enter Donation Goal" type="number" width='1/6' additionalProps={{ min: '1', step: '0.01' }}
                        value={donation} onChange={(e) => setDonation(e.target.value)} />}

                <InputFile title="Upload Image" width='full' accept=".png,.jpeg,.jpg" onChange={(e) => { setImage([...image, e.target.files[0]]) }} />

                <div className="self-start">
                    <RectangleButton title="Submit" heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" onClick={(e) => { handleCreatePost() }} />
                </div>
            </div>
        </Layout>
    )
}
