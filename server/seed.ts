import "dotenv/config";
import { db } from "./db";
import { safetyPlans, permits, incidents, documents, craneInspections, draegerCalibrations } from "@shared/schema";

async function seed() {
  if (!db) {
    console.error("Database connection not available. Check DATABASE_URL.");
    process.exit(1);
  }

  console.log("Seeding database...");

  // Seed Safety Plans
  const seedPlans = [
    {
      group: "Maintenance Team A",
      taskName: "Electrical Panel Maintenance",
      date: "2024-12-20",
      location: "Building 3 - Fab",
      shift: "day",
      machineNumber: "4052",
      region: "Europe - Ireland",
      system: "EUV",
      canSocialDistance: "yes",
      q1_specializedTraining: "yes",
      q2_chemicals: "no",
      q3_impactOthers: "yes",
      q4_falls: "no",
      q5_barricades: "yes",
      q6_loto: "yes",
      q7_lifting: "no",
      q8_ergonomics: "no",
      q9_otherConcerns: "no",
      q10_headInjury: "no",
      q11_otherPPE: "yes",
      hazards: ["Electrical Work", "Floor/Barricades"],
      assessments: {
        "Electrical Work": { severity: 3, likelihood: 2, mitigation: "Proper LOTO procedures" },
        "Floor/Barricades": { severity: 2, likelihood: 2, mitigation: "Area cordoned off" }
      },
      leadName: "John Murphy",
      approverName: "Sarah O'Brien",
      engineers: ["Mike Chen", "Lisa Park"],
      comments: "Routine maintenance - approved",
      status: "approved",
    },
    {
      group: "Installation Team B",
      taskName: "Equipment Installation",
      date: "2024-12-21",
      location: "Building 2 - Subfab",
      shift: "swing",
      machineNumber: "3021",
      region: "Europe - Ireland",
      system: "DUV",
      canSocialDistance: "yes",
      q1_specializedTraining: "yes",
      q2_chemicals: "no",
      q3_impactOthers: "no",
      q4_falls: "yes",
      q5_barricades: "no",
      q6_loto: "no",
      q7_lifting: "yes",
      q8_ergonomics: "yes",
      q9_otherConcerns: "no",
      q10_headInjury: "yes",
      q11_otherPPE: "no",
      hazards: ["+35lb Manual Lifts", "Working at Height"],
      assessments: {
        "+35lb Manual Lifts": { severity: 3, likelihood: 3, mitigation: "Use mechanical lifting aids" },
        "Working at Height": { severity: 4, likelihood: 2, mitigation: "Fall protection equipment required" }
      },
      leadName: "Sarah O'Brien",
      approverName: null,
      engineers: ["Tom Walsh"],
      comments: "Awaiting supervisor approval",
      status: "pending",
    },
    {
      group: "Safety Team",
      taskName: "Routine Safety Inspection",
      date: "2024-12-22",
      location: "Building 1 - Main",
      shift: "day",
      machineNumber: "N/A",
      region: "Europe - Ireland",
      system: "Others",
      canSocialDistance: "yes",
      q1_specializedTraining: "no",
      q2_chemicals: "no",
      q3_impactOthers: "no",
      q4_falls: "no",
      q5_barricades: "no",
      q6_loto: "no",
      q7_lifting: "no",
      q8_ergonomics: "no",
      q9_otherConcerns: "no",
      q10_headInjury: "no",
      q11_otherPPE: "no",
      hazards: [],
      assessments: {},
      leadName: "Michael Kelly",
      approverName: "John Murphy",
      engineers: [],
      comments: "Standard inspection - low risk",
      status: "approved",
    }
  ];

  for (const plan of seedPlans) {
    await db.insert(safetyPlans).values(plan);
  }
  console.log("Seeded Safety Plans");

  // Seed Permits
  const seedPermits = [
    {
      date: "2025-03-04", submitter: "Declan Foley", manager: "Sarah O'Brien",
      location: "Building 3 - Fab Bay 7", workType: "Hot Work", permitType: "general",
      workDescription: "Welding repair on extraction unit bracket",
      spq1: "yes", spq2: "yes", spq3: "yes", spq4: "yes", spq5: "no",
      authorityName: "Sarah O'Brien", status: "approved",
    },
    {
      date: "2025-03-05", submitter: "Mike Chen", manager: "John Murphy",
      location: "Building 2 - Subfab Level B", workType: "Electrical", permitType: "general",
      workDescription: "Panel replacement and cable routing for HVAC unit",
      spq1: "yes", spq2: "yes", spq3: "no", spq4: "yes", spq5: "yes",
      authorityName: "", status: "pending",
    },
    {
      date: "2025-03-06", submitter: "Lisa Park", manager: "Michael Kelly",
      location: "Building 1 - Roof Access", workType: "Working at Height", permitType: "hazardous-space",
      workDescription: "Antenna installation on rooftop comms tower",
      spq1: "yes", spq2: "yes", spq3: "yes", spq4: "yes", spq5: "yes",
      authorityName: "Michael Kelly", status: "approved",
      hazardAssessment: "Fall hazard assessment completed", respiratoryProtection: "N/A - open air", isolationMethods: "Barricade perimeter",
      srbRequired: "yes", srbPrimaryRoute: "Stairwell A to ground floor exit", srbSecondaryRoute: "Ladder to Building 1 mezzanine", srbAssemblyPoint: "Muster Point C - Car Park", srbEmergencyContact: "Site Emergency: 555-0199",
    },
    {
      date: "2025-03-07", submitter: "Tom Walsh", manager: "Aoife Ryan",
      location: "Building 4 - Confined Space Tank C", workType: "Confined Space", permitType: "confined-space",
      workDescription: "Inspection and cleaning of chemical storage tank",
      spq1: "no", spq2: "no", spq3: "no", spq4: "no", spq5: "no",
      authorityName: "", status: "draft",
      o2Level: "20.9", nitrogenPurge: "yes", entrySupervisor: "Aoife Ryan", standbyPerson: "Padraig Quinn",
      srbRequired: "yes", srbPrimaryRoute: "Tank hatch to Building 4 exit A", srbSecondaryRoute: "Emergency ventilation shaft", srbAssemblyPoint: "Muster Point B - South Gate", srbEmergencyContact: "Rescue Team: 555-0200",
    },
    {
      date: "2025-03-08", submitter: "Emma Doyle", manager: "Sarah O'Brien",
      location: "Building 2 - Chemical Lab", workType: "Mechanical", permitType: "hazardous-chemicals",
      workDescription: "Replacement of corroded acid transfer piping in chemical lab",
      spq1: "yes", spq2: "yes", spq3: "yes", spq4: "yes", spq5: "yes",
      authorityName: "Sarah O'Brien", status: "approved",
      chemicalInventory: "Hydrochloric Acid (HCl), Sulfuric Acid (H2SO4)", sdsDocuments: "SDS-HCl-2024, SDS-H2SO4-2024", ppeRequirements: "Chemical-resistant gloves, face shield, acid apron", containmentPlan: "Drip trays under all joints, spill kit within 5m",
      srbRequired: "yes", srbPrimaryRoute: "Lab exit to Building 2 main corridor", srbSecondaryRoute: "Emergency shower route to east exit", srbAssemblyPoint: "Muster Point A - Main Gate", srbEmergencyContact: "HAZMAT Team: 555-0201",
    },
  ];

  for (const permit of seedPermits) {
    await db.insert(permits).values(permit);
  }
  console.log("Seeded Permits");

  // Seed Incidents
  const seedIncidents = [
    { date: "2025-02-12", type: "near-miss", location: "Bay 4 - Forklift Zone", description: "Forklift nearly struck a pedestrian at blind corner. No injury but could have been serious.", severity: 3, assignedInvestigator: "Michael Kelly", status: "closed" },
    { date: "2025-02-20", type: "injury", location: "Building 2 - Assembly Line", description: "Technician sustained minor laceration on right hand while removing cable ties without gloves.", severity: 2, assignedInvestigator: "Aoife Ryan", status: "investigating" },
    { date: "2025-03-01", type: "property-damage", location: "Building 1 - Loading Bay", description: "Pallet dropped from height of 1.5m due to forklift mechanical fault, damaged equipment on floor.", severity: 2, assignedInvestigator: "John Murphy", status: "open" },
    { date: "2025-03-04", type: "near-miss", location: "Roof Access - Building 3", description: "Safety harness attachment point found to be corroded and unreliable before use. Reported before use.", severity: 4, assignedInvestigator: "Sarah O'Brien", status: "investigating" },
    { date: "2025-03-06", type: "environmental", location: "Chemical Store - Building 4", description: "Small coolant spill (~2L) detected on floor near storage tank. Contained and cleaned up immediately.", severity: 1, assignedInvestigator: "Declan Foley", status: "closed" },
  ];

  for (const incident of seedIncidents) {
    await db.insert(incidents).values(incident);
  }
  console.log("Seeded Incidents");

  // Seed Documents
  const seedDocuments = [
    { title: "EHS Risk Assessment Template", category: "Templates", description: "Standard template for conducting pre-task risk assessments. Covers hazard identification, severity/likelihood scoring, and mitigation planning.", sharepointUrl: "https://sharepoint.example.com/docs/risk-assessment-template" },
    { title: "Permit to Work Procedure", category: "Procedures", description: "Step-by-step procedure for issuing and managing work permits including hot work, confined space, and electrical permits.", sharepointUrl: "https://sharepoint.example.com/docs/permit-to-work-procedure" },
    { title: "EHS Policy Statement 2025", category: "Policies", description: "Company-wide EHS policy statement signed by the CEO. Outlines our commitment to zero harm and regulatory compliance.", sharepointUrl: "https://sharepoint.example.com/docs/ehs-policy-2025" },
    { title: "Chemical Handling SOP", category: "Procedures", description: "Safe operating procedure for handling, storing and disposing of hazardous chemicals on site.", sharepointUrl: "https://sharepoint.example.com/docs/chemical-handling-sop" },
    { title: "PPE Selection Guide", category: "Guides", description: "Reference guide for selecting appropriate personal protective equipment for common on-site tasks.", sharepointUrl: "https://sharepoint.example.com/docs/ppe-selection-guide" },
    { title: "Emergency Evacuation Plan", category: "Policies", description: "Site emergency evacuation procedures including muster points, fire warden duties and contact numbers.", sharepointUrl: "https://sharepoint.example.com/docs/emergency-evacuation-plan" },
  ];

  for (const doc of seedDocuments) {
    await db.insert(documents).values(doc);
  }
  console.log("Seeded Documents");

  // Seed Crane Inspections
  const seedCraneInspections = [
    { inspector: "Padraig Quinn", buddyInspector: "James Ryan", bay: "Bay 2", machine: "Overhead Crane A", date: "2025-03-01", q1: "yes", q2: "yes", q3: "yes", status: "submitted" },
    { inspector: "Emma Doyle", buddyInspector: "Sean Brady", bay: "Bay 5", machine: "Jib Crane B", date: "2025-03-03", q1: "yes", q2: "no", q3: "yes", status: "submitted" },
    { inspector: "Ciara Lynch", buddyInspector: "Ronan Burke", bay: "Bay 1", machine: "Overhead Crane C", date: "2025-03-05", q1: "yes", q2: "yes", q3: "no", status: "draft" },
    { inspector: "David Byrne", buddyInspector: "Karen Nolan", bay: "Bay 3", machine: "Gantry Crane D", date: "2025-03-06", q1: "yes", q2: "yes", q3: "yes", status: "submitted" },
  ];

  for (const inspection of seedCraneInspections) {
    await db.insert(craneInspections).values(inspection);
  }
  console.log("Seeded Crane Inspections");

  // Seed Draeger Calibrations
  const seedDraegerCalibrations = [
    { nc12: "3HC-DRG-001", serialNumber: "SN-20240187", calibrationDate: "2025-01-15", calibratedBy: "Tom Walsh" },
    { nc12: "3HC-DRG-002", serialNumber: "SN-20240188", calibrationDate: "2025-01-15", calibratedBy: "Tom Walsh" },
    { nc12: "3HC-DRG-003", serialNumber: "SN-20240309", calibrationDate: "2025-02-10", calibratedBy: "Lisa Park" },
    { nc12: "3HC-DRG-004", serialNumber: "SN-20240410", calibrationDate: "2025-02-10", calibratedBy: "Lisa Park" },
    { nc12: "3HC-DRG-005", serialNumber: "SN-20240551", calibrationDate: "2025-03-01", calibratedBy: "Mike Chen" },
  ];

  for (const calibration of seedDraegerCalibrations) {
    await db.insert(draegerCalibrations).values(calibration);
  }
  console.log("Seeded Draeger Calibrations");

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
