"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import StaticFAQ from "../pages/StaticFAQ";
import Footer from "../pages/Footer";

type Props = {};

const page: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="FAQ - Best1 Academy"
        description="Frequently Asked Questions - Best1 Academy"
        keywords="faq, questions, help, Best1 Academy"
      />
      <div>
        <Header
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          route={route}
        />
        <StaticFAQ />
        <Footer />
      </div>
    </div>
  );
};

export default page;
