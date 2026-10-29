"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../pages/Footer";
import TermsAndConditions from "../pages/TermsAndConditions";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Terms & Conditions - Best1 Academy"
        description="Terms and conditions for using Best1 Academy online learning platform."
        keywords="terms, conditions, rules, Best1 Academy"
      />
      <Header
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        route={route}
      />
      <TermsAndConditions />
      <Footer />
    </div>
  );
};

export default Page;
