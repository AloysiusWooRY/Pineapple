// React / Packages
import React, { useState } from "react";

// Components
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import { StandardDropdown } from "../components/Buttons";
import { ApprovalType } from "../components/Miscellaneous";
import { SearchField } from "../components/Inputs";

// Assets
import BannerImage from "../assets/banner-admin-moderation.png";

// API
import { useAuthContext } from "../hooks/useAuthContext";

export default function AdminApplicationReview() {
    const { user } = useAuthContext();

    const [searchField, setSearchField] = useState('');

    function GenerateReviews() {
        const tableData = [
            { date: '10-10-2023', organisationName: 'Organ Isation', approvalStatus: <ApprovalType type="pending" /> },
            { date: '12-10-2023', organisationName: 'WorseHelp', approvalStatus: <ApprovalType type="approved" /> },
            { date: '14-10-2023', organisationName: 'Son of a Beach', approvalStatus: <ApprovalType type="rejected" /> }
        ];

        return tableData;
    }

    return (
        <Layout>
            <section className="flex flex-col">
                <Banner image={BannerImage} title="Application Review" />

                <div className="flex flex-row items-center justify-between">
                    <div className="w-1/5 my-2">
                        <SearchField title="Search" bottomPadding={0} value={searchField} onChange={(e) => { setSearchField(e.target.value); }}/>
                    </div>
                    <div className="w-1/5 my-2">
                        <StandardDropdown title="Sort By" bottomPadding={0} options={['Newest', 'Status']} onChange={(e) => { console.log(e.target.value); }} />
                    </div>
                </div>

                <div className="w-full">
                    <Table rows={GenerateReviews()} title="Applications" onClick={(e) => { console.log(e.target.parentElement.id); }} />
                </div>

            </section>
        </Layout >
    )
}
