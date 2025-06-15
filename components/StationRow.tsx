import { Check, AlertTriangle, HelpCircle } from "lucide-react";

type Props = {
  name: string;
  status: "ok" | "warning" | "current";
};

export const StationRow = ({ name, status }: Props) => {
  const iconStyle =
    status === "ok"
      ? "bg-green-500 text-white"
      : status === "warning"
      ? "bg-gray-400 text-white"
      : "bg-blue-600 text-white";

  const Icon =
    status === "ok"
      ? Check
      : status === "warning"
      ? AlertTriangle
      : HelpCircle;

  console.log(`${name} - ${status} - ${JSON.stringify(Icon)}`);

  return (
    <div className="flex w-full items-center justify-between rounded-md hover:bg-[#edf0ff] transition px-4 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full shrink-0 ${iconStyle}`}
        >
          <Icon size={16} />
        </div>
        <span className="underline truncate">{name}</span>
      </div>
    </div>
  );
};
