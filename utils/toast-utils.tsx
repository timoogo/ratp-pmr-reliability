import { JSX } from "react";
import {
  CheckCircle,
  XCircle,
  Wrench,
  Info,
} from "lucide-react";

// Ce type décrit ce qu’on retourne
type ToastOption = {
  icon: JSX.Element;
  className: string;
};

export function getToastOptions(status: string): ToastOption {
  switch (status) {
    case "DISPONIBLE":
      return {
        icon: <CheckCircle className="text-green-600 w-5 h-5" />,
        className: "bg-green-500 text-white",
      };
    case "INDISPONIBLE":
      return {
        icon: <XCircle className="text-red-600 w-5 h-5" />,
        className: "bg-red-500 text-white",
      };
    case "EN_MAINTENANCE":
      return {
        icon: <Wrench className="text-yellow-600 w-5 h-5" />,
        className: "bg-yellow-300 text-black",
      };
    default:
      return {
        icon: <Info className="text-gray-600 w-5 h-5" />,
        className: "bg-muted text-foreground",
      };
  }
}
