import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Printer,
  FileText,
  Table as TableIcon,
} from 'lucide-react';
import { useTheme } from '../ThemeContext';

export interface LogbookTableRow {
  sn: number | string;
  taskDone: string;
  skillsAcquired: string;
  challengesFaced: string;
}

export interface StructuredLogbookData {
  dayAndDate?: string;
  department?: string;
  section?: string;
  traineeName?: string;
  table?: LogbookTableRow[];
  supervisorRemarks?: string;
  supervisorName?: string;
}

interface PhysicalLogbookCardProps {
  content: string;
  logbookData?: StructuredLogbookData;
  source?: string;
  onClear?: () => void;
}

export const PhysicalLogbookCard: React.FC<PhysicalLogbookCardProps> = ({
  content,
  logbookData,
  source,
  onClear,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const liveDateDefault = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Extract or parse structured data from markdown if logbookData isn't provided
  const parsedSheet = useMemo(() => {
    if (logbookData && logbookData.table && logbookData.table.length > 0) {
      return {
        dayAndDate: logbookData.dayAndDate || liveDateDefault,
        department: logbookData.department || 'Front Office',
        section: logbookData.section || logbookData.department || 'Front Office - Reception',
        traineeName: logbookData.traineeName || 'Student Trainee',
        table: logbookData.table,
        supervisorRemarks:
          logbookData.supervisorRemarks ||
          'Carried out assigned tasks responsibly and maintained professional deportment.',
        supervisorName: logbookData.supervisorName || 'Department Supervisor',
      };
    }

    // Parse from markdown text
    let dayAndDate = liveDateDefault;
    let section = 'Front Office';
    let traineeName = 'Write your full name.';
    let supervisorRemarks = '(Leave blank for your supervisor to sign)';
    let supervisorName = 'Leave it blank for the supervisor to put his/her name.';

    const dayMatch = content.match(/\*\*Day and Date:\*\*\s*([^\n\r*]+)/i) || content.match(/Day and Date:\s*([^\n\r*]+)/i);
    if (dayMatch && dayMatch[1]) dayAndDate = dayMatch[1].trim();

    const secMatch =
      content.match(/\*\*Section \/ Department of training:\*\*\s*([^\n\r*]+)/i) ||
      content.match(/Section \/ Department of training:\s*([^\n\r*]+)/i);
    if (secMatch && secMatch[1]) section = secMatch[1].trim();

    const traineeMatch = content.match(/\*\*Name of trainee:\*\*\s*([^\n\r*]+)/i);
    if (traineeMatch && traineeMatch[1] && !traineeMatch[1].includes('....')) {
      traineeName = traineeMatch[1].trim();
    }

    const remarksMatch = content.match(/\*\*Supervisor's remarks:\*\*\s*([^\n\r*]+)/i);
    if (remarksMatch && remarksMatch[1] && !remarksMatch[1].includes('....')) {
      supervisorRemarks = remarksMatch[1].trim();
    }

    // Parse markdown table rows
    const rows: LogbookTableRow[] = [];
    const lines = content.split('\n');
    let inTable = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.includes('Tasks Done')) {
        inTable = true;
        continue;
      }
      if (inTable && trimmed.startsWith('|--')) {
        continue;
      }
      if (inTable && trimmed.startsWith('|')) {
        const parts = trimmed.split('|').map((p) => p.trim());
        // parts[0] is empty, parts[1]=S/N, parts[2]=Tasks, parts[3]=Skills, parts[4]=Challenges
        if (parts.length >= 5 && parts[1] && !isNaN(Number(parts[1]))) {
          rows.push({
            sn: parts[1],
            taskDone: parts[2] || '',
            skillsAcquired: parts[3] || '',
            challengesFaced: parts[4] || '',
          });
        }
      } else if (inTable && !trimmed.startsWith('|')) {
        inTable = false;
      }
    }

    // If no markdown table found, provide realistic fallback rows
    if (rows.length === 0) {
      rows.push({
        sn: 1,
        taskDone: 'Conducted shift briefing, reviewed occupancy and verified guest arrival manifest.',
        skillsAcquired: 'Opera PMS system management, room allocation, and guest communication.',
        challengesFaced: 'High check-in volume managed by prioritizing pre-allocated rooms.',
      });
      rows.push({
        sn: 2,
        taskDone: 'Assisted departing guests with folio reviews, room charge billing, and keycard deactivation.',
        skillsAcquired: 'POS card terminal handling, accuracy in cash/credit settlement.',
        challengesFaced: 'Disputed mini-bar charge resolved swiftly via housekeeping minibar log check.',
      });
    }

    return {
      dayAndDate,
      department: section.split('(')[0].trim(),
      section,
      traineeName,
      table: rows,
      supervisorRemarks,
      supervisorName,
    };
  }, [content, logbookData]);

  const handleCopyField = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(id);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy field:', err);
    }
  };

  return (
    <div
      className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
        isLight
          ? 'bg-white border-[#cbd5e1] text-[#1e293b]'
          : 'bg-[#18191c] border-white/10 text-[#e2e8f0]'
      }`}
      id="physical-logbook-card"
    >
      {/* Top Banner: Logbook Verification Header & Actions */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Daily Logbook Entry Sheet
            </h3>
          </div>
          {onClear && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Close and clear view"
            >
              Clear view
            </button>
          )}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 text-left">
          Clean, structured tasks ready to copy directly into your physical institutional logbook.
        </p>
      </div>

      {/* Main Content Area */}
      {/* Authentic Physical Logbook Sheet View Matching the User's Real Paper Logbook Photo */}
      <div className="p-4 sm:p-6 overflow-x-auto select-text font-sans leading-relaxed text-sm bg-slate-50/50 dark:bg-black/20">
          <div
            className={`max-w-4xl mx-auto p-6 sm:p-8 rounded-xl border shadow-sm transition-all ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900'
                : 'bg-[#151619] border-white/10 text-slate-100'
            }`}
            id="physical-paper-sheet"
          >
            {/* Top Sheet Header with Dotted Lines */}
            <div className="flex flex-col gap-3 pb-5 border-b border-slate-200 dark:border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <span className="font-bold text-sm tracking-wide shrink-0">Day and Date:</span>
                <div className="flex-1 pb-1 border-b border-dotted border-slate-400 dark:border-slate-500 font-medium text-sm text-[#1e3a5f] dark:text-[#a8c7fa]">
                  {parsedSheet.dayAndDate}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <span className="font-bold text-sm tracking-wide shrink-0">
                  Section / Department of training:
                </span>
                <div className="flex-1 pb-1 border-b border-dotted border-slate-400 dark:border-slate-500 font-medium text-sm text-[#1e3a5f] dark:text-[#a8c7fa]">
                  {parsedSheet.section}
                </div>
              </div>
            </div>

            {/* The 4-Column Official Training Logbook Table */}
            <div className="mt-5 overflow-x-auto rounded-lg border border-slate-300 dark:border-white/15">
              <table className="w-full text-left text-xs border-collapse min-w-[580px]">
                <thead>
                  <tr
                    className={`border-b ${
                      isLight
                        ? 'bg-slate-100/90 text-slate-800 border-slate-300'
                        : 'bg-white/5 text-slate-200 border-white/15'
                    }`}
                  >
                    <th className="py-2.5 px-3 font-bold border-r border-slate-300 dark:border-white/15 w-12 text-center">
                      S/N
                    </th>
                    <th className="py-2.5 px-3.5 font-bold border-r border-slate-300 dark:border-white/15 w-2/5">
                      Tasks Done
                    </th>
                    <th className="py-2.5 px-3.5 font-bold border-r border-slate-300 dark:border-white/15 w-[30%]">
                      Skills acquired
                    </th>
                    <th className="py-2.5 px-3.5 font-bold">Challenges faced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {parsedSheet.table.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors ${
                        idx % 2 === 1 ? (isLight ? 'bg-slate-50/40' : 'bg-white/[0.01]') : ''
                      }`}
                    >
                      <td className="py-3 px-3 border-r border-slate-300 dark:border-white/15 text-center font-semibold text-slate-500 dark:text-slate-400 align-top">
                        {row.sn || idx + 1}
                      </td>
                      <td className="py-3 px-3.5 border-r border-slate-300 dark:border-white/15 leading-relaxed align-top">
                        <div className="flex justify-between items-start gap-2">
                          <span>{row.taskDone}</span>
                          <button
                            onClick={() => handleCopyField(row.taskDone, `task-${idx}`)}
                            className="opacity-40 hover:opacity-100 p-1 cursor-pointer shrink-0"
                            title="Copy task"
                          >
                            {copiedField === `task-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 border-r border-slate-300 dark:border-white/15 leading-relaxed align-top">
                        <div className="flex justify-between items-start gap-2">
                          <span>{row.skillsAcquired}</span>
                          <button
                            onClick={() => handleCopyField(row.skillsAcquired, `skill-${idx}`)}
                            className="opacity-40 hover:opacity-100 p-1 cursor-pointer shrink-0"
                            title="Copy skill"
                          >
                            {copiedField === `skill-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 leading-relaxed align-top">
                        <div className="flex justify-between items-start gap-2">
                          <span>{row.challengesFaced}</span>
                          <button
                            onClick={() => handleCopyField(row.challengesFaced, `chal-${idx}`)}
                            className="opacity-40 hover:opacity-100 p-1 cursor-pointer shrink-0"
                            title="Copy challenge"
                          >
                            {copiedField === `chal-${idx}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Trainee & Supervisor Sign-off Section Matching the Photo */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-4 text-xs">
              {/* Trainee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold shrink-0">Name of trainee:</span>
                  <span className="flex-1 pb-1 border-b border-dotted border-slate-400 dark:border-slate-500 font-medium">
                    {parsedSheet.traineeName}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold shrink-0">Signature:</span>
                  <span className="flex-1 pb-1 border-b border-dotted border-slate-400 dark:border-slate-500 italic opacity-80">
                    Sign your signature.
                  </span>
                </div>
              </div>

              {/* Supervisor's Remarks */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="font-semibold">Supervisor's remarks:</span>
                <div className="p-3 rounded-lg border border-dotted border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-white/[0.02] italic leading-relaxed text-slate-700 dark:text-slate-300">
                  {parsedSheet.supervisorRemarks}
                </div>
              </div>

              {/* Supervisor Sign-off Line */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold shrink-0">Name:</span>
                  <span className="flex-1 pb-1 border-b border-dotted border-slate-400 dark:border-slate-500">
                    {parsedSheet.supervisorName}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold shrink-0">Signature:</span>
                  <span className="flex-1 pb-1 border-b border-dotted border-slate-400 dark:border-slate-500 italic">
                    Leave it blank for the supervisor to sign.
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold shrink-0">Date:</span>
                  <span className="flex-1 pb-1 border-b border-dotted border-slate-400 dark:border-slate-500">
                    {parsedSheet.dayAndDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* Bottom Footer Info */}
      {onClear && (
        <div
          className={`px-4 py-2.5 text-[11px] flex items-center justify-end border-t ${
            isLight
              ? 'bg-[#f8fafc] border-[#e2e8f0] text-slate-500'
              : 'bg-[#141517] border-white/5 text-slate-400'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
            className="hover:underline cursor-pointer opacity-75 hover:opacity-100 text-xs"
          >
            Clear view
          </button>
        </div>
      )}
    </div>
  );
};
