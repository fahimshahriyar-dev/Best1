import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILearningGoalTag extends Document {
  title: string;
}

const learningGoalTagSchema: Schema<ILearningGoalTag> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter tag title."],
      unique: true,
    },
  },
  { timestamps: true }
);

const learningGoalTagModel: Model<ILearningGoalTag> = mongoose.model(
  "LearningGoalTag",
  learningGoalTagSchema
);

export default learningGoalTagModel;
