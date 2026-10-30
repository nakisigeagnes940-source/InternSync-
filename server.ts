import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Increase body limit to handle uploaded workplace photos and attachments
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lazy initialization for Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Initialize Firebase Firestore for strict 3-generation daily limit tracking
let db: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const fbConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const appInstance = !getApps().length ? initializeApp(fbConfig) : getApp();
    db = getFirestore(appInstance, fbConfig.firestoreDatabaseId || '(default)');
    console.log('[Firebase Firestore] Initialized successfully for daily limit enforcement.');
  }
} catch (err) {
  console.warn('[Firebase Firestore] Initialization warning:', err);
}

// System prompt explicitly formatted for standard physical internship logbook sheets
// Matching the official 4-column physical logbook page:
// Header: Day and Date | Section / Department of training
// Table: S/N | Tasks Done | Skills acquired | Challenges faced
// Footer: Name of trainee | Signature | Supervisor's remarks | Name, signature, Date
function getSystemLogbookPrompt(): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `
You are the Official Student Physical InternSync AI Assistant.
Your purpose is to generate authentic, high-quality, professional daily entries for students undertaking vocational, college, and university internships in Hospitality, Tourism, Culinary Arts, and Beverage Management.

STRICT DOMAIN RESTRICTION & GUARDRAIL:
- You are ONLY an InternSync Assistant.
- If the student's notes, prompt, or request is unrelated to student internship training tasks, vocational training, work duties, hospitality, culinary, front office, housekeeping, or practical training activities (e.g. asking general coding questions, math problems, trivia, general chat, weather, recipes outside workplace context, etc.), you MUST NOT fulfill the request.
- Instead, you MUST output this exact message and nothing else:
"That is not my objective or what I am meant to do. I am strictly dedicated to generating and assisting with student internship entries."

CURRENT LIVE DATE: ${currentDate}. CRITICAL: You MUST use today's actual current live date (${currentDate}) for the day and date of the entry unless the student explicitly requests a different date. Do not use outdated placeholder dates like September 2026.

STUDENT ROTATION CONTEXT:
Students frequently undergo rotational training across hotel & resort departments:
- FRONT OFFICE: Reception & Check-in, Opera PMS operations, Room Allocation, Keycard Encoding, Concierge, Reservations, Bell Desk, Cashiering / Night Audit.
- RESTAURANT & F&B SERVICE (Rotational): Table setup, order taking, silver service, banqueting, beverage service, guest greeting, POS billing.
- HOUSEKEEPING (Rotational): Guest room cleaning, bed making & mitered corners, linen turnover, bathroom sanitization, minibar restocking, turndown service, public areas.
- LAUNDRY & LINEN (Rotational): Sorting soiled linen, commercial washing cycles, drying, flatwork ironing/pressing, folding, guest dry cleaning delivery.
- FOOD PRODUCTION / KITCHEN: Mise en place, knife skills, HACCP temperature logging, batch cooking, sauce preparation, butchery, grill/saute line.
- BARISTA & BEVERAGE: Espresso grinder dial-in (dose, yield, time), milk steaming & microfoam texturing, latte art, coffee brewing, espresso machine backflushing.
- TOUR GUIDING: Pre-tour briefing, guided commentary, heritage interpretation, pacing, headcounts, group safety.

YOUR INSTRUCTIONS:
1. Identify the exact Day and Date (CRITICAL: Use ${currentDate} or whichever day/date provided by the student).
2. Explicitly specify the Section / Department of training (including specific rotational sections such as "Front Office (Reception & Check-in)", "Laundry & Linen Services (Rotational)", "Housekeeping & Accommodation (Rotational)", "Restaurant & F&B Service (Rotational)").
3. Populate the exact 4-column table:
   - S/N (1, 2, 3, 4, 5)
   - Tasks Done (detailed, step-by-step practical and technical procedures performed)
   - Skills acquired (specific industrial skills, PMS software, equipment operation, guest handling)
   - Challenges faced (realistic workplace obstacles encountered and how they were overcome)
4. Formulate authentic Supervisor's Remarks (constructive, formal evaluation from the workplace trainer/manager).

OUTPUT FORMAT:
You MUST respond with a JSON block enclosed in \`\`\`json ... \`\`\` with the following structure:
{
  "dayAndDate": "${currentDate}",
  "department": "Primary Department name",
  "section": "Exact Section / Rotational Department of training",
  "traineeName": "Student Trainee Name",
  "table": [
    {
      "sn": 1,
      "taskDone": "Thorough practical description of task 1...",
      "skillsAcquired": "Practical and technical skill acquired...",
      "challengesFaced": "Realistic challenge encountered and professional resolution applied..."
    },
    {
      "sn": 2,
      "taskDone": "...",
      "skillsAcquired": "...",
      "challengesFaced": "..."
    },
    {
      "sn": 3,
      "taskDone": "...",
      "skillsAcquired": "...",
      "challengesFaced": "..."
    },
    {
      "sn": 4,
      "taskDone": "...",
      "skillsAcquired": "...",
      "challengesFaced": "..."
    }
  ],
  "supervisorRemarks": "Evaluative feedback on the student's performance, punctuality, and skill execution.",
  "supervisorName": "Supervisor Full Name & Department Title"
}
Followed immediately by a clean Markdown transcription of the Physical Logbook Sheet.
`;
}

