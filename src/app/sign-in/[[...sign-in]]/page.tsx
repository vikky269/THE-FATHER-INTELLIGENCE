import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/AuthShell";

export const metadata = { title: "Sign in — The Father Intelligence" };

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Member access"
      heading="Sign in"
      sub="Your briefings, levels and execution notes live behind this door."
    >
      <SignIn
        appearance={{ elements: { rootBox: "w-full", card: "shadow-none" } }}
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
