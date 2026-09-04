import { BLOOD_GROUP_OPTIONS } from './constants';

export const formatBloodGroup = (enumValue) => {
  const option = BLOOD_GROUP_OPTIONS.find(opt => opt.value === enumValue);
  return option ? option.label : enumValue;
};

export const parseBloodGroup = (displayLabel) => {
  const option = BLOOD_GROUP_OPTIONS.find(opt => opt.label === displayLabel);
  return option ? option.value : displayLabel;
};

// For backend API payloads - convert display label to enum value
export const prepareFormDataForBackend = (formData) => {
  if (formData.bloodGroup) {
    return {
      ...formData,
      bloodGroup: parseBloodGroup(formData.bloodGroup)
    };
  }
  return formData;
};

// For UI display - convert enum value to display label
export const formatPatientDataForUI = (patientData) => {
  if (patientData.bloodGroup) {
    return {
      ...patientData,
      bloodGroupDisplay: formatBloodGroup(patientData.bloodGroup)
    };
  }
  return patientData;
};