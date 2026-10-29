import { useGetEbookDetailsQuery } from "@/redux/features/ebook/ebookApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../components/Loader";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import AboutEbook from "./ebook/AboutEbook";
import Footer from "./Footer";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishableKeyQuery,
} from "@/redux/features/orders/orderApi";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  id: string;
};

const EbookDetails = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetEbookDetailsQuery(id);
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
    if (data && data.ebook) {
      const amount = Math.round((data.ebook.discountPrice || data.ebook.price) * 100);
      if (amount > 0) {
        createPaymentIntent(amount);
      }
    }
  }, [config, data]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading || !data?.ebook ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.ebook.name + " - Best1 Academy E-Books"}
            description={data.ebook.description}
            keywords="ebook, best1 academy, programming"
          />

          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
          />

          <AboutEbook
            data={data.ebook}
            stripePromise={stripePromise}
            clientSecret={clientSecret}
            setRoute={setRoute}
            setOpen={setOpen}
          />

          <Footer />
        </div>
      )}
    </>
  );
};

export default EbookDetails;
