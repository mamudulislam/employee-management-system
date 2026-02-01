import { toast } from 'react-toastify';

export const showToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      ...options
    });
  },
  
  error: (message: string, options?: any) => {
    return toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      ...options
    });
  },
  
  warning: (message: string, options?: any) => {
    return toast.warning(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      ...options
    });
  },
  
  info: (message: string, options?: any) => {
    return toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      ...options
    });
  },
  
  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      ...options
    });
  },
  
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  }
};

export default showToast;