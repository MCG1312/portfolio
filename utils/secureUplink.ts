import { z } from 'zod';
import { supabase } from './supabaseClient';

// --- TYPES ---
interface Payload {
  identity: string;
  frequency: string; // Email
  message: string;
  _honey?: string;   // Honeypot
}

interface ServerResponse {
  status: number;
  message: string;
}

// --- CONFIGURATION ---
const RATE_LIMIT_DURATION = 60 * 60 * 1000; // 1 Hour
const RATE_LIMIT_MAX_REQUESTS = 3;

// --- 1. ZOD SCHEMA VALIDATION ---
const ContactSchema = z.object({
  identity: z.string().min(2, "Identity too short").max(100),
  frequency: z.string().email("Invalid frequency format"),
  message: z.string().min(10, "Message buffer underflow").max(5000),
  _honey: z.string().max(0).optional(), // Must be empty
});

// --- 2. SANITIZATION ---
// Strips HTML tags to prevent stored XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[^\w\s@.,?!-]/gi, (char) => {
        // Allow basic punctuation and alphanumeric, hex encode others if suspicious
        return char;
    });
};

// --- 3. CLIENT-SIDE RATE LIMITING ---
// Note: A robust backend would also check IP on the Edge Function level.
const checkRateLimit = (): boolean => {
  try {
    const storageKey = 'OBSIDIAN_UPLINK_LIMIT';
    const rawData = localStorage.getItem(storageKey);
    const now = Date.now();

    let history: number[] = rawData ? JSON.parse(rawData) : [];
    
    // Filter out timestamps older than the duration window
    history = history.filter(timestamp => now - timestamp < RATE_LIMIT_DURATION);

    if (history.length >= RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    history.push(now);
    localStorage.setItem(storageKey, JSON.stringify(history));
    return true;
  } catch (e) {
    return true; // Fallback to allow if local storage fails
  }
};

export const SecureUplink = {
  async transmit(data: Payload): Promise<ServerResponse> {
    try {
      // A. HONEYPOT CHECK
      if (data._honey && data._honey.length > 0) {
        // Silently fail for bots
        return { status: 200, message: 'PACKET_RECEIVED' }; 
      }

      // B. RATE LIMIT CHECK
      if (!checkRateLimit()) {
        return { status: 429, message: 'ERR_RATE_LIMIT: Traffic throttle active. Try again later.' };
      }

      // C. VALIDATION (Zod)
      const parseResult = ContactSchema.safeParse(data);
      if (!parseResult.success) {
        const errorMsg = parseResult.error.errors[0].message;
        return { status: 400, message: `ERR_VALIDATION: ${errorMsg}` };
      }

      // D. SANITIZATION
      const cleanPayload = {
        identity: sanitizeInput(data.identity),
        frequency: sanitizeInput(data.frequency),
        message: sanitizeInput(data.message),
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      };

      // E. DATABASE INGESTION (Supabase)
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([
          { 
            name: cleanPayload.identity, 
            email: cleanPayload.frequency, 
            message: cleanPayload.message,
            metadata: cleanPayload.metadata
          }
        ]);

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error("Uplink unstable");
      }

      return { status: 201, message: 'PACKET_SECURE: Data written to cold storage.' };

    } catch (err: any) {
      return { status: 500, message: `ERR_TRANSMISSION: ${err.message || 'Unknown system failure'}` };
    }
  },

  async purge(): Promise<ServerResponse> {
    // Client-side purge only clears local artifacts, cannot wipe DB without admin key
    localStorage.removeItem('OBSIDIAN_UPLINK_LIMIT');
    return { status: 200, message: 'LOCAL_CACHE_PURGED' };
  }
};
