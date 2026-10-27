import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.errors import register_exception_handlers
from core.logging import configure_logging
from core.middleware import CorrelationIdMiddleware

from routes.appointment import router as appointment_router
from routes.auth import router as auth_router
from routes.department import router as department_router
from routes.doctor_schedule import router as schedule_router
from routes.health import router as health_router
from routes.patient import router as patient_router
from routes.prescription import router as prescription_router

from backend.modules.advance_directive.api import router as advance_directive_router
from backend.modules.allergy_management.api import router as allergy_management_router
from backend.modules.analytics.api import router as analytics_router
from backend.modules.anesthesia.api import router as anesthesia_router
from backend.modules.anesthesiology.api import router as anesthesiology_router
from backend.modules.appointment_reminder.api import router as appointment_reminder_router
from backend.modules.appointment_waitlist.api import router as appointment_waitlist_router
from backend.modules.asset_tracking.api import router as asset_tracking_router
from backend.modules.audit.api import router as audit_router
from backend.modules.backup.api import router as backup_router
from backend.modules.bed_management.api import router as bed_management_router
from backend.modules.billing.api import router as billing_router
from backend.modules.blood_bank.api import router as blood_bank_router
from backend.modules.business_continuity.api import router as business_continuity_router
from backend.modules.cache.api import router as cache_router
from backend.modules.cardiac_rehab.api import router as cardiac_rehab_router
from backend.modules.cardiac_surgery.api import router as cardiac_surgery_router
from backend.modules.cardiology.api import router as cardiology_router
from backend.modules.care.api import router as care_router
from backend.modules.care_plan.api import router as care_plan_router
from backend.modules.cds.api import router as cds_router
from backend.modules.checkin.api import router as checkin_router
from backend.modules.clinical_alerts.api import router as clinical_alerts_router
from backend.modules.clinical_notes.api import router as clinical_notes_router
from backend.modules.coding.api import router as coding_router
from backend.modules.competency_management.api import router as competency_management_router
from backend.modules.consent_management.api import router as consent_management_router
from backend.modules.contract_management.api import router as contract_management_router
from backend.modules.credentialing.api import router as credentialing_router
from backend.modules.dermatology.api import router as dermatology_router
from backend.modules.dicom.api import router as dicom_router
from backend.modules.disaster_recovery.api import router as disaster_recovery_router
from backend.modules.discharge_planning.api import router as discharge_planning_router
from backend.modules.ehr.api import router as ehr_router
from backend.modules.emergency_preparedness.api import router as emergency_preparedness_router
from backend.modules.employee_health.api import router as employee_health_router
from backend.modules.endocrinology.api import router as endocrinology_router
from backend.modules.escalation.api import router as escalation_router
from backend.modules.facility_management.api import router as facility_management_router
from backend.modules.fall_risk.api import router as fall_risk_router
from backend.modules.feature_flags.api import router as feature_flags_router
from backend.modules.fhir.api import router as fhir_router
from backend.modules.fire_safety.api import router as fire_safety_router
from backend.modules.gastroenterology.api import router as gastroenterology_router
from backend.modules.geriatrics.api import router as geriatrics_router
from backend.modules.gynecology.api import router as gynecology_router
from backend.modules.hematology.api import router as hematology_router
from backend.modules.hl7.api import router as hl7_router
from backend.modules.hospice.api import router as hospice_router
from backend.modules.housekeeping.api import router as housekeeping_router
from backend.modules.imaging_archive.api import router as imaging_archive_router
from backend.modules.immunization.api import router as immunization_router
from backend.modules.import_export.api import router as import_export_router
from backend.modules.infection_control.api import router as infection_control_router
from backend.modules.infectious_disease.api import router as infectious_disease_router
from backend.modules.insurance.api import router as insurance_router
from backend.modules.integration.api import router as integration_router
from backend.modules.lab.api import router as lab_router
from backend.modules.lab_qa.api import router as lab_qa_router
from backend.modules.leave_management.api import router as leave_management_router
from backend.modules.maintenance.api import router as maintenance_router
from backend.modules.mdt.api import router as mdt_router
from backend.modules.medical_records.api import router as medical_records_router
from backend.modules.medication_adherence.api import router as medication_adherence_router
from backend.modules.medication_reconciliation.api import router as medication_reconciliation_router
from backend.modules.medication_safety.api import router as medication_safety_router
from backend.modules.monitoring.api import router as monitoring_router
from backend.modules.neonatology.api import router as neonatology_router
from backend.modules.nephrology.api import router as nephrology_router
from backend.modules.neurology.api import router as neurology_router
from backend.modules.neurosurgery.api import router as neurosurgery_router
from backend.modules.notification.api import router as notification_router
from backend.modules.nutrition.api import router as nutrition_router
from backend.modules.obstetric_anesthesia.api import router as obstetric_anesthesia_router
from backend.modules.obstetrics.api import router as obstetrics_router
from backend.modules.occupational_health.api import router as occupational_health_router
from backend.modules.offboarding.api import router as offboarding_router
from backend.modules.onboarding.api import router as onboarding_router
from backend.modules.oncology.api import router as oncology_router
from backend.modules.ophthalmology.api import router as ophthalmology_router
from backend.modules.orthopedics.api import router as orthopedics_router
from backend.modules.pain_management.api import router as pain_management_router
from backend.modules.palliative_care.api import router as palliative_care_router
from backend.modules.pathology.api import router as pathology_router
from backend.modules.patient_education.api import router as patient_education_router
from backend.modules.patient_messaging.api import router as patient_messaging_router
from backend.modules.patient_portal.api import router as patient_portal_router
from backend.modules.patient_satisfaction.api import router as patient_satisfaction_router
from backend.modules.payroll.api import router as payroll_router
from backend.modules.pediatrics.api import router as pediatrics_router
from backend.modules.performance.api import router as performance_router
from backend.modules.performance_review.api import router as performance_review_router
from backend.modules.pharmacy.api import router as pharmacy_router
from backend.modules.plastic_surgery.api import router as plastic_surgery_router
from backend.modules.population.api import router as population_router
from backend.modules.population_health_extra.api import router as population_health_extra_router
from backend.modules.pressure_ulcer.api import router as pressure_ulcer_router
from backend.modules.privileging.api import router as privileging_router
from backend.modules.procurement.api import router as procurement_router
from backend.modules.psychiatry.api import router as psychiatry_router
from backend.modules.pulmonology.api import router as pulmonology_router
from backend.modules.quality.api import router as quality_router
from backend.modules.quality_improvement.api import router as quality_improvement_router
from backend.modules.quality_measure.api import router as quality_measure_router
from backend.modules.queue.api import router as queue_router
from backend.modules.radiology.api import router as radiology_router
from backend.modules.recruitment.api import router as recruitment_router
from backend.modules.referral_management.api import router as referral_management_router
from backend.modules.rehabilitation.api import router as rehabilitation_router
from backend.modules.release_of_info.api import router as release_of_info_router
from backend.modules.remote_monitoring.api import router as remote_monitoring_router
from backend.modules.report_builder.api import router as report_builder_router
from backend.modules.reporting.api import router as reporting_router
from backend.modules.rheumatology.api import router as rheumatology_router
from backend.modules.risk_assessment.api import router as risk_assessment_router
from backend.modules.risk_prediction.api import router as risk_prediction_router
from backend.modules.rules_engine.api import router as rules_engine_router
from backend.modules.scheduling.api import router as scheduling_router
from backend.modules.search.api import router as search_router
from backend.modules.security.api import router as security_router
from backend.modules.security_incident.api import router as security_incident_router
from backend.modules.sepsis_screening.api import router as sepsis_screening_router
from backend.modules.sports_medicine.api import router as sports_medicine_router
from backend.modules.staff.api import router as staff_router
from backend.modules.staff_satisfaction.api import router as staff_satisfaction_router
from backend.modules.sterilization.api import router as sterilization_router
from backend.modules.stroke_protocol.api import router as stroke_protocol_router
from backend.modules.supply_chain.api import router as supply_chain_router
from backend.modules.surgery.api import router as surgery_router
from backend.modules.telehealth.api import router as telehealth_router
from backend.modules.telemedicine.api import router as telemedicine_router
from backend.modules.timekeeping.api import router as timekeeping_router
from backend.modules.training_management.api import router as training_management_router
from backend.modules.transfusion.api import router as transfusion_router
from backend.modules.urology.api import router as urology_router
from backend.modules.vendor_management.api import router as vendor_management_router
from backend.modules.video.api import router as video_router
from backend.modules.visitor_management.api import router as visitor_management_router
from backend.modules.vital_signs.api import router as vital_signs_router
from backend.modules.wearable_integration.api import router as wearable_integration_router
from backend.modules.workflow.api import router as workflow_router

