import React from 'react';
import { Route } from 'react-router-dom';
import { AdvanceDirectiveListPage } from '../features/advance_directive';
import { AllergyManagementListPage } from '../features/allergy_management';
import { AnesthesiaListPage } from '../features/anesthesia';
import { AnesthesiologyListPage } from '../features/anesthesiology';
import { AppointmentListPage } from '../features/appointment';
import { AppointmentReminderListPage } from '../features/appointment_reminder';
import { AppointmentWaitlistListPage } from '../features/appointment_waitlist';
import { AssetTrackingListPage } from '../features/asset_tracking';
import { AuditLogListPage } from '../features/audit';
import { BackupListPage } from '../features/backup';
import { BedManagementListPage } from '../features/bed_management';
import { InvoiceListPage } from '../features/billing';
import { BloodBankListPage } from '../features/blood_bank';
import { BusinessContinuityListPage } from '../features/business_continuity';
import { CardiacRehabListPage } from '../features/cardiac_rehab';
import { CardiacSurgeryListPage } from '../features/cardiac_surgery';
import { CardiologyListPage } from '../features/cardiology';
import { CareTaskListPage } from '../features/care';
import { CarePlanListPage } from '../features/care_plan';
import { CDSAlertListPage } from '../features/cds';
import { CheckInListPage } from '../features/checkin';
import { ClinicalAlertsListPage } from '../features/clinical_alerts';
import { ClinicalNotesListPage } from '../features/clinical_notes';
import { CompetencyManagementListPage } from '../features/competency_management';
import { ConsentManagementListPage } from '../features/consent_management';
import { ContractManagementListPage } from '../features/contract_management';
import { CredentialingListPage } from '../features/credentialing';
import { DepartmentListPage } from '../features/department';
import { DermatologyListPage } from '../features/dermatology';
import { DicomStudyListPage } from '../features/dicom';
import { DisasterRecoveryListPage } from '../features/disaster_recovery';
import { DischargePlanningListPage } from '../features/discharge_planning';
import { EncounterListPage } from '../features/ehr';
import { EmergencyPreparednessListPage } from '../features/emergency_preparedness';
import { EmployeeHealthListPage } from '../features/employee_health';
import { EndocrinologyListPage } from '../features/endocrinology';
import { EscalationListPage } from '../features/escalation';
import { FacilityManagementListPage } from '../features/facility_management';
import { FallRiskListPage } from '../features/fall_risk';
import { FeatureFlagListPage } from '../features/feature_flags';
import { FireSafetyListPage } from '../features/fire_safety';
import { GastroenterologyListPage } from '../features/gastroenterology';
import { GeriatricsListPage } from '../features/geriatrics';
import { GynecologyListPage } from '../features/gynecology';
import { HematologyListPage } from '../features/hematology';
import { HL7MessageListPage } from '../features/hl7';
import { HospiceListPage } from '../features/hospice';
import { HousekeepingListPage } from '../features/housekeeping';
import { ImagingArchiveListPage } from '../features/imaging_archive';
import { ImmunizationListPage } from '../features/immunization';
import { InfectionControlListPage } from '../features/infection_control';
import { InfectiousDiseaseListPage } from '../features/infectious_disease';
import { ClaimListPage } from '../features/insurance';
import { LabOrderListPage } from '../features/lab';
import { LabQaListPage } from '../features/lab_qa';
import { LeaveManagementListPage } from '../features/leave_management';
import { MaintenanceListPage } from '../features/maintenance';
import { MDTMeetingListPage } from '../features/mdt';
import { MedicalRecordsListPage } from '../features/medical_records';
import { MedicationAdherenceListPage } from '../features/medication_adherence';
import { MedicationReconciliationListPage } from '../features/medication_reconciliation';
import { MedicationSafetyListPage } from '../features/medication_safety';
import { MonitoringAlertListPage } from '../features/monitoring';
import { NeonatologyListPage } from '../features/neonatology';
import { NephrologyListPage } from '../features/nephrology';
import { NeurologyListPage } from '../features/neurology';
import { NeurosurgeryListPage } from '../features/neurosurgery';
import { NotificationListPage } from '../features/notification';
import { NutritionListPage } from '../features/nutrition';
import { ObstetricAnesthesiaListPage } from '../features/obstetric_anesthesia';
import { ObstetricsListPage } from '../features/obstetrics';
import { OccupationalHealthListPage } from '../features/occupational_health';
import { OffboardingListPage } from '../features/offboarding';
import { OnboardingListPage } from '../features/onboarding';
import { OncologyListPage } from '../features/oncology';
import { OphthalmologyListPage } from '../features/ophthalmology';
import { OrthopedicsListPage } from '../features/orthopedics';
import { PainManagementListPage } from '../features/pain_management';
import { PalliativeCareListPage } from '../features/palliative_care';
import { PathologyListPage } from '../features/pathology';
import { PatientListPage } from '../features/patient';
import { PatientEducationListPage } from '../features/patient_education';
import { PatientMessagingListPage } from '../features/patient_messaging';
import { MessageListPage } from '../features/patient_portal';
import { PatientSatisfactionListPage } from '../features/patient_satisfaction';
import { PayrollListPage } from '../features/payroll';
import { PediatricsListPage } from '../features/pediatrics';
import { PerformanceReviewListPage } from '../features/performance_review';
import { MedicationListPage } from '../features/pharmacy';
import { PlasticSurgeryListPage } from '../features/plastic_surgery';
import { RegistryListPage } from '../features/population';
import { PopulationHealthExtraListPage } from '../features/population_health_extra';
import { PressureUlcerListPage } from '../features/pressure_ulcer';
import { PrivilegingListPage } from '../features/privileging';
import { ProcurementListPage } from '../features/procurement';
import { PsychiatryListPage } from '../features/psychiatry';
import { PulmonologyListPage } from '../features/pulmonology';
import { QualityImprovementListPage } from '../features/quality_improvement';
import { QualityMeasureListPage } from '../features/quality_measure';
import { TaskListPage } from '../features/queue';
import { RadiologyListPage } from '../features/radiology';
import { RecruitmentListPage } from '../features/recruitment';
import { ReferralManagementListPage } from '../features/referral_management';
import { RehabilitationListPage } from '../features/rehabilitation';
import { ReleaseOfInfoListPage } from '../features/release_of_info';
import { RemoteMonitoringListPage } from '../features/remote_monitoring';
import { ReportListPage } from '../features/reporting';
import { RheumatologyListPage } from '../features/rheumatology';
import { RiskAssessmentListPage } from '../features/risk_assessment';
import { SecurityIncidentListPage } from '../features/security_incident';
import { SepsisScreeningListPage } from '../features/sepsis_screening';
import { SportsMedicineListPage } from '../features/sports_medicine';
import { StaffListPage } from '../features/staff';
import { StaffSatisfactionListPage } from '../features/staff_satisfaction';
import { SterilizationListPage } from '../features/sterilization';
import { StrokeProtocolListPage } from '../features/stroke_protocol';
import { SupplyChainListPage } from '../features/supply_chain';
import { SurgeryListPage } from '../features/surgery';
import { TelehealthListPage } from '../features/telehealth';
import { VisitListPage } from '../features/telemedicine';
import { TimekeepingListPage } from '../features/timekeeping';
import { TrainingManagementListPage } from '../features/training_management';
import { TransfusionListPage } from '../features/transfusion';
import { UrologyListPage } from '../features/urology';
import { VendorManagementListPage } from '../features/vendor_management';
import { VideoSessionListPage } from '../features/video';
import { VisitorManagementListPage } from '../features/visitor_management';
import { VitalSignsListPage } from '../features/vital_signs';
import { WearableIntegrationListPage } from '../features/wearable_integration';
import { WorkflowInstanceListPage } from '../features/workflow';

