'use client'
import React, { FC, useState } from "react";

// utils
import Heading from "./utils/Heading";

// pages
import Hero from "./pages/Hero";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import FAQ from "./pages/FAQ";
import Footer from "./pages/Footer";

// component
import Header from "./components/Header";


interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("SignIn");

  return (
    <div>
      <Heading 
        title="Best1 Academy - Your Online Learning Journey"
        description="Join Best1 Academy to learn from expert instructors, purchase self-paced courses, read our e-book library, and study from the comfort of your home. Start your learning journey today!"
        keywords="Best1 Academy, Online Learning, Live Courses, Online Courses, EBooks, Learn Online, Bangladesh, Education, BecomeATeacher"
      />

      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
      />

      <Hero/>
      <Courses/>
      <Instructors/>
      <FAQ/>
      <Footer/>
    </div>
  )
}

export default Page;
