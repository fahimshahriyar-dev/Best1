"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../pages/Footer";
import Policy from "../pages/Policy";

type Props = {};

const page: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Policy - Best1 Academy"
        description="Best1 Academy is a learning management system for helping programmers."
        keywords="programming,mern"
      />
      <Header open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
      <Policy />
      <Footer />
    </div>
  );
};

export default page;
