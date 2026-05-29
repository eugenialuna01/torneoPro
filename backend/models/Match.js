import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    localTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    visitorTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    localScore: {
      type: Number,
      default: null,
    },

    visitorScore: {
      type: Number,
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pendiente", "jugado"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);