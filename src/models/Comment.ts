import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    targetType: { type: String, enum: ["build", "post"], required: true },
    target: { type: Schema.Types.ObjectId, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
  },
  { timestamps: true },
);
CommentSchema.index({ targetType: 1, target: 1, createdAt: 1 });
export default models.Comment || model("Comment", CommentSchema);
