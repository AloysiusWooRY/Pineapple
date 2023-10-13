import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import SideBarOrganisationInfo from "../components/SidebarOrganisationInfo";

import DiscussionOverview from "../components/DiscussionOverview";
import { StandardDropdown } from "../components/Buttons";

export default function Organisation() {
    const { user } = useAuthContext();

    function OrganisationPosts() {
        let posts = [];

        for (var i = 0; i < 10; i++) {
            posts.push(
                <DiscussionOverview
                    title={"What if we could print a brain?"} discussionType={"Discussion"}
                    votes={69} timeSincePost={"4 days"} posterUsername={"Ho Lee"} upvoted={null} />
            );
        }

        return posts;
    }

    return (
        <Layout>
            <div className="flex gap-2">
                <section className="h-96 flex-grow">
                    <div className="flex justify-between my-2 mb-0">
                        <div className="inline-flex gap-2">
                            <button className="bg-white text-black text-sm font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                                ALL
                            </button>
                            <button className="bg-transparent hover:bg-white/5 text-white text-sm font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                                EVENTS
                            </button>
                            <button className="bg-transparent hover:bg-white/5 text-white text-sm font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                                DISCUSSIONS
                            </button>
                            <button className="bg-transparent hover:bg-white/5 text-white text-sm font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                                DONATIONS
                            </button>
                        </div>

                        <div className="inline-flex text-sm">
                            <StandardDropdown title="Sort By" options={['Newest', 'Top']} onChange={(e) => { console.log(e.target.value); }} />
                        </div>
                    </div>

                    <div className="flex flex-col py-2 gap-2">
                        {<OrganisationPosts />}
                    </div>
                </section>

                <SideBarOrganisationInfo
                    organisationName="Mental Health Hoax"
                    organisationDescription="Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy."
                    createDate="July 22, 1999"
                    numberPosts={30}
                    numberMembers={60}
                />
            </div>
        </Layout>
    );
}
