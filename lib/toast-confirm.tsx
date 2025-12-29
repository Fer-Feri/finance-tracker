import toast from "react-hot-toast";

interface ToastConfirmProps {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  duration?: number;
}

export function showConfirmToast({
  title,
  message,
  onConfirm,
  confirmText = "تأیید",
  cancelText = "انصراف",
  duration = 6000,
}: ToastConfirmProps) {
  toast(
    (t) => (
      <div className="flex min-w-[320px] flex-col gap-3 p-2">
        {/* 📌 عنوان */}
        <div className="flex items-start gap-2">
          <div className="bg-destructive/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
            <svg
              className="text-destructive h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-foreground text-base font-bold">{title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{message}</p>
          </div>
        </div>

        {/* 🔘 دکمه‌ها */}
        <div className="mt-2 flex gap-2">
          {/* دکمه تأیید */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground flex-1 rounded-lg px-4 py-2.5 font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] hover:brightness-110 active:scale-95"
          >
            {confirmText}
          </button>

          {/* دکمه انصراف */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-muted text-muted-foreground hover:bg-muted/80 flex-1 rounded-lg px-4 py-2.5 font-medium transition-all duration-200 active:scale-95"
          >
            {cancelText}
          </button>
        </div>
      </div>
    ),
    {
      duration,
      position: "top-center",
      style: {
        background: "var(--card)",
        color: "var(--card-foreground)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        padding: "0.75rem",
        maxWidth: "500px",
      },
    },
  );
}
