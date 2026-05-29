import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sport: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pendiente", "activo", "finalizado"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", tournamentSchema);