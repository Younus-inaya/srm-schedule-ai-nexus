
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'main_admin' | 'dept_admin' | 'staff';
  department_id?: string;
  staff_role?: 'assistant_professor' | 'professor' | 'hod';
  subjects_selected?: string[];
  subjects_locked?: boolean;
}

export const syncUserProfile = async (clerkUser: any): Promise<UserProfile | null> => {
  if (!clerkUser) return null;

  try {
    console.log('Syncing user profile for:', clerkUser.id);

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clerkUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError);
      return null;
    }

    if (existingProfile) {
      // Return existing profile with proper typing
      const profile: UserProfile = {
        id: existingProfile.id,
        email: existingProfile.email || clerkUser.emailAddresses[0]?.emailAddress || '',
        name: existingProfile.name,
        role: existingProfile.role as 'main_admin' | 'dept_admin' | 'staff',
        department_id: existingProfile.department_id || undefined,
        staff_role: existingProfile.staff_role as 'assistant_professor' | 'professor' | 'hod' | undefined,
        subjects_selected: existingProfile.subjects_selected ? JSON.parse(existingProfile.subjects_selected) : [],
        subjects_locked: existingProfile.subjects_locked || false,
      };
      return profile;
    }

    // Create new profile if it doesn't exist
    const newProfileData = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}` 
        : clerkUser.username || 'New User',
      role: 'staff' as const, // Default role
      department_id: null,
      staff_role: null,
      subjects_selected: '[]',
      subjects_locked: false,
      created_at: new Date().toISOString(),
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([newProfileData])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return null;
    }

    if (newProfile) {
      const profile: UserProfile = {
        id: newProfile.id,
        email: newProfile.email || '',
        name: newProfile.name,
        role: newProfile.role as 'main_admin' | 'dept_admin' | 'staff',
        department_id: newProfile.department_id || undefined,
        staff_role: newProfile.staff_role as 'assistant_professor' | 'professor' | 'hod' | undefined,
        subjects_selected: newProfile.subjects_selected ? JSON.parse(newProfile.subjects_selected) : [],
        subjects_locked: newProfile.subjects_locked || false,
      };
      return profile;
    }

    return null;
  } catch (error) {
    console.error('Error syncing user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<boolean> => {
  try {
    const updateData: any = { ...updates };
    
    // Convert subjects_selected array to JSON string for database
    if (updates.subjects_selected) {
      updateData.subjects_selected = JSON.stringify(updates.subjects_selected);
    }

    // Remove id from updates as it shouldn't be updated
    delete updateData.id;

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
