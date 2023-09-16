import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import CardHomeOrg from "../components/CardHomeOrg"

import BannerImage from "../assets/home-banner-org.png"
import Sample1 from "../assets/sample-nuts.jpg"
import Sample2 from "../assets/sample-mental.png"

import { MagnifyingGlassIcon, ChevronDownIcon, CakeIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";


const Organisation = () => {
    const { user } = useAuthContext();

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
                            <div className="flex items-center">
                                <span className="text-white text-sm">Sort by</span>
                                <div className="flex w-60 bg-white/5 border-white/10 rounded relative ml-2">
                                    <select id="sort" className="h-8 z-10 w-full bg-transparent text-white border-none outline-none px-2 font-medium appearance-none cursor-pointer">
                                        <option className="text-white bg-theme-primary" value="option1">Newest</option>
                                        <option className="text-white bg-theme-primary" value="option2">Top</option>
                                    </select>
                                    <button className="h-8 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                                        <ChevronDownIcon className="h-5 w-4 text-white " />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col py-2 gap-2">
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                        <a className="w-full h-full flex rounded outline-none gap-2 p-4 no-underline cursor-pointer bg-white/5">
                            <div className="w-full flex flex-col justify-start gap-1 flex-shrink">
                                <span className="w-full text-white text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    What if we could print a brain?
                                </span>
                                <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                    Discussions
                                </div>

                                <div className="flex mt-auto gap-2 text-white items-center">
                                    <ArrowUpCircleIcon className="h-7" />
                                    6
                                    <ArrowDownCircleOutlineIcon className="h-7" />
                                    •
                                    <div className="flex text-sm text-neutral-400">
                                        Posted by IDK, 4 days ago
                                    </div>
                                </div>
                            </div>
                            <img src={Sample1} className="w-64 basis-28 shrink-0 rounded object-cover object-center" />

                        </a>
                    </div>
                </section>
                <section className="rounded-tr-lg rounded-br-lg h-fit w-96 bg-theme-primary">
                    <div className="flex h-44 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg" style={{ backgroundImage: `url(${Sample2})` }}>
                        <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                            <h2 className="text-white text-3xl font-semibold overflow-hidden">Mental Health Hoax</h2>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-4">
                        <div className="text-white text-sm">
                            Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.
                        </div>
                        <div className="flex text-neutral-500 items-center gap-1">
                            <CakeIcon className="h-4" />
                            <div className=" text-sm">
                                Created: July 22, 1999
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-2">
                        <div className="flex flex-col">
                            <div className="text-white">
                                30
                            </div>
                            <div className="text-neutral-500 text-sm">
                                Posts
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-white">
                                60
                            </div>
                            <div className="text-neutral-500 text-sm">
                                Members
                            </div>
                        </div>
                    </div>
                    <hr className="m-2 border-t-neutral-600" />
                    <div className="px-4 py-2 mb-2">
                        <button className="w-full py-1 rounded-full bg-white font-sans font-bold">
                            Join
                        </button>
                    </div>
                </section>
            </div>

        </Layout >
    )
}

export default Organisation;