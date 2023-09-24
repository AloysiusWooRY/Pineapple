import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";
import Banner from "../components/Banner"
import CardHomeOrg from "../components/CardHomeOrg"

import BannerImage from "../assets/banner-admin-moderation.png"
import Sample1 from "../assets/sample-nuts.jpg"
import Sample2 from "../assets/sample-mental.png"

import { ChevronDownIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { ArrowUpCircleIcon as ArrowUpCircleOutlineIcon, ArrowDownCircleIcon as ArrowDownCircleOutlineIcon } from "@heroicons/react/24/outline";


const AdminModeration = () => {
    const { user } = useAuthContext();

    return (
        <Layout>
            <section className="flex flex-col">
                <Banner image={BannerImage} title="Moderation" />
                <div className="flex flex-grow py-2 gap-2">
                    <table className="w-full h-fit text-left text-white bg-theme-primary">
                        <thead className=" text-white uppercase">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-2 font-semibold bg-[#0f172A]"
                                >
                                    NAME
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-2 font-semibold bg-[#0f172A]"
                                >
                                    EMAIL
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-2 font-semibold bg-[#0f172A]"
                                >
                                    ROLE
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="w-1/6 px-6 py-2 font-medium text-neutral-100">
                                    Bing Chilling
                                </td>
                                <td className="w-1/3 px-6 py-2 font-medium text-neutral-100">
                                    Bing Chilling
                                </td>
                                <td className="w-1/6 px-6 py-2 font-medium text-neutral-100">
                                    <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                        User
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="w-1/6 px-6 py-2 font-medium text-neutral-100">
                                    Maximus Lee
                                </td>
                                <td className="w-1/3 px-6 py-2 font-medium text-neutral-100">
                                    talktoyou@gmail.com
                                </td>
                                <td className="w-1/6 px-6 py-2 font-medium text-neutral-100">
                                    <div className="w-fit h-fit px-2 py-0.5 rounded-full text-white text-sm bg-[#EC8100]">
                                        User
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <section className="flex flex-col gap-2 p-2 rounded-tr-lg rounded-br-lg h-fit w-[32rem] bg-theme-primary overflow-hidden whitespace-nowrap">
                        <div className="flex w-full gap-2 items-center">
                            <h2 className="text-white text-3xl font-semibold flex-grow truncate">
                                Maximus Lee
                            </h2>
                        </div>
                        <hr className="border-t-neutral-600" />
                        <div className="flex flex-col items-start gap-2">
                            <span className="text-white text-sm w-10">Role</span>
                            <div className="flex w-60 bg-white/5 border-white/10 rounded relative">
                                <select id="sort" className="h-8 z-10 w-full bg-transparent text-white border-none outline-none px-2 font-medium appearance-none cursor-pointer">
                                    <option className="text-white bg-theme-primary" value="option1">User</option>
                                    <option className="text-white bg-theme-primary" value="option2">Moderator</option>
                                    <option className="text-white bg-theme-primary" value="option3">Admin</option>
                                </select>
                                <button className="h-8 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                                    <ChevronDownIcon className="h-4 w-4 text-white " />
                                </button>
                            </div>
                        </div>
                        <span className="text-white text-sm w-10">Moderator</span>
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex w-60 bg-white/5 border-white/10 rounded relative">
                                    <select id="sort" className="h-8 z-10 w-full bg-transparent text-white border-none outline-none px-2 font-medium appearance-none cursor-pointer">
                                        <option className="text-white bg-theme-primary" value="option1">Org1</option>
                                        <option className="text-white bg-theme-primary" value="option2">Org2</option>
                                        <option className="text-white bg-theme-primary" value="option3">Org3</option>
                                    </select>
                                    <button className="h-8 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                                        <ChevronDownIcon className="h-4 w-4 text-white " />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex w-60 bg-white/5 border-white/10 rounded relative">
                                    <select id="sort" className="h-8 z-10 w-full bg-transparent text-white border-none outline-none px-2 font-medium appearance-none cursor-pointer">
                                        <option className="text-white bg-theme-primary" value="option1">Org1</option>
                                        <option className="text-white bg-theme-primary" value="option2">Org2</option>
                                        <option className="text-white bg-theme-primary" value="option3">Org3</option>
                                    </select>
                                    <button className="h-8 w-8 flex items-center justify-center bg-transparent border-none outline-none rounded p-0 absolute right-0 top-0" type="button">
                                        <ChevronDownIcon className="h-4 w-4 text-white " />
                                    </button>
                                </div>
                                <PlusIcon className="h-5 w-5 text-white " />
                                <MinusIcon className="h-5 w-5 text-white " />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 m-2">
                            <button type="submit" className="w-full py-1 rounded-full bg-white font-sans font-bold hover:bg-white/80">
                                Save
                            </button>
                            <button type="submit" className="w-full py-1 rounded-full bg-white font-sans font-bold hover:bg-white/80">
                                Delete
                            </button>
                            <button type="submit" className="w-full py-1 rounded-full bg-white font-sans font-bold hover:bg-white/80">
                                Cancel
                            </button>
                        </div>
                    </section>
                </div>


            </section>


        </Layout >
    )
}

export default AdminModeration;