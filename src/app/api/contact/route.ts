// src/app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ContactRequest = {
  name: string;
  email: string;
  message: string;
  projectType?: 'game' | 'website' | 'app' | 'saas' | 'ai-tool' | 'other';
  budget?: string;
  website?: string;
};

type ResponseBody = {
  success: boolean;
  message: string;
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const projectTypes = [
  'game',
  'website',
  'app',
  'saas',
  'ai-tool',
  'other',
] as const;

const submissionsByIp = new Map<string, number[]>();
let lastCleanupAt = Date.now();

function response(
  body: ResponseBody,
  status: number,
): NextResponse<ResponseBody> {
  return NextResponse.json(body, { status });
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProjectType(
  value: unknown,
): value is ContactRequest['projectType'] {
  return (
    typeof value === 'string' &&
    projectTypes.includes(value as (typeof projectTypes)[number])
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT) {
    submissionsByIp.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);

  if (now - lastCleanupAt >= 10 * 60 * 1000) {
    for (const [storedIp, storedTimestamps] of submissionsByIp.entries()) {
      const activeTimestamps = storedTimestamps.filter(
        (timestamp) => now - timestamp < RATE_WINDOW_MS,
      );

      if (activeTimestamps.length === 0) {
        submissionsByIp.delete(storedIp);
      } else {
        submissionsByIp.set(storedIp, activeTimestamps);
      }
    }

    lastCleanupAt = now;
  }

  return false;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ResponseBody>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return response(
      {
        success: false,
        message: 'Invalid JSON request body.',
      },
      400,
    );
  }

  if (!isRecord(body)) {
    return response(
      {
        success: false,
        message: 'Invalid request body.',
      },
      400,
    );
  }

  const { name, email, message, projectType, budget, website } = body;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string'
  ) {
    return response(
      {
        success: false,
        message: 'Name, email, and message are required.',
      },
      400,
    );
  }

  if (typeof website !== 'undefined' && typeof website !== 'string') {
    return response(
      {
        success: false,
        message: 'Invalid request.',
      },
      400,
    );
  }

  if (typeof budget !== 'undefined' && typeof budget !== 'string') {
    return response(
      {
        success: false,
        message: 'Invalid budget value.',
      },
      400,
    );
  }

  if (typeof projectType !== 'undefined' && !isProjectType(projectType)) {
    return response(
      {
        success: false,
        message: 'Invalid project type.',
      },
      400,
    );
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  const trimmedWebsite = website?.trim() ?? '';

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return response(
      {
        success: false,
        message: 'Name, email, and message are required.',
      },
      400,
    );
  }

  if (trimmedName.length > 200) {
    return response(
      {
        success: false,
        message: 'Name must be 200 characters or fewer.',
      },
      400,
    );
  }

  if (trimmedEmail.length > 254 || !isValidEmail(trimmedEmail)) {
    return response(
      {
        success: false,
        message: 'Please provide a valid email address.',
      },
      400,
    );
  }

  if (trimmedMessage.length > 10_000) {
    return response(
      {
        success: false,
        message: 'Message must be 10,000 characters or fewer.',
      },
      400,
    );
  }

  // Silently accept honeypot submissions without logging them.
  if (trimmedWebsite.length > 0) {
    return response(
      {
        success: true,
        message: 'Thanks for getting in touch. We will be in contact soon.',
      },
      200,
    );
  }

  const clientIp = getClientIp(request);

  if (isRateLimited(clientIp)) {
    return response(
      {
        success: false,
        message: 'Too many submissions. Please try again later.',
      },
      429,
    );
  }

  const submission: ContactRequest = {
    name: trimmedName,
    email: trimmedEmail,
    message: trimmedMessage,
    ...(projectType !== undefined ? { projectType } : {}),
    ...(budget?.trim() ? { budget: budget.trim() } : {}),
  };

  console.info('[Contact form submission]', {
    ...submission,
    submittedAt: new Date().toISOString(),
    ip: clientIp,
  });

  return response(
    {
      success: true,
      message: 'Thanks for getting in touch. We will be in contact soon.',
    },
    200,
  );
}
