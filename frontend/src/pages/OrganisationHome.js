import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import CardHomeOrg from "../components/CardHomeOrg"

import BannerImage from "../assets/home-banner-org.png"
import Sample1 from "../assets/sample-nuts.jpg"

import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/solid";


const Home = () => {
    const { user } = useAuthContext();

    return (
        <Layout>
            <section className="grid">
                <Banner image={BannerImage} title="Organisations" />
                <div className="inline-block">
                    <div className="float-left flex sm:w-72 bg-white/5 border-white/10 rounded m-2 mb-0 relative">
                        <input className="h-8 w-full bg-transparent text-white border-none outline-none p-2 pr-8 font-medium text-sm" type="search" placeholder="Search by Categories" />
                        <button className="h-8 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                            <MagnifyingGlassIcon className="h-5 w-4 text-white " />
                        </button>
                    </div>
                    <div className="float-right inline-block m-2 mb-0 text-sm">
                        <div className="flex items-center">
                            <span className="text-white text-xs">Sort by</span>
                            <div className="flex w-60 bg-white/5 border-white/10 rounded relative ml-2">
                                <select id="sort" className="h-8 z-10 w-full bg-transparent text-white border-none outline-none px-2 font-medium text-sm appearance-none cursor-pointer">
                                    <option className="text-white bg-theme-primary" value="option1">Most Followed</option>
                                    <option className="text-white bg-theme-primary" value="option2">Newest</option>
                                </select>
                                <button className="h-8 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                                    <ChevronDownIcon className="h-5 w-4 text-white " />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid p-2 gap-2 sm:flex flex-wrap">
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                    <CardHomeOrg image={Sample1} name="Nut Allergy Foundation" members="69" type="Health" />
                </div>


            </section>
        </Layout >
    )
}

export default Home;