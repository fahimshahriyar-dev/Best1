"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Footer from "../pages/Footer";
import PrivacyPolicy from "../pages/PrivacyPolicy";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Privacy Policy - Best1 Academy"
        description="Privacy policy of Best1 Academy online learning platform."
        keywords="privacy, policy, Best1 Academy"
      />
      <Header
        open={open}
        setOpen={setOpen}
        setRoute={setRoute}
        route={route}
      />
      <PrivacyPolicy />
      <Footer />
    </div>
  );
};

export default Page;
