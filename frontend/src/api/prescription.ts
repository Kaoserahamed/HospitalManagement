import axios from './axios'

export interface MedicationItem {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export interface PrescriptionCreate {
  appointment_id: string
  patient_id: string
  diagnosis: string
  medications: MedicationItem[]
  instructions?: string
  follow_up_date?: string
}

export interface Prescription {
  id: string
  appointment_id: string
  patient_id: string
  doctor_id: string
  diagnosis: string
  medications: string // JSON string
  instructions?: string
  follow_up_date?: string
  created_at: string // ISO datetime string
}

export const prescriptionAPI = {
  create: async (data: PrescriptionCreate): Promise<Prescription> => {
    const response = await axios.post('/prescriptions', data)
    return response.data
  },

  getMyPrescriptions: async (): Promise<Prescription[]> => {
    const response = await axios.get('/prescriptions/my-prescriptions')
    return response.data
  },

  getPatientMyPrescriptions: async (): Promise<Prescription[]> => {
    const response = await axios.get('/prescriptions/patient/my-prescriptions')
    return response.data
  },

  getPatientPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    const response = await axios.get(`/prescriptions/patient/${patientId}`)
    return response.data
  },

  update: async (id: string, data: Partial<PrescriptionCreate>): Promise<Prescription> => {
    const response = await axios.put(`/prescriptions/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/prescriptions/${id}`)
  },
}
