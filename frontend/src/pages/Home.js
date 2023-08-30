import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../layouts/Layout";

const Home = () => {
    const { user } = useAuthContext();

    return (
        <Layout>
            <section className="grid gap-0.5">
                <span className="text-white">Test</span>
            </section>
        </Layout>
    )
}

export default Home;