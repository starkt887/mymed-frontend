import { useEffect } from "react";
import toast, { Toaster as HotToaster, useToasterStore } from "react-hot-toast";

const TOAST_LIMIT = 3;

const Toaster = () => {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
  }, [toasts]);

  return <HotToaster position="top-right" toastOptions={{ duration: 4000 }} />;
};

export default Toaster;
