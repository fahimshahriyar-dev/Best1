import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    courseId?: string;
    ebookId?: string;
    userId: string;
    payment_info: object;
    enrollmentData?: object;
}

const orderSchema = new Schema<IOrder> ({
    courseId: {
        type: String
    },
    ebookId: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    payment_info: {
        type: Object,
        // required: true
    },
    enrollmentData: {
        type: Object
    }
}, { timestamps: true });

const orderModel: Model<IOrder> = mongoose.model('Order', orderSchema);

export default orderModel;