configure_logging(settings.LOG_LEVEL)

app = FastAPI(title="Hospital Management System API")

app.add_middleware(CorrelationIdMiddleware)
register_exception_handlers(app)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(advance_directive_router)
app.include_router(allergy_management_router)
app.include_router(analytics_router)
app.include_router(anesthesia_router)
app.include_router(anesthesiology_router)
app.include_router(appointment_reminder_router)
app.include_router(appointment_waitlist_router)
app.include_router(asset_tracking_router)
app.include_router(audit_router)
app.include_router(backup_router)
app.include_router(bed_management_router)
app.include_router(billing_router)
app.include_router(blood_bank_router)
app.include_router(business_continuity_router)
app.include_router(cache_router)
app.include_router(cardiac_rehab_router)
app.include_router(cardiac_surgery_router)
app.include_router(cardiology_router)
app.include_router(care_router)
app.include_router(care_plan_router)
app.include_router(cds_router)
app.include_router(checkin_router)
app.include_router(clinical_alerts_router)
app.include_router(clinical_notes_router)
app.include_router(coding_router)
app.include_router(competency_management_router)
app.include_router(consent_management_router)
app.include_router(contract_management_router)
app.include_router(credentialing_router)
app.include_router(dermatology_router)
app.include_router(dicom_router)
app.include_router(disaster_recovery_router)
app.include_router(discharge_planning_router)
app.include_router(ehr_router)
app.include_router(emergency_preparedness_router)
app.include_router(employee_health_router)
app.include_router(endocrinology_router)
app.include_router(escalation_router)
app.include_router(facility_management_router)
app.include_router(fall_risk_router)
app.include_router(feature_flags_router)
app.include_router(fhir_router)
app.include_router(fire_safety_router)
app.include_router(gastroenterology_router)
app.include_router(geriatrics_router)
app.include_router(gynecology_router)
app.include_router(hematology_router)
app.include_router(hl7_router)
app.include_router(hospice_router)
app.include_router(housekeeping_router)
app.include_router(imaging_archive_router)
app.include_router(immunization_router)
app.include_router(import_export_router)
app.include_router(infection_control_router)
app.include_router(infectious_disease_router)
app.include_router(insurance_router)
app.include_router(integration_router)
app.include_router(lab_router)
app.include_router(lab_qa_router)
app.include_router(leave_management_router)
app.include_router(maintenance_router)
app.include_router(mdt_router)
app.include_router(medical_records_router)
app.include_router(medication_adherence_router)
app.include_router(medication_reconciliation_router)
app.include_router(medication_safety_router)
app.include_router(monitoring_router)
app.include_router(neonatology_router)
app.include_router(nephrology_router)
app.include_router(neurology_router)
app.include_router(neurosurgery_router)
app.include_router(notification_router)
app.include_router(nutrition_router)
app.include_router(obstetric_anesthesia_router)
app.include_router(obstetrics_router)
app.include_router(occupational_health_router)
app.include_router(offboarding_router)
app.include_router(onboarding_router)
app.include_router(oncology_router)
app.include_router(ophthalmology_router)
app.include_router(orthopedics_router)
app.include_router(pain_management_router)
app.include_router(palliative_care_router)
app.include_router(pathology_router)
app.include_router(patient_education_router)
app.include_router(patient_messaging_router)
app.include_router(patient_portal_router)
app.include_router(patient_satisfaction_router)
app.include_router(payroll_router)
app.include_router(pediatrics_router)
app.include_router(performance_router)
app.include_router(performance_review_router)
app.include_router(pharmacy_router)
app.include_router(plastic_surgery_router)
app.include_router(population_router)
app.include_router(population_health_extra_router)
app.include_router(pressure_ulcer_router)
app.include_router(privileging_router)
app.include_router(procurement_router)
app.include_router(psychiatry_router)
app.include_router(pulmonology_router)
app.include_router(quality_router)
app.include_router(quality_improvement_router)
app.include_router(quality_measure_router)
app.include_router(queue_router)
app.include_router(radiology_router)
app.include_router(recruitment_router)
app.include_router(referral_management_router)
app.include_router(rehabilitation_router)
app.include_router(release_of_info_router)
app.include_router(remote_monitoring_router)
app.include_router(report_builder_router)
app.include_router(reporting_router)
app.include_router(rheumatology_router)
app.include_router(risk_assessment_router)
app.include_router(risk_prediction_router)
app.include_router(rules_engine_router)
app.include_router(scheduling_router)
app.include_router(search_router)
app.include_router(security_router)
app.include_router(security_incident_router)
app.include_router(sepsis_screening_router)
app.include_router(sports_medicine_router)
app.include_router(staff_router)
app.include_router(staff_satisfaction_router)
app.include_router(sterilization_router)
app.include_router(stroke_protocol_router)
app.include_router(supply_chain_router)
app.include_router(surgery_router)
app.include_router(telehealth_router)
app.include_router(telemedicine_router)
app.include_router(timekeeping_router)
app.include_router(training_management_router)
app.include_router(transfusion_router)
app.include_router(urology_router)
app.include_router(vendor_management_router)
app.include_router(video_router)
app.include_router(visitor_management_router)
app.include_router(vital_signs_router)
app.include_router(wearable_integration_router)
app.include_router(workflow_router)
app.include_router(auth_router)
app.include_router(department_router)
app.include_router(appointment_router)
app.include_router(schedule_router)
app.include_router(patient_router)
app.include_router(prescription_router)
app.include_router(health_router)

@app.get("/")
async def root():
    return {"message": "API Running"}

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {}
