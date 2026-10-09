import { Printer, ShieldCheck, ShieldAlert, FileSearch, ArrowRight, Shield } from 'lucide-react';
import type { ComprehensiveSimulationResult } from '../../types/results';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';

export function SecurityReport({ result }: { result: ComprehensiveSimulationResult | null }) {
  if (!result) return null;

  const { record, analysis, learningImpact, remediationEffectiveness, aiExplanation } = result;

  const isBlocked = record.result === 'ATTACK BLOCKED' || record.result === 'DATA RECOVERED';
  const reportDate = new Date(record.date).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Panel className="border-slate-700 bg-slate-950 mb-8 overflow-hidden relative">
      {/* Hide the rest of the app during print, only show this report */}
      <style>{`
        @media print {
          /* Reset viewport and layout restrictions to allow pagination */
          html, body, #root {
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Override application layout constraints */
          .h-screen, .h-full, .overflow-hidden, .overflow-y-auto, main {
            height: auto !important;
            overflow: visible !important;
          }

          /* Force relative containers to static so absolute positioning attaches to body */
          .relative {
            position: static !important;
          }

          /* Hide all elements by default */
          body * {
            visibility: hidden;
          }

          /* Make only the report visible */
          .security-report-printable, .security-report-printable * {
            visibility: visible;
          }

          /* Position the report at the very top of the document */
          .security-report-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background-color: white !important;
            color: black !important;
            padding: 0 !important; /* Let browser margins handle the edge */
          }

          .print-hide {
            display: none !important;
          }

          .print-break-inside-avoid {
            break-inside: avoid;
          }

          .print-page-break {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="security-report-printable p-8">

        {/* HEADER & CONTROLS */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-800 print:border-gray-300">
          <div>
            <h1 className="text-2xl font-black text-white print:text-black uppercase tracking-widest flex items-center gap-3">
              <Shield className="text-cyan-500 print:text-cyan-700" size={28} />
              CyberShadow
            </h1>
            <div className="text-sm font-bold text-slate-400 print:text-gray-600 tracking-wider mt-1">
              Security Simulation Report
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 print:border-amber-600 print:text-amber-700 text-xs font-bold rounded">
              <ShieldAlert size={14} />
              SIMULATION ONLY • NO REAL SYSTEM ACCESS
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <Button variant="secondary" size="sm" onClick={handlePrint} className="print-hide mb-4 border-slate-600">
              <Printer size={16} className="mr-2" />
              Print / Export Report
            </Button>
            <div className="text-xs text-slate-500 print:text-gray-500 font-mono">
              Report ID: {record.id.substring(0, 12).toUpperCase()}<br/>
              Generated: {reportDate}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* EXECUTIVE SUMMARY */}
          <div className="print-break-inside-avoid">
            <h2 className="text-sm font-bold text-cyan-500 print:text-cyan-700 uppercase tracking-widest mb-4 border-b border-slate-800 print:border-gray-300 pb-2">
              Executive Summary
            </h2>
            <div className="text-sm text-slate-300 print:text-black space-y-3 leading-relaxed">
              <p>
                A simulated cyberattack scenario (<strong>{record.scenarioId}</strong>) was executed against the synthetic digital twin environment.
                The final outcome of the simulation was <strong className={isBlocked ? 'text-green-400 print:text-green-600' : 'text-red-400 print:text-red-600'}>{record.result}</strong>.
              </p>
              <p>
                The deterministic security analysis identified <strong>{analysis.findings.length}</strong> security finding(s).
                The overall severity posture is assessed as <strong>{analysis.overallSeverity}</strong>.
              </p>
              {analysis.affectedAssets.length > 0 && (
                <p>Affected simulated assets included: {analysis.affectedAssets.join(', ')}.</p>
              )}
            </div>
          </div>

          {/* SIMULATION DETAILS */}
          <div className="print-break-inside-avoid">
            <h2 className="text-sm font-bold text-cyan-500 print:text-cyan-700 uppercase tracking-widest mb-4 border-b border-slate-800 print:border-gray-300 pb-2">
              Simulation Details
            </h2>
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-slate-800/50 print:divide-gray-200">
                <tr>
                  <td className="py-2 text-slate-500 print:text-gray-500 font-medium">Scenario</td>
                  <td className="py-2 font-bold text-slate-200 print:text-black">{record.scenarioId}</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500 print:text-gray-500 font-medium">Category</td>
                  <td className="py-2 font-bold text-slate-200 print:text-black">{record.category}</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500 print:text-gray-500 font-medium">Outcome</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${isBlocked ? 'bg-green-500/10 text-green-400 print:text-green-600' : 'bg-red-500/10 text-red-400 print:text-red-600'}`}>
                      {record.result}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500 print:text-gray-500 font-medium">Attack Path</td>
                  <td className="py-2 text-slate-300 print:text-black font-mono text-xs">
                    {record.attackPath && record.attackPath.length > 0
                      ? record.attackPath.join(' → ')
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECURITY POSTURE */}
        <div className="mb-10 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-cyan-500 print:text-cyan-700 uppercase tracking-widest mb-4 border-b border-slate-800 print:border-gray-300 pb-2">
            Security Posture
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="text-slate-400 print:text-gray-600 mb-2">Active Defenses During Simulation:</div>
            {record.defensesActive.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {record.defensesActive.map(d => (
                  <div key={d} className="px-3 py-1 bg-blue-900/20 print:bg-blue-100 border border-blue-800/50 print:border-blue-300 text-blue-300 print:text-blue-800 rounded font-medium text-xs">
                    {d}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 print:text-gray-500 italic">No defensive controls were active.</div>
            )}
          </div>
        </div>

        {/* SECURITY FINDINGS (Print Only) */}
        <div className="mb-10 hidden print:block">
          <h2 className="text-sm font-bold text-cyan-500 print:text-cyan-700 uppercase tracking-widest mb-4 border-b border-slate-800 print:border-gray-300 pb-2">
            Security Findings
          </h2>
          {analysis.findings.length > 0 ? (
            <div className="space-y-6">
              {analysis.findings.map((f, i) => (
                <div key={i} className="bg-[#0b1120] print:bg-gray-50 border border-slate-800 print:border-gray-300 p-5 rounded print-break-inside-avoid">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-200 print:text-black text-base">{f.title}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                        f.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 print:bg-red-100 print:text-red-700' :
                        f.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 print:bg-orange-100 print:text-orange-700' :
                        f.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 print:bg-amber-100 print:text-amber-700' :
                        'bg-blue-500/20 text-blue-400 print:bg-blue-100 print:text-blue-700'
                    }`}>
                      {f.severity}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
                    <div><span className="text-slate-500 print:text-gray-500">Category:</span> <span className="text-slate-300 print:text-black">{f.category}</span></div>
                    <div><span className="text-slate-500 print:text-gray-500">Asset:</span> <span className="text-slate-300 print:text-black">{f.affectedAsset}</span></div>
                    <div className="md:col-span-2"><span className="text-slate-500 print:text-gray-500">Root Cause:</span> <span className="text-slate-300 print:text-black">{f.cause}</span></div>
                  </div>
                  <p className="text-sm text-slate-400 print:text-gray-700 mb-2">{f.description}</p>
                  <div className="text-sm bg-red-950/20 print:bg-red-50 border border-red-900/30 print:border-red-100 p-3 rounded mb-2">
                    <strong className="text-red-400 print:text-red-700 text-xs block mb-1">IMPACT:</strong>
                    <span className="text-slate-300 print:text-gray-800">{f.impact}</span>
                  </div>
                  <div className="text-sm bg-green-950/20 print:bg-green-50 border border-green-900/30 print:border-green-100 p-3 rounded">
                    <strong className="text-green-400 print:text-green-700 text-xs block mb-1">RECOMMENDATION:</strong>
                    <span className="text-slate-300 print:text-gray-800">{f.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-400 print:text-green-600 bg-green-950/20 print:bg-green-50 p-4 rounded border border-green-900/30 print:border-green-200">
              <ShieldCheck size={20} />
              <span className="font-medium text-sm">No security findings detected. Defenses operated as expected.</span>
            </div>
          )}
        </div>

        {/* RECOMMENDED ACTIONS SUMMARY (Print Only) */}
        {learningImpact?.practiceNext && (
          <div className="mb-10 print-break-inside-avoid hidden print:block">
             <h2 className="text-sm font-bold text-cyan-500 print:text-cyan-700 uppercase tracking-widest mb-4 border-b border-slate-800 print:border-gray-300 pb-2">
              Recommended Action & Next Steps
            </h2>
            <div className="bg-[#0b1120] print:bg-gray-50 border border-slate-800 print:border-gray-300 p-5 rounded">
               <div className="font-bold text-slate-200 print:text-black mb-2">{learningImpact.practiceNext.suggestedAction}</div>
               <p className="text-sm text-slate-400 print:text-gray-600 mb-3">{learningImpact.practiceNext.reason}</p>
               <div className="text-xs text-slate-500 print:text-gray-500">
                 Target Area: <span className="font-mono text-cyan-400 print:text-cyan-600">{learningImpact.practiceNext.targetSkillName}</span>
               </div>
            </div>
          </div>
        )}

        {/* BEFORE -> AFTER VALIDATION (Print Only) */}
        {remediationEffectiveness && (
          <div className="mb-10 print-break-inside-avoid hidden print:block">
             <h2 className="text-sm font-bold text-cyan-500 print:text-cyan-700 uppercase tracking-widest mb-4 border-b border-slate-800 print:border-gray-300 pb-2">
              Before / After Validation
            </h2>
            <div className="bg-[#0b1120] print:bg-gray-50 border border-slate-800 print:border-gray-300 p-5 rounded">
              <p className="text-sm text-slate-300 print:text-black mb-4">
                <strong>Outcome:</strong> <span className="text-violet-400 print:text-violet-600 font-bold">{remediationEffectiveness.outcome.replace('_', ' ')}</span>
                <br/>
                <span className="text-slate-400 print:text-gray-600 mt-1 block">{remediationEffectiveness.explanation}</span>
              </p>
              <div className="flex flex-col md:flex-row items-center gap-4">
                 <div className="flex-1 w-full p-4 bg-[#060a14] print:bg-white border border-slate-700 print:border-gray-200 rounded">
                   <div className="text-xs font-bold text-slate-500 print:text-gray-500 uppercase mb-2">Before ({remediationEffectiveness.before.relevantControlActive ? 'Active' : 'Inactive'})</div>
                   <div className="text-sm text-amber-400 print:text-amber-600 font-bold">{remediationEffectiveness.before.findings.length} findings</div>
                 </div>
                 <ArrowRight size={20} className="text-slate-600 print:text-gray-400 hidden md:block" />
                 <div className="flex-1 w-full p-4 bg-[#060a14] print:bg-white border border-slate-700 print:border-gray-200 rounded">
                   <div className="text-xs font-bold text-violet-400 print:text-violet-600 uppercase mb-2">After ({remediationEffectiveness.after.relevantControlActive ? 'Active' : 'Inactive'})</div>
                   <div className="text-sm text-green-400 print:text-green-600 font-bold">{remediationEffectiveness.after.findings.length} findings</div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* AI SECURITY ANALYST (Print Only) */}
        {aiExplanation && (
          <div className="mb-10 print-break-inside-avoid print-page-break hidden print:block">
             <h2 className="text-sm font-bold text-cyan-500 print:text-cyan-700 uppercase tracking-widest mb-4 border-b border-slate-800 print:border-gray-300 pb-2 flex items-center gap-2">
              <FileSearch size={16} /> AI Security Analyst
            </h2>
            <div className="bg-[#0b1120] print:bg-gray-50 border border-slate-800 print:border-gray-300 p-6 rounded text-sm text-slate-300 print:text-gray-700 leading-relaxed space-y-4">
              {aiExplanation.situation && (
                <p><strong>Situation:</strong> {aiExplanation.situation}</p>
              )}
              {aiExplanation.securityWeakness && (
                <p><strong>Security Weakness:</strong> {aiExplanation.securityWeakness}</p>
              )}
              {aiExplanation.defenseImpact && (
                <p><strong>Defense Impact:</strong> {aiExplanation.defenseImpact}</p>
              )}
              {aiExplanation.learnerInsight && (
                <p><strong>Learner Insight:</strong> {aiExplanation.learnerInsight}</p>
              )}
              {aiExplanation.adaptivePractice && (
                <p><strong>Recommended Next Step:</strong> {aiExplanation.adaptivePractice}</p>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t border-slate-800 print:border-gray-300 text-center text-xs text-slate-500 print:text-gray-400 pb-4">
          <p className="mb-1 font-bold">CyberShadow • AI-powered Digital Attack Simulation Twin</p>
          <p>SIMULATION ONLY — NO REAL SYSTEM ACCESS</p>
          <p className="mt-4 opacity-50">Report generated securely within the local browser environment.</p>
        </div>

      </div>
    </Panel>
  );
}
