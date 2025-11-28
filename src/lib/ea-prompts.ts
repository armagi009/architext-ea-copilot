interface IntakeMetadata {
  engagementName: string;
  region: string;
  trigger: string;
  fileSnippets: { name: string; content: string }[];
}
/**
 * Builds the initial intake prompt for the ChatAgent.
 * @param metadata - The structured intake data.
 * @returns A string prompt for the AI.
 *
 * Example AI Response Schema (for frontend parsing):
 * {
 *   "brief": "One-paragraph summary of the engagement...",
 *   "kpis": ["KPI 1", "KPI 2"],
 *   "hypothesis": "Our initial hypothesis is...",
 *   "validationQuestions": [
 *     { "question": "Question 1?", "priority": "High", "impact": "Board" },
 *     { "question": "Question 2?", "priority": "Medium", "impact": "Technical" }
 *   ],
 *   "confidenceScore": 0.87,
 *   "evidence": [
 *     { "source": "document1.pdf", "excerpt": "Relevant snippet..." }
 *   ]
 * }
 */
export function buildIntakePrompt(metadata: IntakeMetadata): string {
  const fileContext = metadata.fileSnippets
    .map(f => `--- FILE: ${f.name} ---\n${f.content.slice(0, 1000)}...`)
    .join('\n\n');
  return `
    As an expert Enterprise Architect, create a one-page engagement brief based on the following information.
    Your response MUST be a single, valid JSON object. Do not include any text outside of the JSON object.
    Engagement Details:
    - Name: ${metadata.engagementName}
    - Region: ${metadata.region}
    - Trigger: ${metadata.trigger}
    Source Artifacts (Snippets):
    ${fileContext}
    Instructions:
    1.  **brief**: Write a concise, one-paragraph summary of the engagement's problem, goals, and scope.
    2.  **kpis**: Identify 2-3 key performance indicators (KPIs) to measure success.
    3.  **hypothesis**: Formulate a clear, testable initial hypothesis for the engagement.
    4.  **validationQuestions**: Generate a list of 5-10 critical validation questions for stakeholders, prioritized by board-level impact. Each question should be an object with "question", "priority" ('High', 'Medium', 'Low'), and "impact" ('Board', 'Technical', 'Financial').
    5.  **confidenceScore**: Provide a confidence score (0.0 to 1.0) for this initial assessment.
    6.  **evidence**: List the source artifacts that informed your brief, with a short excerpt for each.
    Return ONLY the JSON object.
  `;
}
/**
 * Builds a prompt to request target architecture designs.
 * @param constraints - Key constraints for the design.
 * @returns A string prompt for the AI.
 */
export function buildDesignPrompt(constraints: string): string {
  return `
    Based on the established engagement context, generate three distinct target architecture options that address the following constraint: "${constraints}".
    For each option, provide a concise summary, a decision matrix (cost, benefit, risk, effort), and a draft Architecture Decision Record (ADR).
    Return the response as a structured list of objects.
  `;
}