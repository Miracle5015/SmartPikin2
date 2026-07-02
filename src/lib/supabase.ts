import { createClient } from "@supabase/supabase-js";

// Try env variables first, then fallback to localStorage
let rawUrl = (
  ((import.meta as any).env.VITE_SUPABASE_URL || "") || 
  (typeof window !== "undefined" ? localStorage.getItem("SUPABASE_CUSTOM_URL") || "" : "")
).trim();

// If the user pasted the REST API URL (which ends with /rest/v1 or /rest/v1/), strip it to get the base Project URL
if (rawUrl.endsWith("/rest/v1")) {
  rawUrl = rawUrl.substring(0, rawUrl.length - 8);
} else if (rawUrl.endsWith("/rest/v1/")) {
  rawUrl = rawUrl.substring(0, rawUrl.length - 9);
}

const supabaseUrl = rawUrl;
const supabaseAnonKey = (
  ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || "") || 
  (typeof window !== "undefined" ? localStorage.getItem("SUPABASE_CUSTOM_ANON_KEY") || "" : "")
).trim();

// Check if the URL is a valid Supabase project URL and not a generic placeholder
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith("https://") && 
  !supabaseUrl.includes("your-supabase") && 
  !supabaseUrl.includes("placeholder")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Robustly upsert a payload to a Supabase table.
 * If the upsert fails due to a missing column in the remote schema, 
 * it automatically parses the column name, deletes it from the payload, and retries.
 */
export async function robustUpsert(tableName: string, payload: any) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase client is not configured") };
  }

  const currentPayload = { ...payload };
  let attempts = 0;
  const maxAttempts = 15;

  while (attempts < maxAttempts) {
    attempts++;
    let result: { data: any; error: any };
    try {
      result = await supabase
        .from(tableName)
        .upsert(currentPayload);
    } catch (err: any) {
      console.error(`[robustUpsert] Network or fetch error in table "${tableName}":`, err);
      return { 
        data: null, 
        error: { 
          message: err.message || "Failed to fetch", 
          name: err.name || "TypeError", 
          code: "FETCH_ERROR" 
        } 
      };
    }

    const { data, error } = result;

    if (!error) {
      return { data, error: null };
    }

    console.warn(`[robustUpsert] Attempt ${attempts} failed for table "${tableName}":`, error);

    const errMsg = error.message || "";
    
    // Check if it is a Column Mismatch error
    // We try to extract the column name that failed to remove it from the payload.
    let missingColumn: string | null = null;

    // Pattern 1: Could not find the 'email' column of 'Parent's Profile' in the schema cache
    const match1 = errMsg.match(/Could not find the ['"]?([^'"\s]+)['"]? column/i);
    if (match1 && match1[1]) {
      missingColumn = match1[1];
    }

    // Pattern 2: column "email" of relation "Parent's Profile" does not exist
    if (!missingColumn) {
      const match2 = errMsg.match(/column ['"]?([^'"\s]+)['"]? of relation/i);
      if (match2 && match2[1]) {
        missingColumn = match2[1];
      }
    }

    // Pattern 3: column "email" does not exist
    if (!missingColumn) {
      const match3 = errMsg.match(/column ['"]?([^'"\s]+)['"]? does not exist/i);
      if (match3 && match3[1]) {
        missingColumn = match3[1];
      }
    }

    if (missingColumn && currentPayload.hasOwnProperty(missingColumn)) {
      console.log(`[robustUpsert] Pruning non-existent column '${missingColumn}' from payload and retrying...`);
      delete currentPayload[missingColumn];
    } else {
      // If we couldn't resolve the column or it is a different kind of error (e.g. RLS or missing table)
      // return it directly so the caller can handle or throw it.
      return { data: null, error };
    }

    // If payload has nothing left or only 'id'/'parent_id', stop to avoid inserting an empty/invalid row
    const keysLeft = Object.keys(currentPayload);
    if (keysLeft.length === 0 || (keysLeft.length === 1 && (keysLeft[0] === 'id' || keysLeft[0] === 'parent_id'))) {
      return { data: null, error };
    }
  }

  return { data: null, error: new Error("Max retry attempts reached during robust upsert") };
}

// Helpers to save, clear, and check credentials from localStorage
export function saveSupabaseCredentials(url: string, key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("SUPABASE_CUSTOM_URL", url.trim());
    localStorage.setItem("SUPABASE_CUSTOM_ANON_KEY", key.trim());
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("SUPABASE_CUSTOM_URL");
    localStorage.removeItem("SUPABASE_CUSTOM_ANON_KEY");
  }
}
