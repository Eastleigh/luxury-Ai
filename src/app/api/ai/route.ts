import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callDeepSeek(messages: Message[], maxTokens = 1024) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  travel: `You are LuxuryAI's Travel Concierge, an elite AI assistant for high-spending business owners ($20K-$500K/month). You help plan luxury travel using credit card points and miles.

When a user describes a trip, respond with:
1. A brief exciting intro about the destination
2. Recommended routing (airlines, classes)
3. Points required and which program to use
4. Transfer partners and current bonuses
5. Estimated taxes/fees
6. Hotel recommendations bookable with points
7. Total estimated value of the trip

Always maintain a premium, professional tone. Focus on business class and first class options. Reference specific airlines, programs, and point values. Format your response with clear sections using markdown.`,

  analyzer: `You are LuxuryAI's Spend Analyzer AI, helping high-spending business owners optimize their credit card rewards. You analyze spending patterns and identify missed rewards.

Given spending data, provide:
1. Key insights about spending patterns
2. Top optimization opportunities (which cards to use where)
3. Estimated annual rewards being missed
4. Specific actionable recommendations
5. Priority order for changes

Be specific with card names, multipliers, and dollar amounts. Format with markdown. Keep recommendations actionable and data-driven.`,

  optimizer: `You are LuxuryAI's Card Optimizer AI. You recommend the best credit card combinations for high-spending business owners based on their business type, spending categories, and travel goals.

Provide recommendations including:
1. Optimal card portfolio (3-5 cards)
2. Which card to use for each spending category
3. Signup bonus strategy and timing
4. Estimated annual rewards with the optimized setup
5. Annual fee analysis vs rewards earned

Reference real credit cards (Amex Business Platinum, Chase Ink Preferred, Capital One Venture X, etc.) with accurate reward rates. Format with markdown.`,

  content: `You are LuxuryAI's Content Engine AI. You generate premium marketing content for a luxury travel rewards platform targeting high-spending business owners.

Content types you can generate:
- Travel deal articles highlighting award flight opportunities
- Reward optimization strategy articles
- Client success stories
- Newsletter content
- LinkedIn posts for thought leadership

Always maintain a premium, authoritative tone. Focus on luxury travel, financial optimization, and business efficiency. Never use terms like "hacking", "cheap", or "budget". Use "optimization", "leverage", and "efficiency" instead. Format with markdown.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, prompt, context } = body;

    if (!type || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: type and prompt" },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[type];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: `Invalid type: ${type}. Valid types: ${Object.keys(SYSTEM_PROMPTS).join(", ")}` },
        { status: 400 }
      );
    }

    const messages: Message[] = [
      { role: "system", content: systemPrompt },
    ];

    if (context) {
      messages.push({
        role: "user",
        content: `Here is the current context:\n${context}`,
      });
    }

    messages.push({ role: "user", content: prompt });

    const result = await callDeepSeek(messages, type === "content" ? 2048 : 1024);

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("AI API error:", message);

    if (message.includes("DEEPSEEK_API_KEY is not configured")) {
      return NextResponse.json(
        { error: "AI is not configured. Please add your DeepSeek API key." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
