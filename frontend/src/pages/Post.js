import React, { useState, useEffect, useCallback } from 'react';

import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner";

import Sample2 from "../assets/sample-mental.png"

import { CakeIcon } from "@heroicons/react/24/solid";

const Post = () => {
    const { user } = useAuthContext();

    return (
        <Layout>
            <div className="flex gap-2">
                <section className="h-96 flex-grow">
                    help
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
        </Layout>
    )
}

export default Post;