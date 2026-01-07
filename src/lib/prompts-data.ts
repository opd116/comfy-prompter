export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  favorite?: boolean;
}

export const categories = [
  "All",
  "Writing",
  "Coding",
  "Creative",
  "Business",
  "Learning",
] as const;

export const allTags = [
  "GPT",
  "Claude",
  "Copilot",
  "Email",
  "Blog",
  "Code",
  "Debug",
  "Story",
  "Art",
  "Marketing",
  "Analysis",
  "Summary",
  "Translation",
  "Brainstorm",
];

export const samplePrompts: Prompt[] = [
  {
    id: "1",
    title: "Code Reviewer",
    content: "Review this code for bugs, performance issues, and best practices. Suggest improvements with explanations:\n\n[paste code here]",
    tags: ["Code", "Debug", "Claude"],
    category: "Coding",
    favorite: true,
  },
  {
    id: "2",
    title: "Blog Post Writer",
    content: "Write a comprehensive blog post about [topic]. Include an engaging introduction, 3-5 main sections with subheadings, practical examples, and a compelling conclusion with a call to action.",
    tags: ["Blog", "GPT", "Marketing"],
    category: "Writing",
  },
  {
    id: "3",
    title: "Email Composer",
    content: "Compose a professional email to [recipient] regarding [subject]. Keep it concise, polite, and action-oriented. Include a clear subject line suggestion.",
    tags: ["Email", "GPT", "Business"],
    category: "Business",
    favorite: true,
  },
  {
    id: "4",
    title: "Story Generator",
    content: "Create a short story in the [genre] genre. Include vivid descriptions, compelling characters, and an unexpected twist. Target length: 500-800 words.",
    tags: ["Story", "Creative", "Claude"],
    category: "Creative",
  },
  {
    id: "5",
    title: "Debug Assistant",
    content: "I'm getting this error: [error message]\n\nIn this code: [code]\n\nExplain what's causing it and provide a fix with step-by-step reasoning.",
    tags: ["Debug", "Code", "Copilot"],
    category: "Coding",
  },
  {
    id: "6",
    title: "Text Summarizer",
    content: "Summarize the following text in [number] bullet points, capturing the key insights and actionable takeaways:\n\n[paste text]",
    tags: ["Summary", "Analysis", "GPT"],
    category: "Learning",
  },
  {
    id: "7",
    title: "Brainstorm Ideas",
    content: "Generate 10 creative ideas for [topic/problem]. For each idea, provide a brief description and potential benefits. Think outside the box!",
    tags: ["Brainstorm", "Creative", "Claude"],
    category: "Creative",
    favorite: true,
  },
  {
    id: "8",
    title: "Marketing Copy",
    content: "Write compelling marketing copy for [product/service]. Include a catchy headline, 3 key benefits, social proof suggestions, and a strong CTA.",
    tags: ["Marketing", "Business", "GPT"],
    category: "Business",
  },
  {
    id: "9",
    title: "Translation Helper",
    content: "Translate the following text from [source language] to [target language]. Maintain the original tone and context. Explain any cultural nuances:\n\n[text]",
    tags: ["Translation", "GPT"],
    category: "Writing",
  },
  {
    id: "10",
    title: "Art Prompt Creator",
    content: "Create a detailed image generation prompt for [concept]. Include style, mood, lighting, composition, and specific visual elements. Format for [AI tool].",
    tags: ["Art", "Creative", "Claude"],
    category: "Creative",
  },
];
