import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../components/Loader";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import AboutCourse from "./course/AboutCourse";
import Footer from "./Footer";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "@/redux/features/orders/orderApi";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  id: string;
};

const CourseDetails = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishableKeyQuery({});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (config) {
      const publishableKey = config?.publishablekey;
      setStripePromise(loadStripe(publishableKey));
    }
    if (data) {
      const amount = Math.round((data.course.discountPrice || data.course.price) * 100);
      createPaymentIntent(amount);
    }
  }, [config, data]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data?.course?.name + " - Best1 Academy"}
            description={
              "Best1 Academy is a programming community which is developed by Fahim Shahriyar for helping programmers"
            }
            keywords={data?.course?.tags}
          />

          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
          />

          {stripePromise && (
            <AboutCourse
              data={data?.course}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              setRoute={setRoute}
              setOpen={setOpen}
            />
          )}

          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetails;
