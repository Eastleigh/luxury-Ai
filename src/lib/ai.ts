export type AIType = "travel" | "analyzer" | "optimizer" | "content";

export interface AIRequest {
  type: AIType;
  prompt: string;
  context?: string;
}

export interface AIResponse {
  result?: string;
  error?: string;
}

export async function askAI(request: AIRequest): Promise<AIResponse> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to get AI response" };
    }

    return { result: data.result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
