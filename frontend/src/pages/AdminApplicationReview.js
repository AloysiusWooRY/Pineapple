// React / Packages
import React, { useState } from "react";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import Popup from "../components/Popup";
import { RectangleButton, StandardDropdown, Tabs } from "../components/Buttons";
import { ApprovalType, Divider } from "../components/Miscellaneous";
import { InputField, InputTextBox, SearchField } from "../components/Inputs";

// Assets
import { NewspaperIcon, ClipboardIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-admin-moderation.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function AdminApplicationReview() {
    const { user } = useAuthContext();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchField, setSearchField] = useState('');

    const [viewingApplicationMode, setViewingApplicationMode] = useState(false);
    const [applicationName, setApplicationName] = useState('');
    const [applicationDescription, setApplicationDescription] = useState('');

    function GenerateReviews() {
        const tableData = [
            { date: '10-10-2023', organisationName: 'Organ Isation', approvalStatus: <ApprovalType type="pending" /> },
            { date: '12-10-2023', organisationName: 'WorseHelp', approvalStatus: <ApprovalType type="approved" /> },
        ];

        return tableData;
    }

    function HandleLoadApplication(e) {
        setApplicationName(e);
        setApplicationDescription(e);

        setViewingApplicationMode(true);
    }

    function HandleJudgeApplication(e, approved) {
        e.preventDefault();

        console.log(approved);

        setViewingApplicationMode(false);
    }

    return (
        <Layout>
            <section className="flex flex-col">
                <Banner image={BannerImage} title="Application Review" />

                <div className="flex flex-row items-center justify-between">
                    <div className="w-1/5 my-2">
                        <SearchField title="Search" bottomPadding={0} value={searchField} onChange={(e) => { setSearchField(e.target.value); }} />
                    </div>
                    <div className="w-1/5 my-2">
                        <StandardDropdown title="Sort By" bottomPadding={0} value={sortBy} options={['newest', 'status']} onChange={(e) => { setSortBy(e.target.value); }} />
                    </div>
                </div>

                <Tabs title="Application Status" tabs={['all', 'pending', 'approved']} heroIconsArr={[<NewspaperIcon />, <ClipboardIcon />, <CheckIcon />]}
                    onClick={(e) => setSelectedCategory(e.target.getAttribute('data-value'))} />

                <Divider padding={0} />

                <div className="mt-2 w-full">
                    <Table rows={GenerateReviews()} title="Applications" onClick={(e) => HandleLoadApplication(e.target.parentElement.getAttribute('data-index'))} />
                </div>
            </section>

            <Popup title="Viewing Application" overrideButton
                variableThatDeterminesIfPopupIsActive={viewingApplicationMode}
                setVariableThatDeterminesIfPopupIsActive={setViewingApplicationMode}
            >
                <InputField title="Name of Organisation" type="text" width='full' active={false}
                    value={applicationName} />
                <InputTextBox title="Description" width='full' active={false}
                    value={applicationDescription} />

                <div className="flex flex-col pb-2 space-y-2 items-start justify-between">
                    <div>
                        <span className="grow text-text-primary">Banner</span>
                        <img
                            id="image-banner"
                            src="https://wiki.teamfortress.com/w/images/2/2a/Main_Page_event_Scream_Fortress_2023.png"
                            height="256"></img>
                    </div>
                    <div>
                        <span className="grow text-text-primary">Poster</span>
                        <img
                            id="image-poster"
                            src="https://wiki.teamfortress.com/w/images/d/db/Buffed_blu_spy.jpg"
                            height="256"></img>
                    </div>
                </div>

                <div className="flex flex-row pt-4 space-x-2 self-start">
                    <RectangleButton title="Approve" forForm heroIcon={<CheckIcon />} colour="bg-button-green" onClick={(e) => HandleJudgeApplication(e, true)} />
                    <RectangleButton title="Reject" forForm heroIcon={<XMarkIcon />} colour="bg-button-red" onClick={(e) => HandleJudgeApplication(e, false)} />
                </div>
            </Popup>
        </Layout >
    )
}
