import { useAuthContext } from "../hooks/useAuthContext";

import Layout from "../layouts/Layout";
import Banner from "../components/Banner";
import Table from "../components/Table";
import { StandardDropdown } from "../components/Buttons";
import { ApprovalType } from "../components/Miscellaneous";

import BannerImage from "../assets/banner-admin-moderation.png";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function AdminApplicationReview() {
    const { user } = useAuthContext();

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

                <div className="inline-block">
                    <div className="float-left flex sm:w-72 bg-white/5 border-white/10 rounded m-2 mb-0 relative">
                        <input className="h-9 w-full bg-transparent text-white border-none outline-none p-2 pr-8 font-medium" type="search" placeholder="Search" />
                        <button className="h-9 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                            <MagnifyingGlassIcon className="h-5 text-white" />
                        </button>
                    </div>

                    <div className="float-right w-1/5 m-2 mb-0">
                        <StandardDropdown title="Sort By" options={['Newest', 'Status']} onChange={(e) => { console.log(e.target.value); }} />
                    </div>
                </div>

                <div className="w-full">
                    <Table rows={GenerateReviews()} title="Applications" onClick={(e) => { console.log(e.target.parentElement.id); }} />
                </div>

            </section>
        </Layout >
    )
}
