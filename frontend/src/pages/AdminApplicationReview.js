// React / Packages
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Components
import { FormatDateTime, constructImgResourceURL } from "../components/componentUtils";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import Popup from "../components/Popup";
import { RectangleButton, StandardDropdown, Tabs } from "../components/Buttons";
import { ApprovalType, Divider } from "../components/Miscellaneous";
import { InputField, InputTextBox } from "../components/Inputs";

// Assets
import { NewspaperIcon, ClipboardIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-application-review.png";

// API
import { adminApplication, adminApplicationIdApprove, adminApplicationIdReject } from "../apis/exportedAPIs";

export default function AdminApplicationReview() {
    const [allOrganisations, setAllOrganisations] = useState(null);
    const [allOrganisationsFiltered, setAllOrganisationsFiltered] = useState([]);
    const [organisationSubmitted, setOrganisationSubmitted] = useState(false);

    const [sortBy, setSortBy] = useState('newest');
    // const [searchField, setSearchField] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);
    const [isSorted, setIsSorted] = useState(false);

    const [viewingApplicationMode, setViewingApplicationMode] = useState(false);

    const [applicationName, setApplicationName] = useState('');
    const [applicationOrganisationId, setApplicationOrganisationId] = useState('');
    const [applicationDescription, setApplicationDescription] = useState('');
    const [applicationImagePoster, setApplicationImagePoster] = useState('');
    const [applicationImageBanner, setApplicationImageBanner] = useState('');
    const [applicationApprovedStatus, setApplicationApprovedStatus] = useState(false);

    useEffect(() => {
        async function getAllApplications() {
            const response = await adminApplication({
                status: "",
                filter: "",
            });
            const json = await response.json();

            if (response.ok) {
                setAllOrganisations(json.organisations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setAllOrganisationsFiltered(json.organisations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setOrganisationSubmitted(false);
            } else {
                toast.error(json.error);
            }
        }
        getAllApplications();
    }, [organisationSubmitted]);

    function resetPopup() {
        setApplicationName('');
        setApplicationDescription('');
        setApplicationImagePoster('');
        setApplicationImageBanner('');
        setApplicationOrganisationId('');
        setApplicationApprovedStatus('');

        setViewingApplicationMode(false);
    }

    function GenerateReviews() {
        if (!allOrganisations) {
            return [];
        }

        return allOrganisations.map((item) => ({
            date: FormatDateTime(item.createdAt),
            organisationName: item.name,
            approvalStatus: <ApprovalType type={item.approved ? "approved" : "pending"} />
        }));
    }

    function handleCategoryFilter(e) {
        const category = e.target.getAttribute('data-value');
        let tableData = [];

        if (category != null) {
            const filteredReviews = allOrganisations.filter(item => {
                if (category === "pending") {
                    setIsFiltered(true);
                    return item.approved === false;
                }
                else if (category === "approved") {
                    setIsFiltered(true);
                    return item.approved === true;
                }
                setSortBy("newest");
                setIsFiltered(false);
                return true;
            });

            filteredReviews.map((item) => {
                tableData.push({
                    date: FormatDateTime(item.createdAt),
                    organisationName: item.name,
                    approvalStatus: <ApprovalType type={item.approved ? "approved" : "pending"} />
                })
            });

            setAllOrganisationsFiltered(tableData);
        }
    }

    function handleSorted(e) {
        let sortedTableData = [];
        setSortBy(e.target.value);

        if (!isFiltered) {
            if (e.target.value === "status") {
                setIsSorted(true);
                sortedTableData = GenerateReviews().slice().sort((a, b) => {
                    const typeA = a.approvalStatus.props.type;
                    const typeB = b.approvalStatus.props.type;

                    if (typeA === 'pending' && typeB === 'approved') {
                        return -1;
                    } else if (typeA === 'approved' && typeB === 'pending') {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
            else if (e.target.value === "newest" && isSorted) {
                setIsSorted(false);
                sortedTableData = GenerateReviews().slice().sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);

                    return dateB - dateA;
                });
            }
            setAllOrganisationsFiltered(sortedTableData);
        }
    }

    function HandleLoadApplication(e) {
        setApplicationName(allOrganisations[e].name);
        setApplicationDescription(allOrganisations[e].description);
        setApplicationImagePoster(allOrganisations[e].imagePath.poster);
        setApplicationImageBanner(allOrganisations[e].imagePath.banner);
        setApplicationOrganisationId(allOrganisations[e]._id);
        setApplicationApprovedStatus(allOrganisations[e].approved);

        setViewingApplicationMode(true);
    }

    async function HandleJudgeApplication(e, approved) {
        e.preventDefault();

        let response = null;
        if (approved) {
            response = await adminApplicationIdApprove({
                id: applicationOrganisationId
            });
        } else {
            response = await adminApplicationIdReject({
                id: applicationOrganisationId
            });
        }
        const json = await response.json();

        if (response.ok) {
            approved ? toast.success("Organisation: " + applicationName + " has been approved!") : toast.success("Organisation: " + applicationName + " has been rejected!");
            setOrganisationSubmitted(true);
        } else {
            toast.error(json.error);
        }

        resetPopup();
    }

    return (
        <Layout>
            <section className="flex flex-col">
                <Banner image={BannerImage} title="Application Review" />

                <div className="flex flex-row items-center justify-between">
                    {/* <div className="w-1/5 my-2">
                        <SearchField title="Search" bottomPadding={0} value={searchField} onChange={(e) => { setSearchField(e.target.value); }} />
                    </div> */}
                    <Tabs title="Application Status" tabs={['all', 'pending', 'approved']} heroIconsArr={[<NewspaperIcon />, <ClipboardIcon />, <CheckIcon />]}
                        onClick={(e) => handleCategoryFilter(e)} />
                    <div className="w-1/5">
                        <StandardDropdown title="Sort By" bottomPadding={0} value={sortBy} options={['newest', 'status']} onChange={(e) => { handleSorted(e); }} />
                    </div>
                </div>

                <Divider padding={0} />

                <div className="mt-2 w-full">
                    {allOrganisations && allOrganisationsFiltered && (
                        allOrganisationsFiltered.length > 0 ?
                            (
                                isFiltered || isSorted ?
                                    <Table rows={allOrganisationsFiltered}
                                        title="Applications"
                                        onClick={(e) => HandleLoadApplication(e.target.parentElement.getAttribute('data-index'))} />
                                    :
                                    <Table rows={GenerateReviews()}
                                        title="Applications"
                                        onClick={(e) => HandleLoadApplication(e.target.parentElement.getAttribute('data-index'))} />
                            )
                            :
                            <h1 className="grow text-text-primary py-4 text-3xl text-center">🍍No Organisations Here🍍</h1>
                    )}
                </div>
            </section>

            <Popup title="Viewing Application" overrideButton
                variableThatDeterminesIfPopupIsActive={viewingApplicationMode}
                setVariableThatDeterminesIfPopupIsActive={resetPopup} >

                <InputField title="Name of Organisation" type="text" width='full' active={false} value={applicationName} />
                <InputTextBox title="Description" width='full' active={false} value={applicationDescription} />

                <div className="flex flex-col pb-2 space-y-2 items-start justify-between">
                    <div>
                        <span className="grow text-text-primary">Banner</span>
                        <img
                            id="image-banner"
                            alt="Organisation Banner"
                            src={constructImgResourceURL(applicationImageBanner)}></img>
                    </div>
                    <div>
                        <span className="grow text-text-primary">Poster</span>
                        <img
                            id="image-poster"
                            alt="Organisation Poster"
                            src={constructImgResourceURL(applicationImagePoster)}></img>
                    </div>
                </div>

                <div className="flex flex-row pt-4 space-x-2 self-start">
                    {!applicationApprovedStatus && <RectangleButton title="Approve" forForm heroIcon={<CheckIcon />} colour="bg-button-green" onClick={(e) => HandleJudgeApplication(e, true)} />}
                    {!applicationApprovedStatus && <RectangleButton title="Reject" forForm heroIcon={<XMarkIcon />} colour="bg-button-red" onClick={(e) => HandleJudgeApplication(e, false)} />}
                </div>
            </Popup>
        </Layout >
    )
}
