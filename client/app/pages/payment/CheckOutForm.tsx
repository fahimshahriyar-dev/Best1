import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/orderApi";
import {
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
    setOpen: any;
    data: any;
    user: any;
    enrollmentData: any;
};

const CheckoutForm = ({ setOpen, data, user, enrollmentData }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<any>("");
    const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
    const [loadUser, setLoadUser] = useState(false);
    const {} = useLoadUserQuery({ skip: loadUser ? false : true });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setIsLoading(false);
            if (enrollmentData?.ebookId) {
                createOrder({ 
                    ebookId: data._id, 
                    payment_info: paymentIntent,
                    enrollmentData 
                });
            } else {
                createOrder({ 
                    courseId: data._id, 
                    payment_info: paymentIntent,
                    enrollmentData 
                });
            }
        }
    };

    useEffect(() => {
        if (orderData) {
            setLoadUser(true);
            const itemName = data.course?.name || data.name; // course has data.course.name, ebook has data.name
            socketId.emit("notification", {
                title: "New Order",
                message: `You have a new order from ${itemName}`,
                userId: user._id
            });
            if (enrollmentData?.ebookId) {
                redirect(`/ebook-reader/${data._id}`);
            } else {
                redirect(`/course-access/${data._id}`);
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [orderData, error]);

    return (
        <div className="z-50 text-black">
            <form id="payment-form" onSubmit={handleSubmit}>
                <LinkAuthenticationElement id="link-authentication-element" />
                <PaymentElement id="payment-element" />
                <button
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                    className="w-full"
                >
                    <div id="button-text" className="w-full py-3 text-center font-Poppins font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg hover:shadow-blue-600/30 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? "Processing..." : "Pay now"}
                    </div>
                </button>
                {/* Show any error or success messages */}
                {message && (
                    <div
                        id="payment-message"
                        className="text-[red] font-Poppins pt-2"
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CheckoutForm;
