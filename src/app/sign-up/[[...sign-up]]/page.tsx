import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/AuthShell";

export const metadata = { title: "Create an account — The Father Intelligence" };

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Request access"
      heading="Create your account"
      sub="Sign up with your email to read the daily Market Universe briefings."
    >
      <SignUp
        appearance={{ elements: { rootBox: "w-full", card: "shadow-none" } }}
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
