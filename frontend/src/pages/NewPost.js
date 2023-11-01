// React / Packages
import React, { useState } from "react";

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

export default function NewPost() {
    const { user } = useAuthContext();

    const [selectedElement, setSelectedElement] = useState('discussion');

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [eventStartDateTime, setEventStartDateTime] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventCapacity, setEventCapacity] = useState('');
    const [donation, setDonation] = useState('');
    const [image, setImage] = useState([]);

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
                    <RectangleButton title="Submit" heroIcon={<PaperAirplaneIcon />} colour="bg-button-green" onClick={(e) => { console.log("Submit me!") }} />
                </div>
            </div>
        </Layout>
    )
}
