import {
  Download,
  LucideProps,
  Moon,
  SunMedium,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  download: Download,
  logo: (props: LucideProps) => (
    <svg viewBox="0 0 300 246" {...props}>
      <rect fill="#23292f" height="246" rx="30" width="300" />
      <rect
        fill="#1c2125"
        height="231"
        rx="26.5"
        stroke="#333c46"
        strokeDasharray="5 5"
        width="285"
        x="7.5"
        y="7.5"
      />
      <rect fill="#fc0" height="148" rx="16" width="230" x="35" y="23" />
      <rect fill="#34c759" height="148" rx="16" width="250" x="25" y="43" />
      <rect fill="#007aff" height="148" rx="16" width="270" x="15" y="73" />
      <path
        clipRule="evenodd"
        d="m292 212v-99h-88.591c-9.606 0-18.652 4.944-24.416 13.344l-4.578 6.672c-12.207 17.792-36.623 17.792-48.831 0l-4.577-6.672c-5.764-8.4-14.81-13.344-24.4159-13.344h-88.5911v99c0 14.359 11.6406 26 26 26h232c14.359 0 26-11.641 26-26z"
        fill="#1c2125"
        fillRule="evenodd"
      />
    </svg>
  ),
};
