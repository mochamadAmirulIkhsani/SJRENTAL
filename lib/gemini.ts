import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY environment variable is not set. AI parsing will be disabled.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export const geminiModel = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface ParsedFinancialData {
  type: "income" | "expense" | "asset";
  description: string;
  amount: number;
  category: string;
  date: string;
  source?: string;
  vendor?: string;
  motorcycleId?: string;
  location?: string;
  condition?: string;
}

export async function parseFinancialInput(userInput: string): Promise<ParsedFinancialData | null> {
  console.log("Parsing input:", userInput);
  console.log("API Key present:", !!GEMINI_API_KEY);
  console.log("Gemini model available:", !!geminiModel);

  // If Gemini is not available, return null to trigger fallback
  if (!geminiModel) {
    console.log("Gemini model not available, using fallback parsing");
    return null;
  }

  const prompt = `
You are a financial assistant for a motorcycle rental business. Parse the following user input and extract financial information.

User input: "${userInput}"

Extract and return ONLY a JSON object with the following structure:
{
  "type": "income" | "expense" | "asset",
  "description": "detailed description",
  "amount": number (without currency symbols),
  "category": "appropriate category",
  "date": "YYYY-MM-DD" (today if not specified),
  "source": "source of income (only for income)",
  "vendor": "vendor/supplier name (only for expenses)",
  "motorcycleId": "motorcycle identifier if mentioned",
  "location": "location if mentioned for assets",
  "condition": "condition if mentioned for assets"
}

Categories for income: RENTAL_PAYMENT, DEPOSIT, LATE_FEE, DAMAGE_FEE, OTHER
Categories for expenses: FUEL, MAINTENANCE, INSURANCE, REGISTRATION, REPAIR, SPARE_PARTS, CLEANING, MARKETING, OFFICE, OTHER
Categories for assets: MOTORCYCLE, EQUIPMENT, TOOLS, FURNITURE, ELECTRONICS, PROPERTY, OTHER

For the input "Bought a new toolkit for Rp 150000", the response should be:
{
  "type": "asset",
  "description": "New toolkit",
  "amount": 150,
  "category": "TOOLS",
  "date": "2025-10-04",
  "condition": "NEW"
}

If you cannot extract meaningful financial data, return null.
Return ONLY the JSON object, no other text.
`;

  try {
    console.log("Calling Gemini API...");
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    console.log("Gemini response:", text);

    // Remove any markdown formatting
    const cleanText = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanText);
      console.log("Parsed result:", parsed);

      // Validate the parsed result
      if (!parsed || typeof parsed !== "object") {
        console.log("Invalid parsed result: not an object");
        return null;
      }

      if (!["income", "expense", "asset"].includes(parsed.type)) {
        console.log("Invalid type:", parsed.type);
        return null;
      }

      if (!parsed.description || !parsed.amount || !parsed.category) {
        console.log("Missing required fields:", { description: parsed.description, amount: parsed.amount, category: parsed.category });
        return null;
      }

      return parsed;
    } catch (parseError) {
      console.error("Failed to parse JSON response:", cleanText, parseError);
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}

export async function generateBusinessInsight(data: { totalIncome: number; totalExpenses: number; activeRentals: number; totalMotorcycles: number; recentTransactions: any[] }): Promise<string> {
  if (!geminiModel) {
    return "AI insights are currently unavailable. Please check your API configuration.";
  }

  const prompt = `
You are a business analyst for a motorcycle rental company. Based on the following data, provide actionable business insights:

Financial Data:
- Total Income: Rp ${data.totalIncome.toLocaleString()}
- Total Expenses: Rp ${data.totalExpenses.toLocaleString()}
- Net Profit: Rp ${(data.totalIncome - data.totalExpenses).toLocaleString()}
- Active Rentals: ${data.activeRentals}
- Total Motorcycles: ${data.totalMotorcycles}

Recent Transactions: ${JSON.stringify(data.recentTransactions.slice(0, 5))}

Provide insights about:
1. Financial performance
2. Operational efficiency
3. Growth opportunities
4. Cost optimization recommendations
5. Risk factors

Keep the response concise and actionable (max 200 words).
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating business insight:", error);
    return "Unable to generate insights at this time. Please try again later.";
  }
}
