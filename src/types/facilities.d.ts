export type FacilitiesRequestBody = {
  name: string;
  description: string;
  location: string;
  status: StatusFacilities;
};
type StatusFacilities = "TERSEDIA" | "DIGUNAKAN" | "PERBAIKAN";
