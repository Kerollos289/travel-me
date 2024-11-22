import { useState } from "react";
import { FaChevronDown } from "react-icons/fa"; // For FontAwesome icons

const CabinClassSelector = ({ cabinClass, setTravelClass }) => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility

  const cabinClasses = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"];

  const handleSelect = (classOption) => {
    setTravelClass(classOption); // Update parent state with selected cabin class
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="px-4 py-2 border rounded flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {cabinClass}
        <FaChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow-lg z-10">
          {cabinClasses.map((classOption) => (
            <button
              key={classOption}
              onClick={() => handleSelect(classOption)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {classOption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CabinClassSelector;