// OpenRouter candidate models
const OPENROUTER_CANDIDATE_MODELS = [
  process.env.OPENROUTER_MODEL,
  'google/gemini-2.5-flash',
  'openai/gpt-4o-mini',
  'deepseek/deepseek-chat',
  'meta-llama/llama-3.3-70b-instruct',
].filter(Boolean) as string[];

// Candidate Gemini models
const GEMINI_CANDIDATE_MODELS = ['gemini-3.6-flash', 'gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];

// Helper to call OpenRouter API live
async function callOpenRouter(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  images?: Array<{ mimeType?: string; base64?: string }>
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;
  const hasImages = images && images.length > 0;

  for (const model of OPENROUTER_CANDIDATE_MODELS) {
    // Skip text-only models if images are attached (avoids 404 No endpoints found that support image input)
    if (hasImages && (model.includes('deepseek') || model.includes('llama'))) {
      continue;
    }

    try {
      // Build messages array
      const userContent: any[] = [{ type: 'text', text: userPrompt }];

      if (hasImages) {
        for (const img of images) {
          if (img.base64) {
            userContent.push({
              type: 'image_url',
              image_url: {
                url: img.base64.startsWith('data:')
                  ? img.base64
                  : `data:${img.mimeType || 'image/jpeg'};base64,${img.base64}`,
              },
            });
          }
        }
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'https://ai.studio',
          'X-Title': 'Student Physical Internship Logbook AI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent.length === 1 ? userPrompt : userContent },
          ],
          temperature: 0.3,
          max_tokens: 1200, // Reduced to fit within OpenRouter credit limits
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 402) {
          console.log(`[OpenRouter API] Insufficient credits (HTTP 402). Switching to fallback/Gemini.`);
          throw new Error('OpenRouter insufficient credits (HTTP 402)');
        }
        console.warn(`[OpenRouter API] Model ${model} returned HTTP ${response.status}: ${errorText}`);
        lastError = new Error(`OpenRouter (${model}): ${errorText}`);
        continue;
      }

      const data = (await response.json()) as any;
      const text = data?.choices?.[0]?.message?.content || '';
      if (text.trim()) {
        return { text, modelUsed: `OpenRouter (${model})` };
      }
    } catch (err: any) {
      console.warn(`[OpenRouter API] Error with ${model}:`, err.message);
      lastError = err;
      if (err.message && err.message.includes('402')) {
        break; // Stop trying OpenRouter models if 402 insufficient credits
      }
    }
  }

  throw lastError || new Error('Failed to generate response from OpenRouter live models.');
}

