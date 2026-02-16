import { supabase } from './supabase';
export interface Patient {
  id: number;
  name: string;
  date: string;
  photos: number;
  treatment: string;
  status: string;
  has_before_after: boolean;
}

// Test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('[TEST] Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('app_patients')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('[TEST FAILED]', error);
      return false;
    }
    
    console.log('[TEST SUCCESS] Supabase is connected!');
    return true;
  } catch (err) {
    console.error('[TEST EXCEPTION]', err);
    return false;
  }
}

// Fetch all patients from Supabase
export async function fetchPatients(): Promise<Patient[]> {
  try {
    console.log('[FETCH] Attempting to fetch patients...');
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('[FETCH] No authenticated user, returning empty array');
      return [];
    }
    
    const { data, error } = await supabase
      .from('app_patients')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (error) {
      console.error('[FETCH ERROR] Supabase error:', error);
      console.error('[FETCH ERROR] Error code:', error.code);
      console.error('[FETCH ERROR] Error message:', error.message);
      return [];
    }

    console.log('[FETCH SUCCESS] Fetched patients:', data);
    return data || [];
  } catch (err) {
    console.error('[FETCH EXCEPTION] Exception fetching patients:', err);
    return [];
  }
}

// Save a new patient to Supabase
export async function savePatient(patient: Omit<Patient, 'id'>): Promise<Patient | null> {
  try {
    console.log('[SAVE] Attempting to save patient:', patient);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('[SAVE ERROR] No authenticated user');
      return null;
    }
    
    // Add user_id to the patient data
    const patientWithUser = {
      ...patient,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('app_patients')
      .insert([patientWithUser])
      .select()
      .single();

    if (error) {
      console.error('[SAVE ERROR] Supabase error:', error);
      console.error('[SAVE ERROR] Error code:', error.code);
      console.error('[SAVE ERROR] Error message:', error.message);
      return null;
    }

    console.log('[SAVE SUCCESS] Patient saved:', data);
    return data;
  } catch (err) {
    console.error('[SAVE EXCEPTION] Exception saving patient:', err);
    return null;
  }
}

// Update an existing patient
export async function updatePatient(id: number, updates: Partial<Patient>): Promise<Patient | null> {
  try {
    const { data, error } = await supabase
      .from('app_patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating patient:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception updating patient:', err);
    return null;
  }
}

// Delete a patient
export async function deletePatient(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('app_patients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting patient:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception deleting patient:', err);
    return false;
  }
}