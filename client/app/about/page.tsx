"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import About from "../pages/About";
import Footer from "../pages/Footer";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="About us - Best1 Academy"
        description="Best1 Academy is a platform for students to learn and get help from teachers"
        keywords="programming, mern"
      />
      <Header
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        route={route}
      />
      <About />
      <Footer/>
    </div>
  );
};

export default Page;
