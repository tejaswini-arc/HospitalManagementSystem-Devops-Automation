import React from 'react';

const SimpleBloodGroupSelect = ({ value, onChange, name = "bloodGroup", required = false, disabled = false, className = "" }) => {
  const options = [
    { value: '', label: 'Select blood group' },
    { value: 'A_POSITIVE', label: 'A+ve (A_POSITIVE)' },
    { value: 'A_NEGATIVE', label: 'A-ve (A_NEGATIVE)' },
    { value: 'B_POSITIVE', label: 'B+ve (B_POSITIVE)' },
    { value: 'B_NEGATIVE', label: 'B-ve (B_NEGATIVE)' },
    { value: 'O_POSITIVE', label: 'O+ve (O_POSITIVE)' },
    { value: 'O_NEGATIVE', label: 'O-ve (O_NEGATIVE)' },
    { value: 'AB_POSITIVE', label: 'AB+ve (AB_POSITIVE)' },
    { value: 'AB_NEGATIVE', label: 'AB-ve (AB_NEGATIVE)' }
  ];

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      name={name}
      value={value || ''}
      onChange={handleChange}
      required={required}
      disabled={disabled}
      className={`form-select ${className}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SimpleBloodGroupSelect;