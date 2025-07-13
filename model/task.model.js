import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [30, `Title cann't be more than 30 characters.`],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      require: false,
    },
  },
  { strict: "throw", timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
