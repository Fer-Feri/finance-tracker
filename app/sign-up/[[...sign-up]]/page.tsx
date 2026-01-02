import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="from-background via-background to-primary/5 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br p-4">
      {/* پس‌زمینه مشابه Landing */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="bg-primary/20 absolute -top-40 -right-40 h-96 w-96 rounded-full blur-[120px]" />
        <div className="bg-secondary/20 absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-[120px]" />
      </div>

      {/* کارت فرم Clerk */}
      <div className="relative z-10">
        <SignUp
          appearance={{
            theme: "simple",
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "blockButton",
            },
            variables: {
              colorPrimary: "var(--secondary)",
              colorBackground: "var(--background)",
              colorText: "var(--accent-foreground)",
              colorInputBackground: "var(--background)",
              colorInputText: "var(--foreground)",
              borderRadius: "1.5rem",
            },
            elements: {
              rootBox: "w-full max-w-md",
              card: "bg-card/40 backdrop-blur-xl border border-border shadow-2xl",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "!border-2 !border-primary !bg-background/50 hover:!border-primary hover:!bg-primary/10 !text-accent-foreground !py-3",
              formButtonPrimary:
                "!bg-primary hover:!bg-primary/90 !shadow-lg !text-white !py-3 !px-6 ",
              formFieldInput:
                "!bg-background/50 !border-2 !border-border focus:!border-primary !text-white !px-4 !py-4",
              footerActionLink: "!text-primary hover:!text-primary/80",
            },
          }}
        />
      </div>
    </div>
  );
}