export const FeatureRoutes: React.FC = () => (
  <>
    <Route path='/advance_directive' element={<AdvanceDirectiveListPage />} />
    <Route path='/allergy_management' element={<AllergyManagementListPage />} />
    <Route path='/anesthesia' element={<AnesthesiaListPage />} />
    <Route path='/anesthesiology' element={<AnesthesiologyListPage />} />
    <Route path='/appointment' element={<AppointmentListPage />} />
    <Route path='/appointment_reminder' element={<AppointmentReminderListPage />} />
    <Route path='/appointment_waitlist' element={<AppointmentWaitlistListPage />} />
    <Route path='/asset_tracking' element={<AssetTrackingListPage />} />
    <Route path='/audit' element={<AuditLogListPage />} />
    <Route path='/backup' element={<BackupListPage />} />
    <Route path='/bed_management' element={<BedManagementListPage />} />
    <Route path='/billing' element={<InvoiceListPage />} />
    <Route path='/blood_bank' element={<BloodBankListPage />} />
    <Route path='/business_continuity' element={<BusinessContinuityListPage />} />
    <Route path='/cardiac_rehab' element={<CardiacRehabListPage />} />
    <Route path='/cardiac_surgery' element={<CardiacSurgeryListPage />} />
    <Route path='/cardiology' element={<CardiologyListPage />} />
    <Route path='/care' element={<CareTaskListPage />} />
    <Route path='/care_plan' element={<CarePlanListPage />} />
    <Route path='/cds' element={<CDSAlertListPage />} />
    <Route path='/checkin' element={<CheckInListPage />} />
    <Route path='/clinical_alerts' element={<ClinicalAlertsListPage />} />
    <Route path='/clinical_notes' element={<ClinicalNotesListPage />} />
    <Route path='/competency_management' element={<CompetencyManagementListPage />} />
    <Route path='/consent_management' element={<ConsentManagementListPage />} />
    <Route path='/contract_management' element={<ContractManagementListPage />} />
    <Route path='/credentialing' element={<CredentialingListPage />} />
    <Route path='/department' element={<DepartmentListPage />} />
    <Route path='/dermatology' element={<DermatologyListPage />} />
    <Route path='/dicom' element={<DicomStudyListPage />} />
    <Route path='/disaster_recovery' element={<DisasterRecoveryListPage />} />
    <Route path='/discharge_planning' element={<DischargePlanningListPage />} />
    <Route path='/ehr' element={<EncounterListPage />} />
    <Route path='/emergency_preparedness' element={<EmergencyPreparednessListPage />} />
    <Route path='/employee_health' element={<EmployeeHealthListPage />} />
    <Route path='/endocrinology' element={<EndocrinologyListPage />} />
    <Route path='/escalation' element={<EscalationListPage />} />
    <Route path='/facility_management' element={<FacilityManagementListPage />} />
    <Route path='/fall_risk' element={<FallRiskListPage />} />
    <Route path='/feature_flags' element={<FeatureFlagListPage />} />
    <Route path='/fire_safety' element={<FireSafetyListPage />} />
    <Route path='/gastroenterology' element={<GastroenterologyListPage />} />
    <Route path='/geriatrics' element={<GeriatricsListPage />} />
    <Route path='/gynecology' element={<GynecologyListPage />} />
    <Route path='/hematology' element={<HematologyListPage />} />
    <Route path='/hl7' element={<HL7MessageListPage />} />
    <Route path='/hospice' element={<HospiceListPage />} />
    <Route path='/housekeeping' element={<HousekeepingListPage />} />
    <Route path='/imaging_archive' element={<ImagingArchiveListPage />} />
    <Route path='/immunization' element={<ImmunizationListPage />} />
    <Route path='/infection_control' element={<InfectionControlListPage />} />
    <Route path='/infectious_disease' element={<InfectiousDiseaseListPage />} />
    <Route path='/insurance' element={<ClaimListPage />} />
    <Route path='/lab' element={<LabOrderListPage />} />
    <Route path='/lab_qa' element={<LabQaListPage />} />
    <Route path='/leave_management' element={<LeaveManagementListPage />} />
    <Route path='/maintenance' element={<MaintenanceListPage />} />
    <Route path='/mdt' element={<MDTMeetingListPage />} />
    <Route path='/medical_records' element={<MedicalRecordsListPage />} />
    <Route path='/medication_adherence' element={<MedicationAdherenceListPage />} />
    <Route path='/medication_reconciliation' element={<MedicationReconciliationListPage />} />
    <Route path='/medication_safety' element={<MedicationSafetyListPage />} />
    <Route path='/monitoring' element={<MonitoringAlertListPage />} />
    <Route path='/neonatology' element={<NeonatologyListPage />} />
    <Route path='/nephrology' element={<NephrologyListPage />} />
    <Route path='/neurology' element={<NeurologyListPage />} />
    <Route path='/neurosurgery' element={<NeurosurgeryListPage />} />
    <Route path='/notification' element={<NotificationListPage />} />
    <Route path='/nutrition' element={<NutritionListPage />} />
    <Route path='/obstetric_anesthesia' element={<ObstetricAnesthesiaListPage />} />
    <Route path='/obstetrics' element={<ObstetricsListPage />} />
    <Route path='/occupational_health' element={<OccupationalHealthListPage />} />
    <Route path='/offboarding' element={<OffboardingListPage />} />
    <Route path='/onboarding' element={<OnboardingListPage />} />
    <Route path='/oncology' element={<OncologyListPage />} />
    <Route path='/ophthalmology' element={<OphthalmologyListPage />} />
    <Route path='/orthopedics' element={<OrthopedicsListPage />} />
    <Route path='/pain_management' element={<PainManagementListPage />} />
    <Route path='/palliative_care' element={<PalliativeCareListPage />} />
    <Route path='/pathology' element={<PathologyListPage />} />
    <Route path='/patient' element={<PatientListPage />} />
    <Route path='/patient_education' element={<PatientEducationListPage />} />
    <Route path='/patient_messaging' element={<PatientMessagingListPage />} />
    <Route path='/patient_portal' element={<MessageListPage />} />
    <Route path='/patient_satisfaction' element={<PatientSatisfactionListPage />} />
    <Route path='/payroll' element={<PayrollListPage />} />
    <Route path='/pediatrics' element={<PediatricsListPage />} />
    <Route path='/performance_review' element={<PerformanceReviewListPage />} />
    <Route path='/pharmacy' element={<MedicationListPage />} />
    <Route path='/plastic_surgery' element={<PlasticSurgeryListPage />} />
    <Route path='/population' element={<RegistryListPage />} />
    <Route path='/population_health_extra' element={<PopulationHealthExtraListPage />} />
    <Route path='/pressure_ulcer' element={<PressureUlcerListPage />} />
    <Route path='/privileging' element={<PrivilegingListPage />} />
    <Route path='/procurement' element={<ProcurementListPage />} />
    <Route path='/psychiatry' element={<PsychiatryListPage />} />
    <Route path='/pulmonology' element={<PulmonologyListPage />} />
    <Route path='/quality_improvement' element={<QualityImprovementListPage />} />
    <Route path='/quality_measure' element={<QualityMeasureListPage />} />
    <Route path='/queue' element={<TaskListPage />} />
    <Route path='/radiology' element={<RadiologyListPage />} />
    <Route path='/recruitment' element={<RecruitmentListPage />} />
    <Route path='/referral_management' element={<ReferralManagementListPage />} />
    <Route path='/rehabilitation' element={<RehabilitationListPage />} />
    <Route path='/release_of_info' element={<ReleaseOfInfoListPage />} />
    <Route path='/remote_monitoring' element={<RemoteMonitoringListPage />} />
    <Route path='/reporting' element={<ReportListPage />} />
    <Route path='/rheumatology' element={<RheumatologyListPage />} />
    <Route path='/risk_assessment' element={<RiskAssessmentListPage />} />
    <Route path='/security_incident' element={<SecurityIncidentListPage />} />
    <Route path='/sepsis_screening' element={<SepsisScreeningListPage />} />
    <Route path='/sports_medicine' element={<SportsMedicineListPage />} />
    <Route path='/staff' element={<StaffListPage />} />
    <Route path='/staff_satisfaction' element={<StaffSatisfactionListPage />} />
    <Route path='/sterilization' element={<SterilizationListPage />} />
    <Route path='/stroke_protocol' element={<StrokeProtocolListPage />} />
    <Route path='/supply_chain' element={<SupplyChainListPage />} />
    <Route path='/surgery' element={<SurgeryListPage />} />
    <Route path='/telehealth' element={<TelehealthListPage />} />
    <Route path='/telemedicine' element={<VisitListPage />} />
    <Route path='/timekeeping' element={<TimekeepingListPage />} />
    <Route path='/training_management' element={<TrainingManagementListPage />} />
    <Route path='/transfusion' element={<TransfusionListPage />} />
    <Route path='/urology' element={<UrologyListPage />} />
    <Route path='/vendor_management' element={<VendorManagementListPage />} />
    <Route path='/video' element={<VideoSessionListPage />} />
    <Route path='/visitor_management' element={<VisitorManagementListPage />} />
    <Route path='/vital_signs' element={<VitalSignsListPage />} />
    <Route path='/wearable_integration' element={<WearableIntegrationListPage />} />
    <Route path='/workflow' element={<WorkflowInstanceListPage />} />
  </>
);