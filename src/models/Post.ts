import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IPostDocument extends Document {
  image: string;
  caption: string;
  mediaType: "image" | "video";
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    image: {
      type: String,
      required: [true, "Post image/video is required"],
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    caption: {
      type: String,
      default: "",
      maxlength: [2200, "Caption cannot exceed 2200 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPostDocument> =
  mongoose.models.Post ?? mongoose.model<IPostDocument>("Post", PostSchema);

export default Post;
