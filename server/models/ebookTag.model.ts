import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEbookTag extends Document {
  title: string;
}

const ebookTagSchema: Schema<IEbookTag> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter tag title."],
      unique: true,
    },
  },
  { timestamps: true }
);

const ebookTagModel: Model<IEbookTag> = mongoose.model(
  "EbookTag",
  ebookTagSchema
);

export default ebookTagModel;
