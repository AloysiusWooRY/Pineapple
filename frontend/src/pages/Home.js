import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import { GlobeAltIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { Navigate } from "react-router-dom";
import Sample1 from "../assets/sample-nuts.jpg"

const Home = () => {
    const { user } = useAuthContext();

    return (
        <Layout>
            <section className="grid gap-0.5">
                <div className="flex h-24 bg-cover bg-center bg-no-repeat outline-none rounded-tr-lg bg-[url('assets/home-banner.png')] ">
                    <div className="h-full w-full p-4 bg-gradient-to-t from-theme-primary flex items-end">
                        <h2 className="text-white text-3xl">Home</h2>
                    </div>
                </div>
                <div className="grid grid-cols-4 h-24 m-2 gap-2">
                    <button className="relative flex flex-col items-center justify-center gap-1 border-1 border-white/10 outline-none rounded-lg cursor-pointer">
                        <div className="absolute h-full w-full rounded-lg bg-cover bg-center left-0 right-0 z-10 opacity-30 transition-opacity hover:opacity-60 bg-[url('assets/home-cat-all.png')]" />
                        <GlobeAltIcon className="relative z-20 text-white h-12" />
                        <span className="text-white z-20 text-sm">ALL</span>
                    </button>
                    <button className="relative flex flex-col items-center justify-center gap-1 border-1 border-white/10 outline-none rounded-lg cursor-pointer">
                        <div className="absolute h-full w-full rounded-lg bg-cover bg-center left-0 right-0 z-10 opacity-30 transition-opacity hover:opacity-60 bg-[url('assets/home-cat-event.png')]" />
                        <CalendarDaysIcon className="relative z-20 text-white h-12" />
                        <span className="text-white z-20 text-sm">EVENTS</span>
                    </button>
                    <button className="relative flex flex-col items-center justify-center gap-1 border-1 border-white/10 outline-none rounded-lg cursor-pointer">
                        <div className="absolute h-full w-full rounded-lg bg-cover bg-center left-0 right-0 z-10 opacity-30 transition-opacity hover:opacity-60 bg-[url('assets/home-cat-discussion.png')]" />
                        <ChatBubbleLeftRightIcon className="relative z-20 text-white h-12" />
                        <span className="text-white z-20 text-sm">DISCUSSIONS</span>
                    </button>
                    <button className="relative flex flex-col items-center justify-center gap-1 border-1 border-white/10 outline-none rounded-lg cursor-pointer">
                        <div className="absolute h-full w-full rounded-lg bg-cover bg-center left-0 right-0 z-10 opacity-30 transition-opacity hover:opacity-60 bg-[url('assets/home-cat-donation.png')]" />
                        <CurrencyDollarIcon className="relative z-20 text-white h-12" />
                        <span className="text-white z-20 text-sm">DONATIONS</span>
                    </button>
                </div>
                <div className="scroll-px-0 overflow-auto w-full">
                    <div className="inline-flex gap-2 px-2">
                        <button className="bg-white text-black text-xs font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                            RELATED
                        </button>
                        <button className="bg-transparent hover:bg-white/5 text-white text-xs font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                            NEW
                        </button>
                        <button className="bg-transparent hover:bg-white/5 text-white text-xs font-medium border-1 border-white/10 rounded-full outline-none py-1 px-4 text-center">
                            TOP
                        </button>
                    </div>

                </div>
                <div className="grid grid-cols-2 max-lg:grid-cols-1 p-2">
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                    <a className="w-full flex rounded outline-none gap-2 p-2 no-underline cursor-pointer hover:bg-white/5">
                        <img src={Sample1} className="h-24 basis-28 shrink-0 rounded object-cover object-center" />
                        <div className="w-[calc(100vh-8rem)] flex flex-col justify-center gap-1 flex-shrink">
                            <div className="w-full flex gap-1">
                                <span className="w-full text-white text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                                    Save deez nutz
                                </span>

                            </div>
                            <div className="flex items-center text-xs text-neutral-400">
                                Nut Allergy Foundation
                            </div>
                            <div className="flex items-center text-xs gap-1 text-neutral-400">
                                <span className="text-[#ffdc00]">
                                    Discussion
                                </span>· Health
                            </div>
                        </div>
                    </a>
                </div>
            </section>
        </Layout >
    )
}

export default Home;