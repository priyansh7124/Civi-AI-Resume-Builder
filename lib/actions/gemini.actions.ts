"use server";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  // responseMimeType: "text/plain",
  responseMimeType: "application/json",
};

async function askGemini(prompt: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your .env.local file.");
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    if (!result.response) {
      throw new Error("No response received from Gemini API");
    }

    const text = result.response.text();
    
    if (!text) {
      throw new Error("Empty response received from Gemini API");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Handle specific error types
    if (error.message?.includes("API_KEY")) {
      throw new Error("Invalid or missing Gemini API key. Please check your .env.local file.");
    }
    
    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      throw new Error("API quota exceeded or rate limit reached. Please try again later.");
    }
    
    if (error.message?.includes("safety")) {
      throw new Error("Content was blocked by safety filters. Please try a different prompt.");
    }
    
    throw new Error(error.message || "Failed to generate response from Gemini API. Please try again.");
  }
}

export async function generateSummary(jobTitle: string) {
  try {
    const prompt =
      jobTitle && jobTitle !== ""
        ? `Given the job title '${jobTitle}', provide a summary for three experience levels: Senior, Mid Level, and Fresher. Each summary should be 4-5 lines long and include the experience level and the corresponding summary in JSON format. The output should be an array of objects, each containing 'experience_level' and 'summary' fields. Ensure the summaries are tailored to each experience level.`
        : `Create a 3-4 line summary about myself for my resume, emphasizing my personality, social skills, and interests outside of work. The output should be an array of JSON objects and in humanize way, each containing 'experience_level' and 'summary' fields representing Active, Average, and Lazy personality traits. Use example hobbies if needed but do not insert placeholders for me to fill in.`;

    const result = await askGemini(prompt);

    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", result);
      throw new Error("Failed to parse AI response. The response may not be in valid JSON format.");
    }
  } catch (error: any) {
    console.error("generateSummary Error:", error);
    throw error;
  }
}

export async function generateEducationDescription(educationInfo: string) {
  try {
    const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be 4-5 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results.`;

    const result = await askGemini(prompt);

    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", result);
      throw new Error("Failed to parse AI response. The response may not be in valid JSON format.");
    }
  } catch (error: any) {
    console.error("generateEducationDescription Error:", error);
    throw error;
  }
}

export async function generateExperienceDescription(experienceInfo: string) {
  try {
    const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list must be in  point 4-5: High Activity, Medium Activity, and Low Activity. Each summary should be 4-5 lines long and written from my perspective, reflecting on my past experiences in that workplace. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. You can include <b>, <i>, <u>, <s>, <blockquote>, <ul>, <ol>, and <li> to further enhance the descriptions. Use example work samples if needed, but do not insert placeholders for me to fill in.`;

    const result = await askGemini(prompt);

    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", result);
      throw new Error("Failed to parse AI response. The response may not be in valid JSON format.");
    }
  } catch (error: any) {
    console.error("generateExperienceDescription Error:", error);
    throw error;
  }
}
