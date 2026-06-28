import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="text-base-content/60 mt-1">Login to your PixelFlow account</p>
      </div>
      <LoginForm />
    </div>
  );
}