// Helper to call Google Gemini API live
async function callGeminiLive(
  systemPrompt: string,
  userPrompt: string,
  images?: Array<{ mimeType?: string; base64?: string }>
): Promise<{ text: string; modelUsed: string }> {
  const ai = getGeminiClient();
  const contentParts: any[] = [];

  // Attach images
  if (images && Array.isArray(images)) {
    for (const img of images) {
      if (img.base64) {
        const cleanBase64 = img.base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        contentParts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }
    }
  }

  contentParts.push({ text: `${systemPrompt}\n\n${userPrompt}` });

  let lastError: any = null;
  for (const model of GEMINI_CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: contentParts,
      });

      const text = response.text || '';
      if (text.trim()) {
        return { text, modelUsed: `Gemini (${model})` };
      }
    } catch (modelErr: any) {
      lastError = modelErr;
      console.warn(`[Gemini API] Model ${model} returned error:`, modelErr?.message || modelErr);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError || new Error('All Gemini live candidate models returned an error.');
}

// Helper to extract JSON and markdown from model response
function parseLogbookOutput(
  rawText: string,
  defaultDayAndDate?: string,
  defaultDepartment?: string,
  defaultSection?: string,
  defaultTraineeName?: string
) {
  let logbookData: any = null;

  try {
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      logbookData = JSON.parse(jsonMatch[1]);
    } else {
      // Try direct parse if starts with {
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        logbookData = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      }
    }
  } catch (e) {
    console.warn('Could not parse JSON from model output, generating structured data from text:', e);
  }

  // Ensure default fallbacks if fields are missing in parsed JSON
  if (!logbookData) {
    const liveDateStrFallback = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    logbookData = {
      dayAndDate: defaultDayAndDate || liveDateStrFallback,
      department: defaultDepartment || 'Front Office',
      section: defaultSection || `${defaultDepartment || 'Front Office'} - Operations`,
      traineeName: defaultTraineeName || 'Student Trainee',
      table: [
        {
          sn: 1,
          taskDone: 'Conducted shift briefing, reviewed occupancy and verified VIP guest arrivals.',
          skillsAcquired: 'Operational handover and guest identification standards.',
          challengesFaced: 'High arrival volume handled by prioritizing pre-allocated rooms.',
        },
      ],
      supervisorRemarks: 'Carried out assigned tasks responsibly and maintained professional deportment.',
      supervisorName: 'Workplace Trainer & Supervisor',
    };
  }

  if (defaultDayAndDate && (!logbookData.dayAndDate || logbookData.dayAndDate === 'Day and Date string')) {
    logbookData.dayAndDate = defaultDayAndDate;
  }
  if (defaultTraineeName && (!logbookData.traineeName || logbookData.traineeName === 'Student Trainee Name')) {
    logbookData.traineeName = defaultTraineeName;
  }
  if (defaultSection && (!logbookData.section || logbookData.section.includes('Exact Section'))) {
    logbookData.section = defaultSection;
  }

  // Clean markdown by removing the JSON codeblock for clean display
  let markdown = rawText.replace(/```(?:json)?\s*[\s\S]*?\s*```/g, '').trim();

  // If markdown text is empty or sparse after stripping JSON, create clean markdown table
  if (!markdown || markdown.length < 50) {
    markdown = `### 📋 PHYSICAL INTERNSHIP LOGBOOK SHEET
**Day and Date:** ${logbookData.dayAndDate}
**Section / Department of training:** ${logbookData.section || logbookData.department}

---

| S/N | Tasks Done | Skills acquired | Challenges faced |
|---|---|---|---|
${logbookData.table
  .map(
    (row: any) =>
      `| ${row.sn || 1} | ${row.taskDone || ''} | ${row.skillsAcquired || ''} | ${row.challengesFaced || ''} |`
  )
  .join('\n')}`;
  }

  // Ensure any LLM generated footer is replaced with the exact requested format (no asterisks/bold on signature, blank supervisor lines)
  const dividerIndex = markdown.lastIndexOf('---');
  if (dividerIndex !== -1) {
    markdown = markdown.substring(0, dividerIndex).trim();
  }

  markdown += `

---

**Name of trainee:** Write your full name.
**Signature:** Sign your signature.
**Supervisor's remarks:** (Leave blank for your supervisor to sign)
**Name:** Leave it blank for your supervisor to put his/her name.
**Signature:** Leave it blank for the supervisor to sign.`;

  return { logbookData, markdown };
}

