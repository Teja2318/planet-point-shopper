import { EcoScore } from '@/types/product';

const ECO_KEYWORDS = {
  high: ['recycled', 'organic'],
  medium: ['biodegradable', 'eco', 'bamboo', 'sustainable', 'natural'],
  low: ['plastic', 'disposable', 'non-recyclable']
};

export function calculateEcoScore(name: string, description: string): EcoScore {
  const text = `${name} ${description}`.toLowerCase();
  let score = 50;
  const foundKeywords: string[] = [];

  // Check for high-value keywords
  ECO_KEYWORDS.high.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 20;
      foundKeywords.push(keyword);
    }
  });

  // Check for medium-value keywords
  ECO_KEYWORDS.medium.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 15;
      foundKeywords.push(keyword);
    }
  });

  // Check for negative keywords
  ECO_KEYWORDS.low.forEach(keyword => {
    if (text.includes(keyword)) {
      score -= 20;
      foundKeywords.push(`-${keyword}`);
    }
  });

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  let level: 'high' | 'moderate' | 'low';
  let explanation = '';

  if (score >= 80) {
    level = 'high';
    explanation = `EcoScore: ${score} 🌿 — Highly eco-friendly! `;
  } else if (score >= 50) {
    level = 'moderate';
    explanation = `EcoScore: ${score} 💛 — Moderately eco-friendly. `;
  } else {
    level = 'low';
    explanation = `EcoScore: ${score} 🔴 — Not eco-friendly. `;
  }

  // Add keyword explanation
  const positiveKeywords = foundKeywords.filter(k => !k.startsWith('-'));
  const negativeKeywords = foundKeywords.filter(k => k.startsWith('-')).map(k => k.substring(1));

  if (positiveKeywords.length > 0) {
    explanation += `Contains: ${positiveKeywords.join(', ')}.`;
  }
  if (negativeKeywords.length > 0) {
    explanation += ` Concerns: ${negativeKeywords.join(', ')}.`;
  }

  return {
    score,
    level,
    explanation: explanation.trim(),
    keywords: foundKeywords
  };
}

export function getAIInsight(ecoScore: EcoScore): string {
  if (ecoScore.score >= 80) {
    return "AI Insight: Excellent eco-friendly choice with sustainable materials.";
  } else if (ecoScore.score >= 50) {
    return "AI Insight: Moderate sustainability. Consider eco-friendly alternatives.";
  } else {
    return "AI Insight: Low eco-friendliness. We recommend greener alternatives.";
  }
}
