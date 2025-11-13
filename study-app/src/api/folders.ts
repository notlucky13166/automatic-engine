import { backendConfig, isBackendReady } from './config';
import { supabaseClient } from './supabaseClient';

export interface StudyFolder {
  id: string;
  name: string;
}

export async function ensureStudyFolder(name: string): Promise<StudyFolder> {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error('Please provide a folder name so we can organize your uploads.');
  }

  if (!isBackendReady() || !supabaseClient) {
    const fallbackId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return {
      id: fallbackId,
      name: trimmed
    };
  }

  const client = supabaseClient;
  const { data: existing, error: selectError } = await client
    .from('study_folders')
    .select('id, name')
    .eq('name', trimmed)
    .limit(1);

  if (selectError) {
    throw new Error(selectError.message || 'Unable to check existing study folders.');
  }

  if (existing && existing.length > 0) {
    return existing[0];
  }

  const { data, error } = await client
    .from('study_folders')
    .insert({ name: trimmed })
    .select('id, name')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Unable to create a new study folder right now.');
  }

  return data;
}

export async function recordStudyAsset(folderId: string, file: File) {
  if (!folderId) {
    throw new Error('Missing folder reference for upload.');
  }

  if (!isBackendReady() || !supabaseClient) {
    return {
      path: `${folderId}/${file.name}`
    };
  }

  const client = supabaseClient;
  const { error } = await client.storage
    .from(backendConfig.bucket)
    .upload(`folders/${folderId}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(error.message || `Failed to upload ${file.name}`);
  }

  return {
    path: `folders/${folderId}/${file.name}`
  };
}

export async function uploadFolderAssets(folderId: string, files: File[]) {
  for (const file of files) {
    await recordStudyAsset(folderId, file);
  }
}
