export interface HazardInfo {
  name: string;
  checklistRequired: boolean;
  checklistType: string;
  permitRequired: boolean;
  permitType: string;
  training: string;
  example: string;
}

export const HAZARD_CATALOG: HazardInfo[] = [
  {
    name: "+35 lb Manual Lifts",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "Manual Handling",
    example: "Manually lifting a 50 lb pump or motor",
  },
  {
    name: "Hoisting or Crane Use",
    checklistRequired: true, checklistType: "Pre Hoist / Crane Checklist",
    permitRequired: false, permitType: "",
    training: "2 or 4 Point Crane trained",
    example: "Using an overhead crane",
  },
  {
    name: "Mechanical Hazards",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "",
    example: "Sharp edges, moving parts",
  },
  {
    name: "Falling Objects / Safety Netting",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "COHE - PPE",
    example: "Overhead work",
  },
  {
    name: "Working at Height",
    checklistRequired: true, checklistType: "Harness & MSLC Checklist",
    permitRequired: false, permitType: "",
    training: "COHE / ASML WoW",
    example: "Elevated platform work",
  },
  {
    name: "Electrical Work (LOTO)",
    checklistRequired: true, checklistType: "LOTO Checklist",
    permitRequired: false, permitType: "",
    training: "COHE / ASML WoW",
    example: "Electrical panel servicing",
  },
  {
    name: "High or Low Temperature",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "",
    example: "Hot piping, cryogenics",
  },
  {
    name: "Noise",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "",
    example: "Loud equipment",
  },
  {
    name: "Floor Tie Lift / Barricades",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "Floor Tile Lift / CoHE",
    example: "Floor openings",
  },
  {
    name: "Optical Radiation",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "",
    example: "Laser, UV, IR exposure",
  },
  {
    name: "Material Movements",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "Manual Handling",
    example: "Awkward/heavy materials",
  },
  {
    name: "Ionizing / EM Radiation",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "",
    example: "RF or radiation areas",
  },
  {
    name: "Permanent Magnetic Fields",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "Magnetic Training",
    example: "MRI or strong magnets",
  },
  {
    name: "Combustible / Flammable",
    checklistRequired: false, checklistType: "",
    permitRequired: true, permitType: "Permit to Work",
    training: "Vacuum System",
    example: "Hydrogen systems",
  },
  {
    name: "Toxic Materials",
    checklistRequired: false, checklistType: "",
    permitRequired: true, permitType: "Permit to Work",
    training: "Chemical Handling",
    example: "Tin dust, CO2, N2, IPA",
  },
  {
    name: "Confined Space",
    checklistRequired: false, checklistType: "",
    permitRequired: true, permitType: "Permit to Work",
    training: "Confined Space",
    example: "Tanks, pits",
  },
  {
    name: "Lack of Oxygen",
    checklistRequired: false, checklistType: "",
    permitRequired: true, permitType: "Permit to Work",
    training: "Hazardous chemicals",
    example: "CO2 or N2 displacement",
  },
  {
    name: "Fluids (Water, Gas, Vacuum)",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "Hazardous chemicals",
    example: "Pressurized systems",
  },
  {
    name: "Ergonomic Risk",
    checklistRequired: false, checklistType: "",
    permitRequired: false, permitType: "",
    training: "Ergonomic Risk assessment",
    example: "Repetitive/awkward work",
  },
];

/** Lookup hazard info by name */
export function getHazardInfo(name: string): HazardInfo | undefined {
  return HAZARD_CATALOG.find(h => h.name === name);
}
