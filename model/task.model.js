import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [30, `Title cann't be more than 30 characters.`],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
  },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      require: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
  },
  { strict: "throw", timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
