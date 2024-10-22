import React from "react";
import { Chip } from "@nextui-org/react";

export default function CategoryChip({ category, isChoosen,onClick }) {
  const { name } = category;

  return (
    <div className="flex gap-4">
      <Chip
      onClick={onClick}
        variant="bordered"
        className={`cursor-pointer ${
          isChoosen
            ? "bg-yellow-300 border-yellow-400 text-gray-800"
            : "bg-gradient-to-r from-blue-400 to-blue-600 text-white border-gray-300"
        } hover:bg-yellow-400 transition-colors duration-300`}
      >
        {name}
      </Chip>
    </div>
  );
}
