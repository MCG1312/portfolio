import { z } from 'zod';

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

// [CONFIGURATION REQUIRED]
// Leave this empty ("") to use the manual Mailto fallback.
// Or add your API URL (e.g. Formspree) to automate it.
const EMAIL_SERVICE_URL: string = ""; 
const FALLBACK_EMAIL = "contact@mehdioumassad.com"; // <--- Destination Email

// --- 1. ZOD SCHEMA VALIDATION ---
const ContactSchema = z.object({
  identity: z.string().min(2, "Identity too short").max(100),
  frequency: z.string().email("Invalid frequency format"),
  message: z.string().min(10, "Message buffer underflow").max(5000),
  _honey: z.string().max(0).optional(), // Must be empty
});

// --- 2. SANITIZATION ---
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[^\w\s@.,?!-]/gi, (char) => {
        return char;
    });
};

// --- 3. CLIENT-SIDE RATE LIMITING ---
const checkRateLimit = (): boolean => {
  try {
    const storageKey = 'OBSIDIAN_UPLINK_LIMIT';
    const rawData = localStorage.getItem(storageKey);
    const now = Date.now();

    let history: number[] = rawData ? JSON.parse(rawData) : [];
    history = history.filter(timestamp => now - timestamp < RATE_LIMIT_DURATION);

    if (history.length >= RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    history.push(now);
    localStorage.setItem(storageKey, JSON.stringify(history));
    return true;
  } catch (e) {
    return true; 
  }
};

export const SecureUplink = {
  async transmit(data: Payload): Promise<ServerResponse> {
    console.log("SecureUplink: V.3.1 - PROTOCOL: HYBRID (API/MAILTO)");

    try {
      // A. HONEYPOT CHECK
      if (data._honey && data._honey.length > 0) {
        return { status: 201, message: 'PACKET_SECURE: Data written to cold storage.' }; 
      }

      // B. RATE LIMIT CHECK
      if (!checkRateLimit()) {
        return { status: 429, message: 'ERR_RATE_LIMIT: Traffic throttle active. Try again later.' };
      }

      // C. VALIDATION
      const parseResult = ContactSchema.safeParse(data);
      if (!parseResult.success) {
        const errorMsg = parseResult.error.issues[0].message;
        return { status: 400, message: `ERR_VALIDATION: ${errorMsg}` };
      }

      // D. SANITIZATION
      const cleanPayload = {
        name: sanitizeInput(data.identity),
        email: sanitizeInput(data.frequency),
        message: sanitizeInput(data.message),
        _subject: `[OBSIDIAN] Uplink from ${sanitizeInput(data.identity)}`,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      };

      // E. TRANSMISSION (Email Service or Fallback)
      
      // Check if user has configured the endpoint
      if (!EMAIL_SERVICE_URL || EMAIL_SERVICE_URL.includes("REPLACE_WITH_YOUR_ID")) {
          console.warn("SecureUplink: No Email API configured. Engaging manual fallback.");
          
          const subject = encodeURIComponent(cleanPayload._subject);
          const body = encodeURIComponent(`IDENTITY: ${cleanPayload.name}\nFREQUENCY: ${cleanPayload.email}\n\nDATA:\n${cleanPayload.message}`);
          
          // Open Mail Client
          window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
          
          return { status: 201, message: 'REDIRECTING: Opening local mail relay...' };
      }

      // Fetch Request to Service
      const response = await fetch(EMAIL_SERVICE_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(cleanPayload)
      });

      if (response.ok) {
        return { status: 201, message: 'PACKET_DELIVERED: Secure channel confirmed.' };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Server rejected payload");
      }

    } catch (err: any) {
      console.error("Uplink Exception:", err);
      return { status: 500, message: `ERR_TRANSMISSION: ${err.message || 'Signal lost'}` };
    }
  },

  async purge(): Promise<ServerResponse> {
    localStorage.removeItem('OBSIDIAN_UPLINK_LIMIT');
    return { status: 200, message: 'LOCAL_CACHE_PURGED' };
  }
};