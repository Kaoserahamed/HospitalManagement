# Integration Guide

## 1. Overview

This document describes integration patterns for HospitalManagement with external systems.

## 2. EHR Interoperability (Phase 2)

### FHIR R4

- Resources: Patient, Observation, DiagnosticReport, MedicationRequest, Encounter, Practitioner.
- RESTful API with search, read, create, update.
- Bulk data export for analytics.

### HL7 v2

- Messages: ADT (admit/discharge/transfer), ORU (results), ORM (orders).
- MLLP transport over TCP.
- Mapping to internal domain models.

## 3. Pharmacy Integration

- Drug interaction database (external or licensed dataset).
- Supplier EDI for reordering.
- Barcode/RFID for dispensing verification.

## 4. Billing and Insurance

- Claim submission via X12 837 (US) or local payer formats.
- Eligibility checks via X12 270/271.
- Remittance advice via X12 835.
- Payment gateway integration for patient payments.

## 5. Identity Providers (Phase 12)

- SAML 2.0 and OIDC for enterprise SSO.
- Just-in-time provisioning.
- Attribute mapping to roles.

## 6. Notifications

- Email (SMTP/SendGrid).
- SMS (Twilio or local gateway).
- In-app notifications.
- Push (web push) for patient portal.

## 7. Imaging (DICOM)

- DICOM metadata stored in DB; binaries in object storage.
- Viewer integration via OHIF or similar (Phase 2+).
- No DICOM binaries in repository.

## 8. Telemedicine (Phase 4)

- WebRTC signaling service.
- STUN/TURN for NAT traversal.
- Recording storage (metadata only in DB).

## 9. Monitoring and Analytics

- Export metrics to external systems.
- FHIR Bulk Data for population health.
- Data warehouse feed (ETL) in Phase 6.

## 10. Security for Integrations

- TLS for all external calls.
- API keys/secrets in secret manager.
- IP allowlisting where supported.
- Rate limiting and retry with backoff.
- Circuit breakers for external dependencies.

## 11. References

- `docs/architecture.md`
- `STRATEGIC_ENGINEERING_ROADMAP.md` Phase 2-4, 6, 12
