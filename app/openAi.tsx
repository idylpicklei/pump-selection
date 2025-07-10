"use server";

import OpenAI from "openai";

interface Pump {
  name: string;
  efficencyRange: [number, number];
  value: number;
  imagePath: string;
}

const DecidePump = async (
  pump1: Pump,
  pump2: Pump,
  head: number,
  gpm: number
) => {
  try {
    // Use environment variable for API key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OpenAI API key not found in environment variables");
      return;
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log("--------------------------------");
    console.log(pump1, pump2, head, gpm);
    console.log("--------------------------------");
    const prompt = `
    You are a pump selection expert. Provide just the name of the pump you would recommend.
    You are given two pump charts and a head and gpm.
    Head: ${head}
    GPM: ${gpm}
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: pump1.imagePath,
              },
            },
            {
              type: "image_url",
              image_url: {
                url: pump2.imagePath,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });
    console.log("--------------------------------");
    console.log(response);
    console.log("--------------------------------");
    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return null;
  }
};

export default DecidePump;
