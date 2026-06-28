import type { Metadata } from "next";
import { SignupForm } from "@/components/forms/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Join PixelFlow 📸</h1>
        <p className="text-base-content/60 mt-1">Create your free photography portfolio</p>
      </div>
      <SignupForm />
    </div>
  );
}
