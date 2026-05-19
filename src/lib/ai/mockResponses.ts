import type { AIAnalysisResult } from '@/types/analysis';

export const MOCK_EMPLOYMENT_ANALYSIS: AIAnalysisResult = {
  title: 'Employment Contract Risk Analysis',
  contractType: 'Employment',
  perspective: 'Employee',
  overallRiskScore: 84,
  riskLevel: 'Critical',
  executiveSummary:
    'This employment contract contains several highly exploitative clauses that severely restrict the employee\'s post-employment freedom, vest all intellectual property (including work done outside office hours) in the employer, mandate one-sided arbitration, and allow immediate termination with no compensation. The overall risk to the employee is Critical.',
  plainEnglishSummary:
    'This contract is heavily one-sided in favor of the employer. You are agreeing to a 24-month non-compete that prevents you from working in your industry anywhere in India or internationally. The company will own everything you create — including personal projects done at home. If you have a dispute, only the company gets to choose the arbitrator. You can be fired immediately with no notice and no pending dues.',
  simpleSummary:
    'This contract is extremely one-sided in favor of the employer. You are agreeing to a 24-month non-compete that blocks you from working in your industry anywhere in India or globally. Even personal projects done at home belong to the company. If there is a dispute, the company picks the arbitrator. And they can fire you without notice and keep your pending salary.',
  topRisks: [
    {
      title: '24-Month Non-Compete Clause',
      category: 'Non-compete',
      severity: 'Critical',
      score: 92,
      whyItMatters: 'Prevents you from working in your field for 2 years, essentially pausing your career.',
      realWorldImpact: 'After leaving, you cannot join any competitor, start a competing business, or freelance in your domain for 24 months — globally.',
      whatToDo: 'Negotiate to reduce to 6 months, limit to direct competitors only, and restrict geography to the city or state.',
    },
    {
      title: 'Broad Intellectual Property Assignment',
      category: 'Intellectual Property',
      severity: 'Critical',
      score: 89,
      whyItMatters: 'Any idea or creation — even personal projects built at home — becomes company property.',
      realWorldImpact: 'That mobile app you built on weekends, or a side project you\'ve been developing — the company can claim ownership over it.',
      whatToDo: 'Add a carve-out for projects unrelated to company business, done outside working hours on personal equipment.',
    },
    {
      title: 'One-Sided Arbitration Clause',
      category: 'Arbitration',
      severity: 'High',
      score: 78,
      whyItMatters: 'The company chooses the arbitrator, giving them structural advantage in disputes.',
      realWorldImpact: 'If you face wrongful termination or salary disputes, the arbitrator may be biased toward the company.',
      whatToDo: 'Demand neutral arbitrator selection by a recognized body like ICADR or ICA.',
    },
  ],
  clauseAnalyses: [
    {
      clauseTitle: 'Non-Compete Restriction',
      clauseText:
        'The employee agrees not to work with any competing business in India or abroad for a period of 24 months after termination.',
      category: 'Non-compete',
      severity: 'Critical',
      riskScore: 92,
      riskDimensions: {
        financial: 85,
        privacy: 10,
        employment: 98,
        ipOwnership: 20,
        legalExposure: 70,
        termination: 60,
        ambiguity: 65,
      },
      plainExplanation:
        'For 24 months after you leave this job — for any reason — you cannot work for any company that competes with your employer, anywhere in the world. This is an extremely broad restriction that could make you unemployable in your own industry.',
      simpleExplanation:
        'Once you leave this job — whether you quit or get fired — you cannot work for any competing company for the next 24 months, anywhere in the world. This is extremely risky because your entire career could be stuck for 2 full years.',
      hiddenRisk:
        'The clause does not define what "competing business" means. Your employer can claim any adjacent company is a competitor and use this to block your career moves.',
      possibleWorstCase:
        'You resign to join a startup — the company sends a legal notice claiming it competes. You are forced to negotiate or wait 24 months before you can work in your field again.',
      isOneSided: true,
      isAmbiguous: true,
      negotiationSuggestion:
        'Request a maximum 6-month non-compete limited to direct competitors in the same city, with reasonable compensation during the restricted period.',
      betterClauseSuggestion:
        'The employee agrees not to join or establish a direct competitor within [city] for a period of 6 months after voluntary resignation, provided the employer pays 50% of last drawn salary during this period.',
      questionsToAsk: [
        'What specifically qualifies as a "competing business"?',
        'Will I receive compensation during the 24-month non-compete period?',
        'Does this apply even if I am terminated without cause?',
        'Is this clause enforceable under Indian law in my specific state?',
      ],
    },
    {
      clauseTitle: 'Intellectual Property Ownership',
      clauseText:
        'The company shall own all intellectual property created by the employee during and outside working hours.',
      category: 'Intellectual Property',
      severity: 'Critical',
      riskScore: 89,
      riskDimensions: {
        financial: 70,
        privacy: 20,
        employment: 75,
        ipOwnership: 98,
        legalExposure: 80,
        termination: 30,
        ambiguity: 55,
      },
      plainExplanation:
        'The company owns EVERYTHING you create — not just work done during office hours, but also personal projects, apps, blogs, or inventions you create at home on your own time using your own computer.',
      simpleExplanation:
        'This means everything you create — any app, any design, any invention — even at home, belongs to the company. Not just office work, but "outside working hours" too. This is a huge threat to your creative freedom and future projects.',
      hiddenRisk:
        'No exception is carved out for personal projects unrelated to the company\'s business. This could extend to creative work, music, art, or startups you might want to launch independently.',
      possibleWorstCase:
        'You build a successful mobile app in your spare time. The company claims it owns the IP and demands you transfer all rights or face legal action.',
      isOneSided: true,
      isAmbiguous: false,
      negotiationSuggestion:
        'Add an exception for projects unrelated to company business, done on personal time with personal equipment, that you disclose to the company.',
      betterClauseSuggestion:
        'The company shall own intellectual property created by the employee in the course of employment duties. Projects created outside working hours, using personal equipment, and unrelated to the company\'s current or reasonably anticipated business, shall remain the employee\'s property upon written disclosure.',
      questionsToAsk: [
        'Does this include personal projects I started before joining?',
        'What if I create something unrelated to the company\'s business?',
        'Can I get a list of excluded categories for personal projects?',
        'What "outside working hours" means if I am on call or work remotely?',
      ],
    },
    {
      clauseTitle: 'Arbitration Clause',
      clauseText: 'Any dispute shall be resolved only through arbitration chosen by the company.',
      category: 'Arbitration',
      severity: 'High',
      riskScore: 78,
      riskDimensions: {
        financial: 50,
        privacy: 10,
        employment: 65,
        ipOwnership: 20,
        legalExposure: 85,
        termination: 40,
        ambiguity: 45,
      },
      plainExplanation:
        'If any disagreement arises — salary disputes, wrongful termination, unpaid dues — you cannot go to court. You must go through arbitration, and the company gets to choose who the arbitrator is. This is like letting the opposing team pick the referee.',
      simpleExplanation:
        'If any problem arises — unpaid salary, wrongful termination, any issue — you cannot go to court. You must go through arbitration, and the company chooses the arbitrator. It is like letting the opposing team pick the referee — completely unfair.',
      hiddenRisk:
        'Arbitration is typically confidential and costly. You may not be able to afford it, effectively denying you justice. Company-chosen arbitrators are statistically more likely to favor the company.',
      possibleWorstCase:
        'You are wrongfully terminated. You cannot sue in court. The arbitrator chosen by the company rules in their favor. You have little recourse and cannot create public precedent.',
      isOneSided: true,
      isAmbiguous: false,
      negotiationSuggestion:
        'Demand that arbitrators be selected from a neutral panel like ICADR (Indian Council of Arbitration) or ICA, or through mutual agreement.',
      betterClauseSuggestion:
        'Any dispute shall be resolved through arbitration before a sole arbitrator jointly appointed by both parties, or if they cannot agree, appointed by the Indian Council of Arbitration, in accordance with the Arbitration and Conciliation Act, 1996.',
      questionsToAsk: [
        'Who specifically will choose the arbitrator?',
        'What organization or panel will the arbitrator come from?',
        'Who bears the cost of arbitration?',
        'Can I still approach a labour tribunal for employment-specific matters?',
      ],
    },
    {
      clauseTitle: 'Termination Without Notice',
      clauseText: 'The company reserves the right to terminate this agreement without cause with immediate effect, forfeiting all pending dues.',
      category: 'Termination',
      severity: 'Critical',
      riskScore: 88,
      riskDimensions: {
        financial: 90,
        privacy: 5,
        employment: 88,
        ipOwnership: 10,
        legalExposure: 75,
        termination: 98,
        ambiguity: 30,
      },
      plainExplanation:
        'The company can fire you instantly, at any time, for any reason — and you lose all pending salary, bonuses, and dues. This removes your most basic job security.',
      simpleExplanation:
        'The company can fire you at any time, for any reason, with immediate effect — and your pending salary, bonus, everything gets forfeited. Essentially, you could show up tomorrow and be sent home with nothing.',
      hiddenRisk:
        'Forfeiture of pending dues may include unpaid salary, performance bonuses, expense reimbursements, or provident fund contributions — potentially significant financial loss.',
      possibleWorstCase:
        'After a successful project, you are terminated immediately. You lose the month\'s salary, your Q4 bonus, and unreimbursed expenses totaling several lakhs.',
      isOneSided: true,
      isAmbiguous: false,
      negotiationSuggestion:
        'Require a minimum 30-day notice period or pay in lieu, and guarantee all accrued dues regardless of termination circumstance.',
      betterClauseSuggestion:
        'Either party may terminate this agreement with 30 days\' written notice. Termination without cause by the employer shall entitle the employee to all accrued and pending compensation, bonuses, and reimbursements up to the termination date.',
      questionsToAsk: [
        'Does "forfeiting pending dues" include statutory benefits like PF and gratuity?',
        'What constitutes "cause" for termination?',
        'Is there a Performance Improvement Plan (PIP) process before termination?',
        'Will I receive a proper relieving letter regardless of circumstances?',
      ],
    },
    {
      clauseTitle: 'Confidentiality — 5 Years',
      clauseText: 'The employee shall not disclose any company information to any third party for a period of 5 years after employment.',
      category: 'Confidentiality',
      severity: 'Medium',
      riskScore: 55,
      riskDimensions: {
        financial: 40,
        privacy: 30,
        employment: 60,
        ipOwnership: 45,
        legalExposure: 65,
        termination: 20,
        ambiguity: 70,
      },
      plainExplanation:
        'For 5 years after leaving the company, you cannot share "any company information" with anyone. The term "any company information" is dangerously vague — it could include things you casually know from working there.',
      simpleExplanation:
        'Even after leaving the job, you cannot share any company information with anyone for 5 years. "Any company information" is an extremely broad term — it could mean you cannot even share your work experience easily.',
      hiddenRisk:
        '"Any company information" is undefined. This could prevent you from listing projects on your resume, discussing your work in interviews, or publishing case studies — all normal professional activities.',
      possibleWorstCase:
        'You mention a project you worked on during a job interview. The company sends a legal notice claiming you violated confidentiality.',
      isOneSided: true,
      isAmbiguous: true,
      negotiationSuggestion:
        'Define "confidential information" specifically to exclude publicly known information, information disclosed to you by third parties, and information required for your professional development.',
      betterClauseSuggestion:
        '"Confidential Information" means non-public, proprietary business data specifically marked as confidential. It excludes information that becomes publicly available, that the employee knew before joining, or that relates to the employee\'s general professional skills and experience.',
      questionsToAsk: [
        'What specifically counts as "company information"?',
        'Can I mention my job title and projects worked on in my resume?',
        'Does this prevent me from discussing publicly available information?',
        'Is this clause limited to genuinely sensitive trade secrets?',
      ],
    },
  ],
  missingProtections: [
    'No severance pay clause in case of layoffs or termination without cause',
    'No minimum notice period for termination',
    'No Performance Improvement Plan (PIP) process before dismissal',
    'No provision for salary revision schedule or increment guarantee',
    'No clause protecting employee\'s pre-employment IP',
    'No clause ensuring PF, gratuity, and statutory benefits are paid on time',
    'No dispute resolution timeline or process',
    'No anti-retaliation clause protecting whistleblowers',
  ],
  obligationsAcceptedByUser: [
    'Not work for any competitor for 24 months after leaving',
    'Transfer all IP including work done at home and on personal time',
    'Resolve disputes only through company-chosen arbitration',
    'Maintain confidentiality of all company information for 5 years',
    'Allow monitoring of all communications on company devices',
    'Accept salary revisions decided unilaterally by management',
  ],
  rightsGivenAway: [
    'Right to work freely in your industry after leaving',
    'Right to own your personal creative work and side projects',
    'Right to approach courts for dispute resolution',
    'Right to receive pending dues upon termination',
    'Right to negotiate salary increases',
    'Right to privacy in communications',
  ],
  redFlags: [
    '24-month global non-compete with no geographic or sector limits',
    'IP ownership extends to work done "outside working hours"',
    'Company-chosen arbitrator — structural conflict of interest',
    'Immediate termination with forfeiture of all pending dues',
    'No defined notice period for either party',
    'Salary revision solely at management discretion',
    'Monitoring of all communications on company devices',
  ],
  greenFlags: [
    'Confidentiality clause has a defined time limit (5 years)',
  ],
  scenarioSimulations: [
    {
      scenario: 'You resign after 2 years to join a competing startup.',
      outcome: 'The company invokes the 24-month global non-compete clause. They send a legal notice to your new employer, who asks you not to join. You are stuck without income.',
      risk: 'Critical — Loss of employment, income, and career momentum for up to 24 months.',
      preventiveAction: 'Negotiate the non-compete before signing. If already signed, consult a lawyer — Indian courts often refuse to enforce overly broad non-competes as they violate public policy.',
    },
    {
      scenario: 'You build a personal mobile app on weekends that goes viral.',
      outcome: 'The company claims ownership under the "outside working hours" IP clause. They demand a transfer of all rights or threaten legal action.',
      risk: 'High — Potential loss of significant financial value and creative ownership.',
      preventiveAction: 'Get a written carve-out for personal projects before signing. Document all work on personal projects with timestamps showing it was done on personal time with personal equipment.',
    },
    {
      scenario: 'You are terminated suddenly one day before your annual bonus.',
      outcome: 'You lose the bonus, pending salary, and unreimbursed expenses due to the "forfeiture of pending dues" clause.',
      risk: 'High — Financial loss of several lakhs in a single day.',
      preventiveAction: 'Negotiate that all accrued dues including bonuses proportionate to time worked are paid regardless of termination circumstances.',
    },
  ],
  negotiationPlan: [
    {
      priority: 'Critical',
      ask: 'Reduce non-compete to 6 months, limit to direct competitors, restrict to India only',
      reason: 'A 24-month global non-compete is effectively unenforceable in India and is a significant career restriction.',
      suggestedWording:
        'The employee agrees not to join a direct competitor of the company within India for a period of 6 months after voluntary resignation, provided the company pays 50% of last drawn basic salary during this restricted period.',
    },
    {
      priority: 'Critical',
      ask: 'Add IP carve-out for personal projects done outside company business',
      reason: 'Owning all employee IP including personal projects is excessive and stifles innovation and personal growth.',
      suggestedWording:
        'Projects created outside working hours, on personal equipment, and unrelated to the company\'s current or planned business, shall remain the employee\'s property, subject to written disclosure to the company.',
    },
    {
      priority: 'High',
      ask: 'Change arbitrator selection to neutral body (ICADR/ICA)',
      reason: 'Company-chosen arbitrators create a structural conflict of interest.',
      suggestedWording:
        'The arbitrator shall be jointly appointed by both parties, or if they fail to agree, by the Indian Council of Arbitration.',
    },
    {
      priority: 'High',
      ask: 'Add 30-day notice period and guarantee accrued dues on termination',
      reason: 'Immediate termination with forfeiture of dues leaves the employee with no financial safety net.',
      suggestedWording:
        'Termination without cause shall require 30 days\' notice or pay in lieu. All accrued salary, bonuses, and reimbursements shall be paid within 7 working days of the last day of employment.',
    },
    {
      priority: 'Medium',
      ask: 'Define "confidential information" narrowly and specifically',
      reason: 'Vague confidentiality clauses can be weaponized to prevent normal professional activity.',
      suggestedWording:
        'Confidential Information means non-public information specifically marked as proprietary. It excludes general skills, publicly available information, and information required to be disclosed by law.',
    },
  ],
  questionsToAskBeforeSigning: [
    'What specifically is considered a "competing business" under this contract?',
    'Will I receive compensation during the non-compete period?',
    'Can I have the "outside working hours" IP clause removed or narrowed?',
    'Who exactly will choose the arbitrator in case of a dispute?',
    'What happens to my pending salary and bonus if I am terminated without cause?',
    'Is there a PIP process before termination?',
    'Can I retain rights to my personal projects clearly unrelated to company business?',
    'Does "any company information" prevent me from listing this job on my resume?',
    'Are my statutory benefits (PF, gratuity, ESI) guaranteed?',
    'What constitutes "monitoring" on company devices?',
  ],
  finalRecommendation:
    'DO NOT SIGN this contract as-is. It contains multiple Critical and High-severity clauses that severely disadvantage you. Specifically, the 24-month global non-compete, all-encompassing IP transfer, company-chosen arbitration, and immediate termination with forfeiture of dues are exploitative provisions. Negotiate these terms before signing, or consult a qualified employment lawyer. If the company refuses to negotiate any of these terms, consider whether this opportunity is worth the legal exposure.',
  disclaimer:
    'This is AI-generated legal awareness content, not legal advice. NyaySaathi does not replace a qualified legal professional. Please consult a lawyer before making any legal decisions.',
};

