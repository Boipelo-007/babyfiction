import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const model = "gpt-4o";

export const getChatResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Messages array is required.",
      });
    }

    if (!token) {
      console.error("GITHUB_TOKEN is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Chatbot service is not configured properly.",
      });
    }

    // Initialize the AI client
    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    // System message to define the chatbot's behavior
    const systemMessage = {
      role: "system",
      content: `You are a helpful customer service assistant for Baby Fiction, an e-commerce store specializing in baby products and children's items. 
      
Your role is to:
- Help customers find products
- Answer questions about orders, shipping, and returns
- Provide product recommendations
- Assist with account-related queries
- Be friendly, professional, and concise

Store information:
- We offer baby clothing, toys, nursery furniture, and accessories
- Standard shipping takes 3-5 business days
- Free shipping on orders over R500
- 30-day return policy on most items
- Customer support available Monday-Friday, 9am-5pm SAST

Keep responses brief and helpful. If you don't know something specific, politely direct the customer to contact support at support@babyfiction.com or call +27 123 456 7890.`,
    };

    // Make the API call
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 500,
        model: model,
      },
    });

    if (isUnexpected(response)) {
      console.error("AI API Error:", response.body.error);
      throw new Error(response.body.error?.message || "Failed to get AI response");
    }

    const aiMessage = response.body.choices[0].message.content;

    res.json({
      success: true,
      message: aiMessage,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      success: false,
      message: "Sorry, I'm having trouble processing your request. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