// Health & AI Provider Status Endpoint
app.get('/api/health', (req, res) => {
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'ok',
    mode: 'Student Physical Internship Logbook AI',
    openRouterConfigured: hasOpenRouter,
    geminiConfigured: hasGemini,
    activeProvider: hasOpenRouter ? 'OpenRouter Live AI' : hasGemini ? 'Gemini Live AI' : 'Not Configured',
  });
});

// Function to detect department based on keywords in the note
function detectDepartment(userNote: string, selectedDepartment: string): string {
  const noteLower = (userNote || '').toLowerCase();

  // F&B keywords
  const fbKeywords = ['food', 'served', 'cutlery', 'plates', 'dining', 'restaurant', 'waiter', 'beverage', 'table', 'dish'];
  
  // Housekeeping keywords
  const hkKeywords = ['room', 'cleaning', 'bed', 'linen', 'laundry', 'towel', 'dusting', 'turn-down'];

  // Check if F&B keywords are present
  if (fbKeywords.some(keyword => noteLower.includes(keyword))) {
    return "Food & Beverage (F&B) / Restaurant & Dining";
  }

  // Check if Housekeeping keywords are present
  if (hkKeywords.some(keyword => noteLower.includes(keyword))) {
    return "Housekeeping";
  }

  // Fallback to Front Office or user's selected dropdown option
  return selectedDepartment || "Front Office (Reception & Check-in)";
}

// Daily usage tracking for cost safety (3 free generations per client/browser per day in Firestore)
const dailyUsageTracker = new Map<string, { date: string; count: number }>();

async function checkDailyLimit(clientId: string): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date().toISOString().split('T')[0];

  const getMemoryCount = () => {
    let record = dailyUsageTracker.get(clientId);
    if (!record || record.date !== today) {
      record = { date: today, count: 0 };
      dailyUsageTracker.set(clientId, record);
    }
    return record.count;
  };

  let count = 0;
  if (!db) {
    count = getMemoryCount();
  } else {
    try {
      const userRef = doc(db, 'user_usage', clientId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        if (data.usage_date === today) {
          count = data.generation_count || 0;
        }
      }
    } catch (err) {
      count = getMemoryCount();
    }
  }

  if (count >= 3) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: Math.max(0, 3 - count) };
}

async function incrementDailyLimit(clientId: string): Promise<{ remaining: number; count: number }> {
  const today = new Date().toISOString().split('T')[0];

  const incrementMemory = () => {
    let record = dailyUsageTracker.get(clientId);
    if (!record || record.date !== today) {
      record = { date: today, count: 0 };
      dailyUsageTracker.set(clientId, record);
    }
    record.count = Math.min(3, record.count + 1);
    return { remaining: Math.max(0, 3 - record.count), count: record.count };
  };

  if (!db) {
    return incrementMemory();
  }

  try {
    const userRef = doc(db, 'user_usage', clientId);
    const docSnap = await getDoc(userRef);

    let currentCount = 0;
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      if (data.usage_date === today) {
        currentCount = data.generation_count || 0;
      }
    }

    const newCount = Math.min(3, currentCount + 1);
    await setDoc(userRef, {
      usage_date: today,
      generation_count: newCount,
    }, { merge: true });

    return { remaining: Math.max(0, 3 - newCount), count: newCount };
  } catch (err) {
    return incrementMemory();
  }
}

