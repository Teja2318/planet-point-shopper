import { EcoScore } from '@/types/product';

const ECO_KEYWORDS = {
  high: ['recycled', 'organic'],
  medium: ['biodegradable', 'eco', 'bamboo', 'sustainable', 'natural'],
  low: ['plastic', 'disposable', 'non-recyclable']
};

export function calculateEcoScore(name: string, description: string, productCarbonFootprint?: number, productRecyclability?: number): EcoScore {
  const text = `${name} ${description}`.toLowerCase();
  let score = 50;
  const foundKeywords: string[] = [];
  const dangerReasons: string[] = [];

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

  // Check for negative keywords and add danger reasons
  ECO_KEYWORDS.low.forEach(keyword => {
    if (text.includes(keyword)) {
      score -= 20;
      foundKeywords.push(`-${keyword}`);
      
      // Add specific danger reasons
      if (keyword === 'plastic') {
        dangerReasons.push('Contains plastic which takes 400+ years to decompose and releases microplastics into ecosystems');
      }
      if (keyword === 'disposable') {
        dangerReasons.push('Single-use disposable items contribute to landfill waste and ocean pollution');
      }
      if (keyword === 'non-recyclable') {
        dangerReasons.push('Non-recyclable materials cannot be reprocessed, ending up in landfills permanently');
      }
    }
  });

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Calculate recyclability rating
  let recyclabilityRating = productRecyclability || 50;
  if (text.includes('recycled') || text.includes('recyclable')) recyclabilityRating += 30;
  if (text.includes('biodegradable')) recyclabilityRating += 20;
  if (text.includes('plastic') && !text.includes('recyclable')) recyclabilityRating -= 30;
  if (text.includes('disposable')) recyclabilityRating -= 25;
  recyclabilityRating = Math.max(0, Math.min(100, recyclabilityRating));

  // Calculate carbon footprint (kg CO2)
  let carbonFootprint = productCarbonFootprint || 5.0; // default 5kg
  if (text.includes('recycled')) carbonFootprint *= 0.6;
  if (text.includes('organic')) carbonFootprint *= 0.7;
  if (text.includes('plastic')) carbonFootprint *= 1.5;
  if (text.includes('disposable')) carbonFootprint *= 1.3;
  carbonFootprint = Math.round(carbonFootprint * 10) / 10;

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
    if (dangerReasons.length === 0) {
      dangerReasons.push('Low sustainability score indicates significant environmental impact from production and disposal');
    }
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
    keywords: foundKeywords,
    dangerReasons: dangerReasons.length > 0 ? dangerReasons : undefined,
    recyclabilityRating,
    carbonFootprint
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
