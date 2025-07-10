import { toast } from "sonner"

export const useToast = () => {
  return {
    toast,
    dismiss: toast.dismiss,
    error: (message) => toast.error(message),
    success: (message) => toast.success(message),
    info: (message) => toast.info(message),
    warning: (message) => toast.warning(message),
  }
} 