import { Schema, model, models } from "mongoose";

const BuildSchema = new Schema(
  {
    character: { type: Schema.Types.ObjectId, ref: "Character", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    echoSets: [{ name: String, pieces: { type: String, enum: ["2", "3", "5"] }, _id: false }],
    mainStats: { cost4: String, cost3: String, cost1: String },
    subStats: [String],
    weapon: { type: String, default: "" },
    official: { type: Boolean, default: false }, // builds base del sitio
  },
  { timestamps: true }
);
export default models.Build || model("Build", BuildSchema);