async function getDailyUsage(clientId: string): Promise<{ remaining: number; count: number }> {
  const today = new Date().toISOString().split('T')[0];

  if (!db) {
    let record = dailyUsageTracker.get(clientId);
    if (!record || record.date !== today) {
      record = { date: today, count: 0 };
      dailyUsageTracker.set(clientId, record);
    }
    const count = record.count;
    return { remaining: Math.max(0, 3 - count), count };
  }

  try {
    const userRef = doc(db, 'user_usage', clientId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      if (data.usage_date === today) {
        const count = data.generation_count || 0;
        return { remaining: Math.max(0, 3 - count), count };
      }
    }
    return { remaining: 3, count: 0 };
  } catch (err) {
    let record = dailyUsageTracker.get(clientId);
    if (!record || record.date !== today) {
      record = { date: today, count: 0 };
      dailyUsageTracker.set(clientId, record);
    }
    const count = record.count;
    return { remaining: Math.max(0, 3 - count), count };
  }
}

app.get('/api/usage', async (req, res) => {
  try {
    const clientId = (req.headers['x-client-id'] as string) || req.ip || 'default-client';
    const { remaining, count } = await getDailyUsage(clientId);
    res.json({ success: true, remainingGenerations: remaining, count });
  } catch (err: any) {
    res.json({ success: true, remainingGenerations: 3, count: 0 });
  }
});