export const MOCK_RENTAL_ANALYSIS: AIAnalysisResult = {
  title: 'Rental Agreement Risk Analysis',
  contractType: 'Rental',
  perspective: 'Tenant',
  overallRiskScore: 76,
  riskLevel: 'High',
  executiveSummary:
    'This rental agreement gives the landlord sweeping powers to terminate without notice and forfeit the entire security deposit for minor issues. The tenant has almost no protections. Multiple clauses are one-sided and potentially illegal under the Model Tenancy Act.',
  plainEnglishSummary:
    'This rental agreement is heavily unfair to you as a tenant. The landlord can ask you to leave at any moment without any warning. Even a tiny scratch on a wall or a single day\'s delay in rent can cause you to lose your entire security deposit. You have very few rights under this agreement.',
  simpleSummary:
    'This rental agreement is very risky for you as a tenant. The landlord can evict you at any time without any notice. Even a small scratch or one day of late rent — and your entire security deposit is gone. This is completely unfair and may even violate India\'s Model Tenancy Act.',
  topRisks: [
    {
      title: 'Arbitrary Termination Without Notice',
      category: 'Termination',
      severity: 'Critical',
      score: 90,
      whyItMatters: 'You can be forced out of your home instantly with no time to find alternative accommodation.',
      realWorldImpact: 'You could be homeless with one day\'s notice, even if you have paid rent on time.',
      whatToDo: 'Negotiate a minimum 30-day notice period for termination without cause.',
    },
    {
      title: 'Security Deposit Forfeiture for Minor Issues',
      category: 'Penalty',
      severity: 'High',
      score: 82,
      whyItMatters: 'Your entire deposit — often 2-3 months rent — can be withheld for trivial damage or a single day\'s late rent.',
      realWorldImpact: 'Lose ₹50,000-₹1,50,000 or more for issues worth ₹500.',
      whatToDo: 'Define "minor damage" specifically and limit forfeiture to actual documented repair costs.',
    },
  ],
  clauseAnalyses: [
    {
      clauseTitle: 'Landlord Termination Without Notice',
      clauseText: 'The landlord may terminate this agreement at any time without prior notice.',
      category: 'Termination',
      severity: 'Critical',
      riskScore: 90,
      riskDimensions: {
        financial: 80,
        privacy: 20,
        employment: 10,
        ipOwnership: 0,
        legalExposure: 85,
        termination: 98,
        ambiguity: 30,
      },
      plainExplanation: 'The landlord can kick you out at literally any time with zero warning. You have no security of tenure.',
      simpleExplanation: 'The landlord can evict you tonight — without giving any notice. You have no protection whatsoever. This directly violates the guidelines of India\'s Model Tenancy Act 2021.',
      hiddenRisk: 'This is likely unenforceable under Indian law, but enforcing your rights requires legal action — expensive and stressful.',
      possibleWorstCase: 'Landlord sells the property or has a personal dispute with you. You receive a verbal eviction notice and must find new accommodation within 24 hours.',
      isOneSided: true,
      isAmbiguous: false,
      negotiationSuggestion: 'Insist on a minimum 30-day written notice period for any termination.',
      betterClauseSuggestion: 'Either party may terminate this agreement with 30 days\' written notice. In case of breach, a 15-day cure period shall be provided before termination.',
      questionsToAsk: [
        'Why is there no notice period for termination?',
        'What happens to my belongings if I am given immediate notice?',
        'Is this clause compliant with state tenancy laws?',
      ],
    },
    {
      clauseTitle: 'Security Deposit Forfeiture',
      clauseText: 'The tenant shall forfeit the entire security deposit for any minor damage or delay in rent.',
      category: 'Penalty',
      severity: 'High',
      riskScore: 82,
      riskDimensions: {
        financial: 95,
        privacy: 0,
        employment: 0,
        ipOwnership: 0,
        legalExposure: 70,
        termination: 50,
        ambiguity: 80,
      },
      plainExplanation: 'If you accidentally damage anything (even slightly) or pay rent even one day late, you lose your entire security deposit — potentially several months of rent.',
      simpleExplanation: 'A single paint scratch or one day of late rent — and your entire security deposit (which could be ₹50,000 or more) is gone. "Minor damage" is not even defined — the landlord can call anything minor.',
      hiddenRisk: '"Minor damage" is undefined, giving the landlord unlimited discretion to claim forfeiture.',
      possibleWorstCase: 'A screw hole in the wall from hanging a picture frame is declared "minor damage." Your ₹1,20,000 deposit is retained.',
      isOneSided: true,
      isAmbiguous: true,
      negotiationSuggestion: 'Define "damage" as damage beyond normal wear and tear. Limit forfeiture to actual documented repair costs.',
      betterClauseSuggestion: 'The security deposit shall be refunded within 30 days of vacating, minus documented costs for damage beyond normal wear and tear. Rent delay penalties shall not exceed 2% per month of overdue rent.',
      questionsToAsk: [
        'What specifically constitutes "minor damage"?',
        'What is the penalty for one day of late rent vs. one month?',
        'Will I receive an itemized deduction list before deposit is withheld?',
        'What counts as "normal wear and tear"?',
      ],
    },
  ],
  missingProtections: [
    'No minimum notice period for tenant',
    'No definition of normal wear and tear',
    'No dispute resolution mechanism',
    'No maintenance responsibilities assigned to landlord',
    'No lock-in period preventing landlord from evicting during lease',
    'No provision for security deposit refund timeline',
  ],
  obligationsAcceptedByUser: [
    'Pay rent on time or risk losing entire deposit',
    'Maintain property to landlord\'s undefined standards',
    'Vacate immediately upon landlord\'s request',
  ],
  rightsGivenAway: [
    'Right to reasonable notice before eviction',
    'Right to security deposit for documented damage only',
    'Right to security of tenure during lease period',
  ],
  redFlags: [
    'Landlord can terminate without any notice',
    'Entire deposit forfeited for any "minor" damage',
    'No definition of minor damage',
    'No lock-in period',
  ],
  greenFlags: [],
  scenarioSimulations: [
    {
      scenario: 'You pay rent 2 days late due to a bank holiday.',
      outcome: 'Landlord invokes deposit forfeiture clause. You lose ₹90,000 security deposit.',
      risk: 'High — Significant financial loss for a minor delay.',
      preventiveAction: 'Negotiate a grace period of 5-7 days for rent payment and cap late penalties at 2% per month.',
    },
  ],
  negotiationPlan: [
    {
      priority: 'Critical',
      ask: 'Add 30-day written notice requirement for termination',
      reason: 'No notice period is unfair and possibly illegal.',
      suggestedWording: 'Either party shall provide 30 days written notice before termination of this agreement.',
    },
    {
      priority: 'High',
      ask: 'Define damage and limit deposit forfeiture to documented costs',
      reason: 'Vague damage definition enables arbitrary deposit retention.',
      suggestedWording: 'Deposit deductions shall be limited to documented repair costs for damage beyond normal wear and tear, evidenced by receipts.',
    },
  ],
  questionsToAskBeforeSigning: [
    'What is the minimum notice period if you want me to vacate?',
    'What specifically will cause deposit forfeiture?',
    'Who is responsible for major repairs and maintenance?',
    'Is there a lock-in period during which you cannot evict me?',
    'How and when will the deposit be refunded?',
  ],
  finalRecommendation: 'This agreement needs significant revision before signing. The termination without notice and blanket deposit forfeiture clauses alone make this agreement unfair. Negotiate or consult a tenant rights organization before signing.',
  disclaimer: 'This is AI-generated legal awareness content, not legal advice. NyaySaathi does not replace a qualified legal professional. Please consult a lawyer before making any legal decisions.',
};

export function getMockAnalysis(contractType: string): AIAnalysisResult {
  if (contractType === 'Rental') return MOCK_RENTAL_ANALYSIS;
  return MOCK_EMPLOYMENT_ANALYSIS;
}
