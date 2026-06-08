import React from "react";
import { TbRadioactiveFilled } from "react-icons/tb";
import {
  GiSwordsEmblem,
  GiMaterialsScience,
  GiAntiAircraftGun,
  GiMachineGunMagazine,
} from "react-icons/gi";
import { MdMasks, MdOutlineNetworkWifi } from "react-icons/md";
import {
  FaHourglassStart,
  FaFire,
  FaWater,
  FaHorseHead,
  FaPrayingHands,
  FaQuestion,
  FaMountain,
} from "react-icons/fa";
import { FaFileCircleXmark } from "react-icons/fa6";
import { TbWorldOff } from "react-icons/tb";
import { SiDragonframe } from "react-icons/si";
import { RiKnifeBloodFill } from "react-icons/ri";

type Props = {
  selected: string[];
  onChange: (perks: string[]) => void;
};

export const PERKS = [
  {
    name: "wifi",
    icon: <MdOutlineNetworkWifi className="w-6 h-6" />,
    label: "WiFi",
  },
  {
    name: "mountains",
    icon: <FaMountain className="w-6 h-6" />,
    label: "Mountains",
  },
  {
    name: "coastal",
    icon: <FaWater className="w-6 h-6" />,
    label: "Coastal / Oceanic",
  },
  {
    name: "mythical",
    icon: <SiDragonframe className="w-6 h-6" />,
    label: "Mythical",
  },
  {
    name: "outoftheworld",
    icon: <TbWorldOff className="w-6 h-6" />,
    label: "Out of the World",
  },
  {
    name: "religious",
    icon: <FaPrayingHands className="w-6 h-6" />,
    label: "Religious",
  },
  {
    name: "historical",
    icon: <FaHorseHead className="w-6 h-6" />,
    label: "Historical",
  },
  {
    name: "warzone",
    icon: <GiAntiAircraftGun className="w-6 h-6" />,
    label: "Active Warzone",
  },
  {
    name: "tactical",
    icon: <GiMachineGunMagazine className="w-6 h-6" />,
    label: "Tactical",
  },
  {
    name: "radioactive",
    icon: <TbRadioactiveFilled className="w-6 h-6" />,
    label: "Radioactive",
  },
  {
    name: "medieval",
    icon: <GiSwordsEmblem className="w-6 h-6" />,
    label: "Medieval",
  },
  {
    name: "quarantined",
    icon: <MdMasks className="w-6 h-6" />,
    label: "Quarantined",
  },
  {
    name: "spacetimedistortion",
    icon: <FaHourglassStart className="w-6 h-6" />,
    label: "Space-Time Distortion",
  },
  { name: "chaos", icon: <FaFire className="w-6 h-6" />, label: "Chaos" },
  {
    name: "scifi",
    icon: <GiMaterialsScience className="w-6 h-6" />,
    label: "Sci-Fi",
  },
  {
    name: "haunted",
    icon: <RiKnifeBloodFill className="w-6 h-6" />,
    label: "Haunted",
  },
  {
    name: "unknown",
    icon: <FaQuestion className="w-6 h-6" />,
    label: "Unknown",
  },
  {
    name: "redacted",
    icon: <FaFileCircleXmark className="w-6 h-6" />,
    label: "[REDACTED]",
  },
];

const Perks = ({ selected, onChange }: Props) => {
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange(selected.filter((p) => p !== name));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
      {PERKS.map(({ name, icon, label }) => (
        <label
          key={name}
          className={`border p-4 flex rounded gap-2 cursor-pointer transition-all select-none ${
            selected.includes(name)
              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
              : "hover:border-gray-400"
          }`}
        >
          <input
            type="checkbox"
            name={name}
            checked={selected.includes(name)}
            onChange={handleChange}
          />
          {icon}
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
};

export default Perks;
