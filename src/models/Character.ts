import { Schema, model, models } from "mongoose";

const CharacterSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rarity: { type: Number, enum: [4, 5], required: true },
    element: { type: String, required: true },
    weaponType: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    keyStats: [
      {
        stat: String,
        priority: { type: Number, min: 1, max: 5 },
        note: String,
        _id: false,
      },
    ],
  },
  { timestamps: true },
);
export default models.Character || model("Character", CharacterSchema);
