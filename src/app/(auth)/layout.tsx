import { APP_NAME } from "@/constants";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 flex-col items-center justify-center p-12 border-r border-base-300 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />

        <div className="relative z-10 text-center max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-content font-black text-lg">PF</span>
            </div>
            <span className="font-black text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>

          <h2 className="text-3xl font-bold mb-4">Your Photography Journey Starts Here</h2>
          <p className="text-base-content/60 text-lg leading-relaxed">
            Join thousands of photographers sharing their best shots and building their visual stories.
          </p>

          {/* Decorative photo grid */}
          <div className="grid grid-cols-3 gap-2 mt-10 opacity-60">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-gradient-to-br from-base-300 to-base-content/10"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-primary-content font-bold text-sm">PF</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
