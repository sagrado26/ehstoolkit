import { type User, type InsertUser, type SafetyPlan, type InsertSafetyPlan, type UserPreferences, type InsertUserPreferences, type ReportList, type InsertReportList, type AuditLog, type InsertAuditLog, users, safetyPlans, userPreferences, reportList, auditLogs, permits, type Permit, type InsertPermit, craneInspections, type CraneInspection, type InsertCraneInspection, draegerCalibrations, type DraegerCalibration, type InsertDraegerCalibration, incidents, type Incident, type InsertIncident, documents, type Document, type InsertDocument } from "@shared/schema";
import { randomUUID } from "crypto";
import { db as _db } from "./db";
// DatabaseStorage is only instantiated when USE_DATABASE=true, so db is guaranteed non-null
const db = _db!;
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllSafetyPlans(): Promise<SafetyPlan[]>;
  getSafetyPlan(id: number): Promise<SafetyPlan | undefined>;
  createSafetyPlan(plan: InsertSafetyPlan): Promise<SafetyPlan>;
  updateSafetyPlan(id: number, plan: Partial<InsertSafetyPlan>): Promise<SafetyPlan | undefined>;
  deleteSafetyPlan(id: number): Promise<boolean>;
  
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(userId: string, prefs: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  
  getAllReports(): Promise<ReportList[]>;
  getReport(id: number): Promise<ReportList | undefined>;
  getReportBySafetyPlanId(safetyPlanId: number): Promise<ReportList | undefined>;
  createReport(report: InsertReportList): Promise<ReportList>;
  updateReport(id: number, report: Partial<InsertReportList>): Promise<ReportList | undefined>;
  
  getAuditLogs(safetyPlanId?: number): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  // Permits
  getAllPermits(): Promise<Permit[]>;
  getPermit(id: number): Promise<Permit | undefined>;
  createPermit(permit: InsertPermit): Promise<Permit>;
  updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit | undefined>;
  deletePermit(id: number): Promise<boolean>;

  // Crane Inspections
  getAllCraneInspections(): Promise<CraneInspection[]>;
  getCraneInspection(id: number): Promise<CraneInspection | undefined>;
  createCraneInspection(inspection: InsertCraneInspection): Promise<CraneInspection>;
  updateCraneInspection(id: number, inspection: Partial<InsertCraneInspection>): Promise<CraneInspection | undefined>;
  deleteCraneInspection(id: number): Promise<boolean>;

  // Draeger Calibrations
  getAllDraegerCalibrations(): Promise<DraegerCalibration[]>;
  getDraegerCalibration(id: number): Promise<DraegerCalibration | undefined>;
  createDraegerCalibration(calibration: InsertDraegerCalibration): Promise<DraegerCalibration>;
  updateDraegerCalibration(id: number, calibration: Partial<InsertDraegerCalibration>): Promise<DraegerCalibration | undefined>;
  deleteDraegerCalibration(id: number): Promise<boolean>;

  // Incidents
  getAllIncidents(): Promise<Incident[]>;
  getIncident(id: number): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined>;
  deleteIncident(id: number): Promise<boolean>;

  // Documents
  getAllDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private safetyPlans: Map<number, SafetyPlan>;
  private userPreferencesMap: Map<string, UserPreferences>;
  private reports: Map<number, ReportList>;
  private auditLogsMap: Map<number, AuditLog>;
  private permitsMap: Map<number, Permit>;
  private craneInspectionsMap: Map<number, CraneInspection>;
  private draegerCalibrationsMap: Map<number, DraegerCalibration>;
  private incidentsMap: Map<number, Incident>;
  private documentsMap: Map<number, Document>;
  private nextPlanId: number;
  private nextPrefsId: number;
  private nextReportId: number;
  private nextAuditLogId: number;
  private nextPermitId: number;
  private nextCraneInspectionId: number;
  private nextDraegerCalibrationId: number;
  private nextIncidentId: number;
  private nextDocumentId: number;

  constructor() {
    this.users = new Map();
    this.safetyPlans = new Map();
    this.userPreferencesMap = new Map();
    this.reports = new Map();
    this.auditLogsMap = new Map();
    this.permitsMap = new Map();
    this.craneInspectionsMap = new Map();
    this.draegerCalibrationsMap = new Map();
    this.incidentsMap = new Map();
    this.documentsMap = new Map();
    this.nextPlanId = 1;
    this.nextPrefsId = 1;
    this.nextReportId = 1;
    this.nextAuditLogId = 1;
    this.nextPermitId = 1;
    this.nextCraneInspectionId = 1;
    this.nextDraegerCalibrationId = 1;
    this.nextIncidentId = 1;
    this.nextDocumentId = 1;
    this.seedSafetyPlans();
    this.seedPermits();
    this.seedCraneInspections();
    this.seedDraegerCalibrations();
    this.seedIncidents();
    this.seedDocuments();
  }

  private seedSafetyPlans() {
    const samplePlans: Omit<SafetyPlan, 'id' | 'createdAt'>[] = [
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
        shareToken: null
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
        approverName: "",
        engineers: ["Tom Walsh"],
        comments: "Awaiting supervisor approval",
        status: "pending",
        shareToken: null
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
        shareToken: null
      }
    ];

    samplePlans.forEach(plan => {
      const id = this.nextPlanId++;
      this.safetyPlans.set(id, {
        ...plan,
        id,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    });
  }

  private seedPermits() {
    const samples: Omit<Permit, 'id' | 'createdAt'>[] = [
      {
        date: "2025-03-04", submitter: "Declan Foley", manager: "Sarah O'Brien",
        location: "Building 3 - Fab Bay 7", workType: "Hot Work",
        workDescription: "Welding repair on extraction unit bracket",
        spq1: "yes", spq2: "yes", spq3: "yes", spq4: "yes", spq5: "no",
        authorityName: "Sarah O'Brien", status: "approved",
      },
      {
        date: "2025-03-05", submitter: "Mike Chen", manager: "John Murphy",
        location: "Building 2 - Subfab Level B", workType: "Electrical",
        workDescription: "Panel replacement and cable routing for HVAC unit",
        spq1: "yes", spq2: "yes", spq3: "no", spq4: "yes", spq5: "yes",
        authorityName: "", status: "pending",
      },
      {
        date: "2025-03-06", submitter: "Lisa Park", manager: "Michael Kelly",
        location: "Building 1 - Roof Access", workType: "Working at Height",
        workDescription: "Antenna installation on rooftop comms tower",
        spq1: "yes", spq2: "yes", spq3: "yes", spq4: "yes", spq5: "yes",
        authorityName: "Michael Kelly", status: "approved",
      },
      {
        date: "2025-03-07", submitter: "Tom Walsh", manager: "Aoife Ryan",
        location: "Building 4 - Confined Space Tank C",  workType: "Confined Space",
        workDescription: "Inspection and cleaning of chemical storage tank",
        spq1: "no", spq2: "no", spq3: "no", spq4: "no", spq5: "no",
        authorityName: "", status: "draft",
      },
    ];
    samples.forEach(s => {
      const id = this.nextPermitId++;
      this.permitsMap.set(id, { ...s, id, createdAt: new Date(Date.now() - Math.random() * 5 * 86400000) });
    });
  }

  private seedCraneInspections() {
    const samples: Omit<CraneInspection, 'id' | 'createdAt'>[] = [
      { inspector: "Padraig Quinn", buddyInspector: "James Ryan", bay: "Bay 2", machine: "Overhead Crane A", date: "2025-03-01", q1: "yes", q2: "yes", q3: "yes", status: "submitted" },
      { inspector: "Emma Doyle", buddyInspector: "Sean Brady", bay: "Bay 5", machine: "Jib Crane B", date: "2025-03-03", q1: "yes", q2: "no", q3: "yes", status: "submitted" },
      { inspector: "Ciara Lynch", buddyInspector: "Ronan Burke", bay: "Bay 1", machine: "Overhead Crane C", date: "2025-03-05", q1: "yes", q2: "yes", q3: "no", status: "draft" },
      { inspector: "David Byrne", buddyInspector: "Karen Nolan", bay: "Bay 3", machine: "Gantry Crane D", date: "2025-03-06", q1: "yes", q2: "yes", q3: "yes", status: "submitted" },
    ];
    samples.forEach(s => {
      const id = this.nextCraneInspectionId++;
      this.craneInspectionsMap.set(id, { ...s, id, createdAt: new Date(Date.now() - Math.random() * 6 * 86400000) });
    });
  }

  private seedDraegerCalibrations() {
    const samples: Omit<DraegerCalibration, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { nc12: "3HC-DRG-001", serialNumber: "SN-20240187", calibrationDate: "2025-01-15", calibratedBy: "Tom Walsh" },
      { nc12: "3HC-DRG-002", serialNumber: "SN-20240188", calibrationDate: "2025-01-15", calibratedBy: "Tom Walsh" },
      { nc12: "3HC-DRG-003", serialNumber: "SN-20240309", calibrationDate: "2025-02-10", calibratedBy: "Lisa Park" },
      { nc12: "3HC-DRG-004", serialNumber: "SN-20240410", calibrationDate: "2025-02-10", calibratedBy: "Lisa Park" },
      { nc12: "3HC-DRG-005", serialNumber: "SN-20240551", calibrationDate: "2025-03-01", calibratedBy: "Mike Chen" },
    ];
    samples.forEach(s => {
      const id = this.nextDraegerCalibrationId++;
      const now = new Date(Date.now() - Math.random() * 10 * 86400000);
      this.draegerCalibrationsMap.set(id, { ...s, id, createdAt: now, updatedAt: now });
    });
  }

  private seedIncidents() {
    const samples: Omit<Incident, 'id' | 'createdAt'>[] = [
      { date: "2025-02-12", type: "near-miss", location: "Bay 4 - Forklift Zone", description: "Forklift nearly struck a pedestrian at blind corner. No injury but could have been serious.", severity: 3, assignedInvestigator: "Michael Kelly", status: "closed" },
      { date: "2025-02-20", type: "injury", location: "Building 2 - Assembly Line", description: "Technician sustained minor laceration on right hand while removing cable ties without gloves.", severity: 2, assignedInvestigator: "Aoife Ryan", status: "investigating" },
      { date: "2025-03-01", type: "property-damage", location: "Building 1 - Loading Bay", description: "Pallet dropped from height of 1.5m due to forklift mechanical fault, damaged equipment on floor.", severity: 2, assignedInvestigator: "John Murphy", status: "open" },
      { date: "2025-03-04", type: "near-miss", location: "Roof Access - Building 3", description: "Safety harness attachment point found to be corroded and unreliable before use. Reported before use.", severity: 4, assignedInvestigator: "Sarah O'Brien", status: "investigating" },
      { date: "2025-03-06", type: "environmental", location: "Chemical Store - Building 4", description: "Small coolant spill (~2L) detected on floor near storage tank. Contained and cleaned up immediately.", severity: 1, assignedInvestigator: "Declan Foley", status: "closed" },
    ];
    samples.forEach(s => {
      const id = this.nextIncidentId++;
      this.incidentsMap.set(id, { ...s, id, createdAt: new Date(Date.now() - Math.random() * 14 * 86400000) });
    });
  }

  private seedDocuments() {
    const samples: Omit<Document, 'id' | 'createdAt'>[] = [
      { title: "EHS Risk Assessment Template", category: "Templates", description: "Standard template for conducting pre-task risk assessments. Covers hazard identification, severity/likelihood scoring, and mitigation planning.", sharepointUrl: "https://sharepoint.example.com/docs/risk-assessment-template" },
      { title: "Permit to Work Procedure", category: "Procedures", description: "Step-by-step procedure for issuing and managing work permits including hot work, confined space, and electrical permits.", sharepointUrl: "https://sharepoint.example.com/docs/permit-to-work-procedure" },
      { title: "EHS Policy Statement 2025", category: "Policies", description: "Company-wide EHS policy statement signed by the CEO. Outlines our commitment to zero harm and regulatory compliance.", sharepointUrl: "https://sharepoint.example.com/docs/ehs-policy-2025" },
      { title: "Chemical Handling SOP", category: "Procedures", description: "Safe operating procedure for handling, storing and disposing of hazardous chemicals on site.", sharepointUrl: "https://sharepoint.example.com/docs/chemical-handling-sop" },
      { title: "PPE Selection Guide", category: "Guides", description: "Reference guide for selecting appropriate personal protective equipment for common on-site tasks.", sharepointUrl: "https://sharepoint.example.com/docs/ppe-selection-guide" },
      { title: "Emergency Evacuation Plan", category: "Policies", description: "Site emergency evacuation procedures including muster points, fire warden duties and contact numbers.", sharepointUrl: "https://sharepoint.example.com/docs/emergency-evacuation-plan" },
    ];
    samples.forEach(s => {
      const id = this.nextDocumentId++;
      this.documentsMap.set(id, { ...s, id, createdAt: new Date(Date.now() - Math.random() * 30 * 86400000) });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllSafetyPlans(): Promise<SafetyPlan[]> {
    return Array.from(this.safetyPlans.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getSafetyPlan(id: number): Promise<SafetyPlan | undefined> {
    return this.safetyPlans.get(id);
  }

  async createSafetyPlan(plan: InsertSafetyPlan): Promise<SafetyPlan> {
    const id = this.nextPlanId++;
    const hazards = Array.isArray(plan.hazards) ? plan.hazards : [];
    const engineers = Array.isArray(plan.engineers) ? plan.engineers : [];
    const assessments = plan.assessments && typeof plan.assessments === 'object' ? plan.assessments : {};
    
    const newPlan: SafetyPlan = {
      id,
      group: plan.group,
      taskName: plan.taskName,
      date: plan.date,
      location: plan.location,
      shift: plan.shift,
      machineNumber: plan.machineNumber,
      region: plan.region || "Europe - Ireland",
      system: plan.system || "Others",
      canSocialDistance: plan.canSocialDistance,
      q1_specializedTraining: plan.q1_specializedTraining,
      q2_chemicals: plan.q2_chemicals,
      q3_impactOthers: plan.q3_impactOthers,
      q4_falls: plan.q4_falls,
      q5_barricades: plan.q5_barricades,
      q6_loto: plan.q6_loto,
      q7_lifting: plan.q7_lifting,
      q8_ergonomics: plan.q8_ergonomics,
      q9_otherConcerns: plan.q9_otherConcerns,
      q10_headInjury: plan.q10_headInjury,
      q11_otherPPE: plan.q11_otherPPE,
      hazards: hazards as string[],
      assessments: assessments as Record<string, { severity: number; likelihood: number; mitigation: string }>,
      leadName: plan.leadName,
      approverName: plan.approverName || null,
      engineers: engineers as string[],
      comments: plan.comments || null,
      status: plan.status || "pending",
      shareToken: plan.shareToken || null,
      createdAt: new Date()
    };
    this.safetyPlans.set(id, newPlan);
    return newPlan;
  }

  async updateSafetyPlan(id: number, plan: Partial<InsertSafetyPlan>): Promise<SafetyPlan | undefined> {
    const existing = this.safetyPlans.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...plan } as SafetyPlan;
    this.safetyPlans.set(id, updated);
    return updated;
  }

  async deleteSafetyPlan(id: number): Promise<boolean> {
    return this.safetyPlans.delete(id);
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPreferencesMap.get(userId);
  }

  async upsertUserPreferences(userId: string, prefs: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const existing = this.userPreferencesMap.get(userId);
    if (existing) {
      const updated: UserPreferences = {
        ...existing,
        ...prefs,
        updatedAt: new Date()
      };
      this.userPreferencesMap.set(userId, updated);
      return updated;
    } else {
      const newPrefs: UserPreferences = {
        id: this.nextPrefsId++,
        userId,
        system: prefs.system || "Others",
        group: prefs.group || "Europe",
        site: prefs.site || "F34 Intel Ireland",
        isFirstTime: prefs.isFirstTime || "false",
        role: prefs.role || "user",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.userPreferencesMap.set(userId, newPrefs);
      return newPrefs;
    }
  }

  async getAllReports(): Promise<ReportList[]> {
    return Array.from(this.reports.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getReport(id: number): Promise<ReportList | undefined> {
    return this.reports.get(id);
  }

  async getReportBySafetyPlanId(safetyPlanId: number): Promise<ReportList | undefined> {
    return Array.from(this.reports.values()).find(r => r.safetyPlanId === safetyPlanId);
  }

  async createReport(report: InsertReportList): Promise<ReportList> {
    const id = this.nextReportId++;
    const newReport = {
      ...report,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as ReportList;
    this.reports.set(id, newReport);
    return newReport;
  }

  async updateReport(id: number, report: Partial<InsertReportList>): Promise<ReportList | undefined> {
    const existing = this.reports.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...report, updatedAt: new Date() } as ReportList;
    this.reports.set(id, updated);
    return updated;
  }

  async getAuditLogs(safetyPlanId?: number): Promise<AuditLog[]> {
    const all = Array.from(this.auditLogsMap.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    if (safetyPlanId !== undefined) {
      return all.filter(l => l.safetyPlanId === safetyPlanId);
    }
    return all;
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = this.nextAuditLogId++;
    const newLog: AuditLog = {
      id,
      safetyPlanId: log.safetyPlanId,
      action: log.action,
      performedBy: log.performedBy,
      previousStatus: log.previousStatus || null,
      newStatus: log.newStatus || null,
      comments: log.comments || null,
      changes: (log.changes || null) as Record<string, { old: unknown; new: unknown }> | null,
      createdAt: new Date(),
    };
    this.auditLogsMap.set(id, newLog);
    return newLog;
  }

  // ── Permits ────────────────────────────────────────────────────────────────
  async getAllPermits(): Promise<Permit[]> {
    return Array.from(this.permitsMap.values()).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }
  async getPermit(id: number): Promise<Permit | undefined> { return this.permitsMap.get(id); }
  async createPermit(permit: InsertPermit): Promise<Permit> {
    const id = this.nextPermitId++;
    const p: Permit = {
      id, date: permit.date, submitter: permit.submitter, manager: permit.manager,
      location: permit.location ?? "", workType: permit.workType ?? "",
      workDescription: permit.workDescription ?? "",
      spq1: permit.spq1 ?? "no", spq2: permit.spq2 ?? "no", spq3: permit.spq3 ?? "no",
      spq4: permit.spq4 ?? "no", spq5: permit.spq5 ?? "no",
      authorityName: permit.authorityName ?? "",
      status: permit.status ?? "draft", createdAt: new Date(),
    };
    this.permitsMap.set(id, p);
    return p;
  }
  async updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit | undefined> {
    const existing = this.permitsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...permit };
    this.permitsMap.set(id, updated);
    return updated;
  }
  async deletePermit(id: number): Promise<boolean> { return this.permitsMap.delete(id); }

  // ── Crane Inspections ──────────────────────────────────────────────────────
  async getAllCraneInspections(): Promise<CraneInspection[]> {
    return Array.from(this.craneInspectionsMap.values()).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }
  async getCraneInspection(id: number): Promise<CraneInspection | undefined> { return this.craneInspectionsMap.get(id); }
  async createCraneInspection(inspection: InsertCraneInspection): Promise<CraneInspection> {
    const id = this.nextCraneInspectionId++;
    const r: CraneInspection = { ...inspection, id, status: inspection.status ?? "draft", q1: inspection.q1 ?? "no", q2: inspection.q2 ?? "no", q3: inspection.q3 ?? "no", createdAt: new Date() };
    this.craneInspectionsMap.set(id, r);
    return r;
  }
  async updateCraneInspection(id: number, inspection: Partial<InsertCraneInspection>): Promise<CraneInspection | undefined> {
    const existing = this.craneInspectionsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...inspection };
    this.craneInspectionsMap.set(id, updated);
    return updated;
  }
  async deleteCraneInspection(id: number): Promise<boolean> { return this.craneInspectionsMap.delete(id); }

  // ── Draeger Calibrations ───────────────────────────────────────────────────
  async getAllDraegerCalibrations(): Promise<DraegerCalibration[]> {
    return Array.from(this.draegerCalibrationsMap.values()).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }
  async getDraegerCalibration(id: number): Promise<DraegerCalibration | undefined> { return this.draegerCalibrationsMap.get(id); }
  async createDraegerCalibration(calibration: InsertDraegerCalibration): Promise<DraegerCalibration> {
    const id = this.nextDraegerCalibrationId++;
    const r: DraegerCalibration = { ...calibration, id, createdAt: new Date(), updatedAt: new Date() };
    this.draegerCalibrationsMap.set(id, r);
    return r;
  }
  async updateDraegerCalibration(id: number, calibration: Partial<InsertDraegerCalibration>): Promise<DraegerCalibration | undefined> {
    const existing = this.draegerCalibrationsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...calibration, updatedAt: new Date() };
    this.draegerCalibrationsMap.set(id, updated);
    return updated;
  }
  async deleteDraegerCalibration(id: number): Promise<boolean> { return this.draegerCalibrationsMap.delete(id); }

  // ── Incidents ──────────────────────────────────────────────────────────────
  async getAllIncidents(): Promise<Incident[]> {
    return Array.from(this.incidentsMap.values()).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }
  async getIncident(id: number): Promise<Incident | undefined> { return this.incidentsMap.get(id); }
  async createIncident(incident: InsertIncident): Promise<Incident> {
    const id = this.nextIncidentId++;
    const r: Incident = { ...incident, id, status: incident.status ?? "open", severity: incident.severity ?? 1, createdAt: new Date() };
    this.incidentsMap.set(id, r);
    return r;
  }
  async updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined> {
    const existing = this.incidentsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...incident };
    this.incidentsMap.set(id, updated);
    return updated;
  }
  async deleteIncident(id: number): Promise<boolean> { return this.incidentsMap.delete(id); }

  // ── Documents ──────────────────────────────────────────────────────────────
  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documentsMap.values()).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }
  async getDocument(id: number): Promise<Document | undefined> { return this.documentsMap.get(id); }
  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = this.nextDocumentId++;
    const r: Document = { ...doc, id, createdAt: new Date() };
    this.documentsMap.set(id, r);
    return r;
  }
  async updateDocument(id: number, doc: Partial<InsertDocument>): Promise<Document | undefined> {
    const existing = this.documentsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...doc };
    this.documentsMap.set(id, updated);
    return updated;
  }
  async deleteDocument(id: number): Promise<boolean> { return this.documentsMap.delete(id); }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllSafetyPlans(): Promise<SafetyPlan[]> {
    const plans = await db.select().from(safetyPlans).orderBy(desc(safetyPlans.createdAt));
    return plans as SafetyPlan[];
  }

  async getSafetyPlan(id: number): Promise<SafetyPlan | undefined> {
    const [plan] = await db.select().from(safetyPlans).where(eq(safetyPlans.id, id));
    return plan as SafetyPlan | undefined;
  }

  async createSafetyPlan(plan: InsertSafetyPlan): Promise<SafetyPlan> {
    const insertData = {
      group: plan.group,
      taskName: plan.taskName,
      date: plan.date,
      location: plan.location,
      shift: plan.shift,
      machineNumber: plan.machineNumber,
      region: plan.region || "Europe - Ireland",
      system: plan.system || "Others",
      canSocialDistance: plan.canSocialDistance,
      q1_specializedTraining: plan.q1_specializedTraining,
      q2_chemicals: plan.q2_chemicals,
      q3_impactOthers: plan.q3_impactOthers,
      q4_falls: plan.q4_falls,
      q5_barricades: plan.q5_barricades,
      q6_loto: plan.q6_loto,
      q7_lifting: plan.q7_lifting,
      q8_ergonomics: plan.q8_ergonomics,
      q9_otherConcerns: plan.q9_otherConcerns,
      q10_headInjury: plan.q10_headInjury,
      q11_otherPPE: plan.q11_otherPPE,
      hazards: plan.hazards || [],
      assessments: plan.assessments || {},
      leadName: plan.leadName,
      approverName: plan.approverName || null,
      engineers: plan.engineers || [],
      comments: plan.comments || null,
      status: plan.status || "pending",
      shareToken: plan.shareToken || null,
    };
    const [newPlan] = await db.insert(safetyPlans).values(insertData as typeof safetyPlans.$inferInsert).returning();
    return newPlan as SafetyPlan;
  }

  async updateSafetyPlan(id: number, plan: Partial<InsertSafetyPlan>): Promise<SafetyPlan | undefined> {
    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(plan)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    const [updated] = await db.update(safetyPlans).set(updateData).where(eq(safetyPlans.id, id)).returning();
    return updated as SafetyPlan | undefined;
  }

  async deleteSafetyPlan(id: number): Promise<boolean> {
    const result = await db.delete(safetyPlans).where(eq(safetyPlans.id, id)).returning();
    return result.length > 0;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [prefs] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return prefs as UserPreferences | undefined;
  }

  async upsertUserPreferences(userId: string, prefs: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(userId);
    if (existing) {
      const updateData: Record<string, unknown> = { ...prefs, updatedAt: new Date() };
      const [updated] = await db.update(userPreferences).set(updateData).where(eq(userPreferences.userId, userId)).returning();
      return updated as UserPreferences;
    } else {
      const insertData = {
        userId,
        system: prefs.system || "Others",
        group: prefs.group || "Europe",
        site: prefs.site || "F34 Intel Ireland",
        isFirstTime: prefs.isFirstTime || "false",
        role: prefs.role || "user",
      };
      const [newPrefs] = await db.insert(userPreferences).values(insertData).returning();
      return newPrefs as UserPreferences;
    }
  }

  async getAllReports(): Promise<ReportList[]> {
    const reports = await db.select().from(reportList).orderBy(desc(reportList.createdAt));
    return reports as ReportList[];
  }

  async getReport(id: number): Promise<ReportList | undefined> {
    const [report] = await db.select().from(reportList).where(eq(reportList.id, id));
    return report as ReportList | undefined;
  }

  async getReportBySafetyPlanId(safetyPlanId: number): Promise<ReportList | undefined> {
    const [report] = await db.select().from(reportList).where(eq(reportList.safetyPlanId, safetyPlanId));
    return report as ReportList | undefined;
  }

  async createReport(report: InsertReportList): Promise<ReportList> {
    const [newReport] = await db.insert(reportList).values(report as typeof reportList.$inferInsert).returning();
    return newReport as ReportList;
  }

  async updateReport(id: number, report: Partial<InsertReportList>): Promise<ReportList | undefined> {
    const updateData: Record<string, unknown> = { ...report, updatedAt: new Date() };
    const [updated] = await db.update(reportList).set(updateData).where(eq(reportList.id, id)).returning();
    return updated as ReportList | undefined;
  }

  async getAuditLogs(safetyPlanId?: number): Promise<AuditLog[]> {
    if (safetyPlanId !== undefined) {
      return await db.select().from(auditLogs).where(eq(auditLogs.safetyPlanId, safetyPlanId)).orderBy(desc(auditLogs.createdAt)) as AuditLog[];
    }
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)) as AuditLog[];
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log as typeof auditLogs.$inferInsert).returning();
    return newLog as AuditLog;
  }

  // ── Permits ────────────────────────────────────────────────────────────────
  async getAllPermits() {
    return db.select().from(permits).orderBy(desc(permits.createdAt));
  }
  async getPermit(id: number) {
    const [p] = await db.select().from(permits).where(eq(permits.id, id));
    return p;
  }
  async createPermit(permit: InsertPermit) {
    const [p] = await db.insert(permits).values(permit).returning();
    return p;
  }
  async updatePermit(id: number, permit: Partial<InsertPermit>) {
    const [p] = await db.update(permits).set(permit).where(eq(permits.id, id)).returning();
    return p;
  }
  async deletePermit(id: number) {
    const result = await db.delete(permits).where(eq(permits.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ── Crane Inspections ──────────────────────────────────────────────────────
  async getAllCraneInspections() {
    return db.select().from(craneInspections).orderBy(desc(craneInspections.createdAt));
  }
  async getCraneInspection(id: number) {
    const [r] = await db.select().from(craneInspections).where(eq(craneInspections.id, id));
    return r;
  }
  async createCraneInspection(inspection: InsertCraneInspection) {
    const [r] = await db.insert(craneInspections).values(inspection).returning();
    return r;
  }
  async updateCraneInspection(id: number, inspection: Partial<InsertCraneInspection>) {
    const [r] = await db.update(craneInspections).set(inspection).where(eq(craneInspections.id, id)).returning();
    return r;
  }
  async deleteCraneInspection(id: number) {
    const result = await db.delete(craneInspections).where(eq(craneInspections.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ── Draeger Calibrations ───────────────────────────────────────────────────
  async getAllDraegerCalibrations() {
    return db.select().from(draegerCalibrations).orderBy(desc(draegerCalibrations.createdAt));
  }
  async getDraegerCalibration(id: number) {
    const [r] = await db.select().from(draegerCalibrations).where(eq(draegerCalibrations.id, id));
    return r;
  }
  async createDraegerCalibration(calibration: InsertDraegerCalibration) {
    const [r] = await db.insert(draegerCalibrations).values(calibration).returning();
    return r;
  }
  async updateDraegerCalibration(id: number, calibration: Partial<InsertDraegerCalibration>) {
    const [r] = await db.update(draegerCalibrations).set(calibration).where(eq(draegerCalibrations.id, id)).returning();
    return r;
  }
  async deleteDraegerCalibration(id: number) {
    const result = await db.delete(draegerCalibrations).where(eq(draegerCalibrations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ── Incidents ──────────────────────────────────────────────────────────────
  async getAllIncidents() {
    return db.select().from(incidents).orderBy(desc(incidents.createdAt));
  }
  async getIncident(id: number) {
    const [r] = await db.select().from(incidents).where(eq(incidents.id, id));
    return r;
  }
  async createIncident(incident: InsertIncident) {
    const [r] = await db.insert(incidents).values(incident).returning();
    return r;
  }
  async updateIncident(id: number, incident: Partial<InsertIncident>) {
    const [r] = await db.update(incidents).set(incident).where(eq(incidents.id, id)).returning();
    return r;
  }
  async deleteIncident(id: number) {
    const result = await db.delete(incidents).where(eq(incidents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // ── Documents ──────────────────────────────────────────────────────────────
  async getAllDocuments() {
    return db.select().from(documents).orderBy(desc(documents.createdAt));
  }
  async getDocument(id: number) {
    const [r] = await db.select().from(documents).where(eq(documents.id, id));
    return r;
  }
  async createDocument(doc: InsertDocument) {
    const [r] = await db.insert(documents).values(doc).returning();
    return r;
  }
  async updateDocument(id: number, doc: Partial<InsertDocument>) {
    const [r] = await db.update(documents).set(doc).where(eq(documents.id, id)).returning();
    return r;
  }
  async deleteDocument(id: number) {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

const useDatabase = process.env.USE_DATABASE === "true";
export const storage: IStorage = useDatabase ? new DatabaseStorage() : new MemStorage();

console.log(`Storage mode: ${useDatabase ? "PostgreSQL Database" : "In-Memory"}`);
