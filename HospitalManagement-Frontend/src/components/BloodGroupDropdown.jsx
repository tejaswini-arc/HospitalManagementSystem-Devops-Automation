import React from 'react';
import Select from 'react-select';
import { BLOOD_GROUP_OPTIONS } from '../utils/constants';

const BloodGroupDropdown = ({ value, onChange, label = "Blood Group", required = false, isDisabled = false }) => {
  // Find the matching option based on enum value (like "A_POSITIVE")
  const selectedOption = BLOOD_GROUP_OPTIONS.find(opt => opt.value === value) || null;

  const handleChange = (selectedOption) => {
    // Pass the enum value to parent (like "A_POSITIVE")
    onChange(selectedOption ? selectedOption.value : '');
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: '1px solid #ced4da',
      borderRadius: '0.375rem',
      padding: '2px',
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    })
  };

  return (
    <div className="mb-3">
      <label className="form-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <Select
        options={BLOOD_GROUP_OPTIONS}
        value={selectedOption}
        onChange={handleChange}
        styles={customStyles}
        placeholder="Select blood group"
        isDisabled={isDisabled}
        isClearable
        menuPlacement="auto"
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default BloodGroupDropdown;