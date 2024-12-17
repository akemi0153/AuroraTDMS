import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";



export function useToast() {

  const showToast = (message, options = {}) => {

    toast(message, options);

  };



  return { showToast };

}



export { toast };