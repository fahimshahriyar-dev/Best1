import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICourseTag extends Document {
  title: string;
}

const courseTagSchema: Schema<ICourseTag> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter tag title."],
      unique: true,
    },
  },
  { timestamps: true }
);

const courseTagModel: Model<ICourseTag> = mongoose.model(
  "CourseTag",
  courseTagSchema
);

export default courseTagModel;
