// React / Packages
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import Popup from "../components/Popup";
import { RectangleButton, StandardDropdown, Tabs } from "../components/Buttons";
import { ApprovalType, Divider } from "../components/Miscellaneous";
import { InputField, InputTextBox, SearchField } from "../components/Inputs";
import { FormatDateTime } from "../components/componentUtils";

// Assets
import { NewspaperIcon, ClipboardIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BannerImage from "../assets/banner-admin-moderation.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";
import { adminApplication, adminApplicationIdApprove, adminApplicationIdReject } from "../apis/exportedAPIs";

export default function AdminApplicationReview() {
    const { user } = useAuthContext();

    const [allOrganisations, setAllOrganisations] = useState(null);
    const [allOrganisationsFiltered, setAllOrganisationsFiltered] = useState([]);
    const [organisationSubmitted, setOrganisationSubmitted] = useState(false);

    const [sortBy, setSortBy] = useState('newest');
    const [searchField, setSearchField] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);

    const [viewingApplicationMode, setViewingApplicationMode] = useState(false);

    const [applicationName, setApplicationName] = useState('');
    const [applicationOrganisationId, setApplicationOrganisationId] = useState('');
    const [applicationDescription, setApplicationDescription] = useState('');
    const [applicationImagePoster, setApplicationImagePoster] = useState('');
    const [applicationImageBanner, setApplicationImageBanner] = useState('');

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
        console.log("Running")
    }, [organisationSubmitted]);

    function GenerateReviews() {
        let tableData = [];
        allOrganisations != null ? (
            allOrganisations.map((item) => {
                tableData.push({
                    date: FormatDateTime(item.createdAt),
                    organisationName: item.name,
                    approvalStatus: <ApprovalType type={item.approved ? "approved": "pending"}/>
                })
            })
        ) 
        :
        tableData = [
            { date: '10-10-2023', organisationName: 'Organ Isation', approvalStatus: <ApprovalType type="pending" /> },
            { date: '12-10-2023', organisationName: 'WorseHelp', approvalStatus: <ApprovalType type="approved" /> },
        ];

        return tableData;
    }

    function handleCategoryFilter(e) {
        const category = e.target.getAttribute('data-value');
        let tableData = [];

        if(category != null) {
            const filteredReviews = allOrganisations.filter(item => {
                if (category === "pending") {
                    setIsFiltered(true);
                    return item.approved === false;
                }
                else if (category === "approved") {
                    setIsFiltered(true);
                    return item.approved === true;
                }
                setIsFiltered(false);
                return true;
            });

            (filteredReviews && filteredReviews.length > 0) ? (
                filteredReviews.map((item) => {
                    tableData.push({
                        date: FormatDateTime(item.createdAt),
                        organisationName: item.name,
                        approvalStatus: <ApprovalType type={item.approved ? "approved": "pending"}/>
                    })
                })
            )
            :
            tableData = [
                { date: '10-10-2023', organisationName: 'Organ Isation', approvalStatus: <ApprovalType type="pending" /> },
                { date: '12-10-2023', organisationName: 'WorseHelp', approvalStatus: <ApprovalType type="approved" /> },
            ];
            setAllOrganisationsFiltered(tableData);
        }
    }
    
    function handleSorted(e) {
        setSortBy(e.target.value);
        console.log(allOrganisationsFiltered);

        const sortedTableData = allOrganisationsFiltered.slice().sort((a, b) => {
            // Extract the 'type' prop from the 'approvalStatus' objects
            const typeA = a.approvalStatus === 'pending' ? 'pending' : 'approved';
            const typeB = b.approvalStatus === 'pending' ? 'pending' : 'approved';
          
            // Use the 'type' values to compare and sort
            if (typeA === 'pending' && typeB === 'approved') {
              return -1; // 'pending' comes before 'approved'
            } else if (typeA === 'approved' && typeB === 'pending') {
              return 1; // 'approved' comes after 'pending'
            } else {
              return 0; // Keep the order unchanged for other cases
            }
        });
        console.log(sortedTableData);
    }

    function HandleLoadApplication(e) {
        setApplicationName(allOrganisations[e].name);
        setApplicationDescription(allOrganisations[e].description);  
        setApplicationImagePoster(allOrganisations[e].imagePath.poster);
        setApplicationImageBanner(allOrganisations[e].imagePath.banner);
        setApplicationOrganisationId(allOrganisations[e]._id);

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

        if(response.ok) {
            approved ? toast.success("Organisation: " + applicationName + " has been approved!") : toast.success("Organisation: " + applicationName + " has been rejected!");
            setOrganisationSubmitted(true);
        } else {
            toast.error(json.error);
        }

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
                        <StandardDropdown title="Sort By" bottomPadding={0} value={sortBy} options={['newest', 'status']} onChange={(e) => { handleSorted(e); }} />
                    </div>
                </div>

                <Tabs title="Application Status" tabs={['all', 'pending', 'approved']} heroIconsArr={[<NewspaperIcon />, <ClipboardIcon />, <CheckIcon />]}
                    onClick={(e) => handleCategoryFilter(e)} />

                <Divider padding={0} />

                <div className="mt-2 w-full">
                    { !isFiltered ?
                        <Table rows={GenerateReviews()} title="Applications" onClick={(e) => HandleLoadApplication(e.target.parentElement.getAttribute('data-index'))} />
                        :
                        <Table rows={allOrganisationsFiltered} title="Applications" onClick={(e) => HandleLoadApplication(e.target.parentElement.getAttribute('data-index'))} />
                    }
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
                            src={applicationImagePoster}
                            height="256"></img>
                    </div>
                    <div>
                        <span className="grow text-text-primary">Poster</span>
                        <img
                            id="image-poster"
                            src={applicationImageBanner}
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
