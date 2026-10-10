import { Schema, model, models } from "mongoose";

/** Post: "news" (solo admin) o "question" (foro de la comunidad). */
const PostSchema = new Schema(
  {
    kind: { type: String, enum: ["news", "question"], required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, default: "general" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);
export default models.Post || model("Post", PostSchema);
