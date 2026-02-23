// @/lib/controllers/loginController.ts
import { authAPI } from "@/lib/apiServices";
import { toast } from "sonner";

export const loginController = {
  executeClick: async ({ paramKey,
        eventCode, 
        method,
        formData }: any) => {
    console.log(eventCode);
    if (eventCode === 'ON_LOGIN_SUBMIT') {
      try {
        const res = await authAPI.login(formData,method.path);
        toast.success(res.message);
        
        // Roles check karke redirect
        if (res.roles.includes('ADMIN')) {
          window.location.href = '/admin';
        } else {
          window.location.href = method.successRedirect;
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  }
};