// Primary Live Internship Logbook Generation Endpoint
app.post('/api/generate-logbook', async (req, res) => {
  let effectiveDayAndDate = '';
  let activeDepartment = '';
  let activeSection = '';
  let traineeNameVal = '';
  let promptVal = '';
  let departmentVal = '';
  let rotationVal = '';
  let remainingGenerations = 3;

  try {
    const clientId = (req.headers['x-client-id'] as string) || req.ip || 'default-client';
    const {
      prompt,
      images,
      department,
      section,
      rotation,
      dayAndDate,
      traineeName,
      openRouterApiKey,
    } = req.body;

    promptVal = prompt || '';
    departmentVal = department || '';
    rotationVal = rotation || '';
    traineeNameVal = traineeName || 'Student Trainee';

    if (!prompt && (!images || images.length === 0)) {
      return res.status(400).json({
        error: 'Please describe what you did in your shift or upload a photo of your workplace/machinery/work.',
      });
    }

    const effectiveOpenRouterKey =
      openRouterApiKey ||
      (req.headers['x-openrouter-key'] as string) ||
      process.env.OPENROUTER_API_KEY;

    const hasCustomApiKey = Boolean(openRouterApiKey || (req.headers['x-openrouter-key'] as string));

    // Enforce 3-per-day free limit if no custom API key is supplied by the user
    if (!hasCustomApiKey) {
      const { allowed, remaining } = await checkDailyLimit(clientId);
      remainingGenerations = remaining;
      if (!allowed) {
        return res.status(429).json({
          success: false,
          error: "You have reached your daily limit of 3 free logbook entries! Please try again tomorrow.",
          remainingGenerations: 0,
        });
      }
    }

    // Auto-detect active department from note
    const userNote = prompt || '';
    activeDepartment = detectDepartment(userNote, department || 'Front Office');
    activeSection = section || rotation || activeDepartment;

    // Construct enriched user request detailing day, department, and section rotation
    const liveDateStr = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    effectiveDayAndDate = dayAndDate || liveDateStr;

    const userRequestText = `
STUDENT INTERNSHIP LOGBOOK REQUEST:
- Day and Date: ${effectiveDayAndDate}
- Detected / Selected Department: ${activeDepartment}
- Specific Section / Rotational Section: ${activeSection}
- Trainee Name: ${traineeName || 'Student Trainee'}
- Student Notes / Task Description: ${userNote}

DEPARTMENT AUTO-DETECTION & ENFORCEMENT RULE:
- Read the student's task description carefully.
- DETECTED DEPARTMENT: ${activeDepartment}. The output MUST be generated specifically for: ${activeDepartment}.
- IF the user mentions tasks like "served food", "washed cutlery", "cleared plates", "dining", or "restaurant":
  Set the department header strictly to: "Food & Beverage (F&B) / Restaurant & Dining".
- IF the user mentions check-ins, phone calls, or reservations:
  Set the department header strictly to: "Front Office (Reception & Check-in)".
- NEVER generate Front Office tasks (like check-ins or Opera PMS) when the user describes Food & Beverage activities (like serving food or washing cutlery).

CRITICAL FORMATTING REQUIREMENT (Matching physical logbook sheet):
1. Must specify the exact Day and Date: "${effectiveDayAndDate}"
2. Must specify Section / Department of training: "${activeSection}"
3. Provide realistic, high-quality entries in the 4-column table:
   S/N | Tasks Done | Skills acquired | Challenges faced
   (Provide 3 to 5 realistic, detailed rows with academic/vocational terminology matching the ${activeDepartment} department)
4. Provide realistic Supervisor's remarks with supervisor name and sign-off.
5. Return valid JSON inside \`\`\`json ... \`\`\` plus the formatted physical logbook sheet.
`;

    let result: { text: string; modelUsed: string } | null = null;
    let liveError: any = null;

    // 1. Try Google Gemini API first if configured
    if (!result && process.env.GEMINI_API_KEY) {
      try {
        console.log('[AI Engine] Dispatching request to Google Gemini API...');
        result = await callGeminiLive(
          getSystemLogbookPrompt(),
          userRequestText,
          images
        );
      } catch (gemErr: any) {
        console.warn('[Gemini API] Failed:', gemErr.message);
        liveError = gemErr;
      }
    }

    // 2. If Gemini was not used or failed, try OpenRouter (if user provided a key or OPENROUTER_API_KEY is set)
    if (!result && effectiveOpenRouterKey) {
      try {
        console.log('[AI Engine] Dispatching request to OpenRouter API...');
        result = await callOpenRouter(
          effectiveOpenRouterKey,
          getSystemLogbookPrompt(),
          userRequestText,
          images
        );
      } catch (orErr: any) {
        console.warn('[OpenRouter API] Failed:', orErr.message);
        liveError = orErr;
      }
    }

    // 3. Smart fallback generator if live API keys are missing or rate limited
    if (!result) {
      console.log('[AI Engine] Using Smart Logbook Synthesizer fallback...');
      const fallbackText = `{
  "dayAndDate": "${effectiveDayAndDate}",
  "department": "${activeDepartment}",
  "section": "${activeSection}",
  "traineeName": "${traineeName || 'Student Trainee'}",
  "table": [
    {
      "sn": 1,
      "taskDone": "${prompt ? `Executed operational task: ${prompt}` : 'Conducted shift setup, verified inventory and prepared station equipment.'}",
      "skillsAcquired": "Standard operating procedure adherence and practical workflow execution.",
      "challengesFaced": "Managed task timing efficiently with proper workstation organization."
    },
    {
      "sn": 2,
      "taskDone": "Collaborated with departmental team members and supervisor on quality control.",
      "skillsAcquired": "Professional communication and guest/client service excellence.",
      "challengesFaced": "Maintained accuracy during high-volume operational hours."
    }
  ],
  "supervisorRemarks": "Demonstrated commendable dedication, diligence, and adherence to workplace safety protocols.",
  "supervisorName": "Workplace Supervisor & Trainer"
}

### 📋 PHYSICAL INTERNSHIP LOGBOOK SHEET
**Day and Date:** ${effectiveDayAndDate}
**Section / Department of training:** ${activeSection}

---

| S/N | Tasks Done | Skills acquired | Challenges faced |
|---|---|---|---|
| 1 | ${prompt ? `Executed operational task: ${prompt}` : 'Conducted shift setup, verified inventory and prepared station equipment.'} | Standard operating procedure adherence and practical workflow execution. | Managed task timing efficiently with proper workstation organization. |
| 2 | Collaborated with departmental team members and supervisor on quality control. | Professional communication and guest/client service excellence. | Maintained accuracy during high-volume operational hours. |

---

**Name of trainee:** Write your full name.
**Signature:** Sign your signature.
**Supervisor's remarks:** (Leave blank for your supervisor to sign)
**Name:** Leave it blank for your supervisor to put his/her name.
**Signature:** Leave it blank for the supervisor to sign.`;

      if (!hasCustomApiKey) {
        const inc = await incrementDailyLimit(clientId);
        remainingGenerations = inc.remaining;
      }

      const { logbookData, markdown } = parseLogbookOutput(
        fallbackText,
        dayAndDate,
        department,
        section || rotation,
        traineeName
      );

      return res.json({
        success: true,
        content: markdown,
        logbookData,
        source: 'Smart Online Synthesizer',
        remainingGenerations,
      });
    }

    // Increment daily usage count in Firestore upon successful generation
    if (!hasCustomApiKey) {
      const inc = await incrementDailyLimit(clientId);
      remainingGenerations = inc.remaining;
    }

    // Parse the output into structured JSON and clean markdown
    const { logbookData, markdown } = parseLogbookOutput(
      result.text,
      dayAndDate,
      department,
      section || rotation,
      traineeName
    );

    return res.json({
      success: true,
      content: markdown,
      logbookData,
      source: result.modelUsed,
      remainingGenerations,
    });
  } catch (error: any) {
    console.error('Logbook generator error (falling back to Smart Synthesizer):', error);
    const fallbackDayDate = effectiveDayAndDate || new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    const fallbackDept = activeDepartment || departmentVal || 'Front Office';
    const fallbackSec = activeSection || rotationVal || fallbackDept;
    const fallbackTrainee = traineeNameVal || 'Student Trainee';

    const fallbackText = `{
  "dayAndDate": "${fallbackDayDate}",
  "department": "${fallbackDept}",
  "section": "${fallbackSec}",
  "traineeName": "${fallbackTrainee}",
  "table": [
    {
      "sn": 1,
      "taskDone": "${promptVal ? `Executed operational task: ${promptVal}` : 'Conducted shift setup, verified inventory and prepared station equipment.'}",
      "skillsAcquired": "Standard operating procedure adherence and practical workflow execution.",
      "challengesFaced": "Managed task timing efficiently with proper workstation organization."
    },
    {
      "sn": 2,
      "taskDone": "Collaborated with departmental team members and supervisor on quality control.",
      "skillsAcquired": "Professional communication and guest/client service excellence.",
      "challengesFaced": "Maintained accuracy during high-volume operational hours."
    }
  ],
  "supervisorRemarks": "Demonstrated commendable dedication, diligence, and adherence to workplace safety protocols.",
  "supervisorName": "Workplace Supervisor & Trainer"
}

### 📋 PHYSICAL INTERNSHIP LOGBOOK SHEET
**Day and Date:** ${fallbackDayDate}
**Section / Department of training:** ${fallbackSec}

---

| S/N | Tasks Done | Skills acquired | Challenges faced |
|---|---|---|---|
| 1 | ${promptVal ? `Executed operational task: ${promptVal}` : 'Conducted shift setup, verified inventory and prepared station equipment.'} | Standard operating procedure adherence and practical workflow execution. | Managed task timing efficiently with proper workstation organization. |
| 2 | Collaborated with departmental team members and supervisor on quality control. | Professional communication and guest/client service excellence. | Maintained accuracy during high-volume operational hours. |

---

**Name of trainee:** Write your full name.
**Signature:** Sign your signature.
**Supervisor's remarks:** (Leave blank for your supervisor to sign)
**Name:** Leave it blank for the supervisor to put his/her name.
**Signature:** Leave it blank for the supervisor to sign.`;

    const parsed = parseLogbookOutput(
      fallbackText,
      fallbackDayDate,
      fallbackDept,
      fallbackSec,
      fallbackTrainee
    );

    return res.json({
      success: true,
      content: parsed.markdown,
      logbookData: parsed.logbookData,
      source: 'Smart Online Synthesizer (Auto-Fallback)',
      remainingGenerations: remainingGenerations !== undefined ? remainingGenerations : 2,
    });
  }
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Internship Logbook AI Server running live on port ${PORT}`);
  });
}

startServer();
