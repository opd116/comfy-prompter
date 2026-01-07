export type PromptType = "text" | "image" | "video";

export interface GeneratedImage {
  id: string;
  url: string;
  platform: "Midjourney" | "DALL·E" | "Stable Diffusion" | "Leonardo" | "Firefly";
  generatedAt: string;
  aspectRatio?: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  type: PromptType;
  favorite?: boolean;
  previewImage?: string;
  previewVideo?: string;
  generatedImages?: GeneratedImage[];
}

export interface TagData {
  name: string;
  image?: string;
}

export const categories = [
  "All",
  "Writing",
  "Coding",
  "Creative",
  "Business",
  "Learning",
] as const;

export const allTags: TagData[] = [
  { name: "GPT", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop" },
  { name: "Claude", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop" },
  { name: "Copilot", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop" },
  { name: "Email", image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=100&h=100&fit=crop" },
  { name: "Blog", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&h=100&fit=crop" },
  { name: "Code", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop" },
  { name: "Debug", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=100&h=100&fit=crop" },
  { name: "Story", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&h=100&fit=crop" },
  { name: "Art", image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=100&h=100&fit=crop" },
  { name: "Marketing", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=100&h=100&fit=crop" },
  { name: "Analysis", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop" },
  { name: "Summary", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop" },
  { name: "Translation", image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=100&h=100&fit=crop" },
  { name: "Brainstorm", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop" },
  { name: "Portrait", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "Landscape", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop" },
  { name: "Cinematic", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&h=100&fit=crop" },
  { name: "Animation", image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=100&h=100&fit=crop" },
];

export const samplePrompts: Prompt[] = [
  // Text Prompts
  {
    id: "1",
    title: "Code Reviewer",
    content: "Review this code for bugs, performance issues, and best practices. Suggest improvements with explanations:\n\n[paste code here]",
    tags: ["Code", "Debug", "Claude"],
    category: "Coding",
    type: "text",
    favorite: true,
  },
  {
    id: "2",
    title: "Blog Post Writer",
    content: "Write a comprehensive blog post about [topic]. Include an engaging introduction, 3-5 main sections with subheadings, practical examples, and a compelling conclusion with a call to action.",
    tags: ["Blog", "GPT", "Marketing"],
    category: "Writing",
    type: "text",
  },
  {
    id: "3",
    title: "Email Composer",
    content: "Compose a professional email to [recipient] regarding [subject]. Keep it concise, polite, and action-oriented. Include a clear subject line suggestion.",
    tags: ["Email", "GPT"],
    category: "Business",
    type: "text",
    favorite: true,
  },
  {
    id: "4",
    title: "Story Generator",
    content: "Create a short story in the [genre] genre. Include vivid descriptions, compelling characters, and an unexpected twist. Target length: 500-800 words.",
    tags: ["Story", "Claude"],
    category: "Creative",
    type: "text",
  },
  {
    id: "5",
    title: "Debug Assistant",
    content: "I'm getting this error: [error message]\n\nIn this code: [code]\n\nExplain what's causing it and provide a fix with step-by-step reasoning.",
    tags: ["Debug", "Code", "Copilot"],
    category: "Coding",
    type: "text",
  },
  {
    id: "6",
    title: "Text Summarizer",
    content: "Summarize the following text in [number] bullet points, capturing the key insights and actionable takeaways:\n\n[paste text]",
    tags: ["Summary", "Analysis", "GPT"],
    category: "Learning",
    type: "text",
  },
  // Image Prompts
  {
    id: "7",
    title: "Cinematic Portrait",
    content: "Create a cinematic portrait photograph of [subject], dramatic lighting from the side, shallow depth of field, film grain, professional photography, 85mm lens, bokeh background",
    tags: ["Portrait", "Cinematic", "Art"],
    category: "Creative",
    type: "image",
    previewImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop",
    generatedImages: [
      {
        id: "gi1",
        url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop",
        platform: "Midjourney",
        generatedAt: "2024-01-15",
        aspectRatio: "4:3"
      },
      {
        id: "gi2",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop",
        platform: "DALL·E",
        generatedAt: "2024-01-14",
        aspectRatio: "4:3"
      },
      {
        id: "gi3",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
        platform: "Stable Diffusion",
        generatedAt: "2024-01-12",
        aspectRatio: "4:3"
      }
    ]
  },
  {
    id: "8",
    title: "Fantasy Landscape",
    content: "A breathtaking fantasy landscape with floating islands, waterfalls cascading into clouds, magical aurora in the sky, ultra detailed, 8k resolution, concept art style",
    tags: ["Landscape", "Art"],
    category: "Creative",
    type: "image",
    previewImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
    generatedImages: [
      {
        id: "gi4",
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
        platform: "Midjourney",
        generatedAt: "2024-01-10",
        aspectRatio: "16:9"
      },
      {
        id: "gi5",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        platform: "Leonardo",
        generatedAt: "2024-01-08",
        aspectRatio: "16:9"
      }
    ]
  },
  {
    id: "9",
    title: "Product Photography",
    content: "Professional product photography of [product], clean white background, soft studio lighting, commercial quality, high resolution, perfect reflections",
    tags: ["Marketing", "Art"],
    category: "Business",
    type: "image",
    previewImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    generatedImages: [
      {
        id: "gi6",
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
        platform: "DALL·E",
        generatedAt: "2024-01-05",
        aspectRatio: "1:1"
      },
      {
        id: "gi7",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
        platform: "Firefly",
        generatedAt: "2024-01-03",
        aspectRatio: "1:1"
      }
    ]
  },
  {
    id: "10",
    title: "Abstract Art",
    content: "Abstract digital art with flowing gradients, geometric shapes, vibrant colors, modern design, suitable for wall art or desktop wallpaper",
    tags: ["Art", "Creative"],
    category: "Creative",
    type: "image",
    previewImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
  },
  // Video Prompts
  {
    id: "11",
    title: "Cinematic Intro",
    content: "Create a cinematic video intro with epic orchestral music, dramatic lighting, slow motion elements, professional color grading, suitable for YouTube or film",
    tags: ["Cinematic", "Animation"],
    category: "Creative",
    type: "video",
    previewImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop",
  },
  {
    id: "12",
    title: "Product Demo Video",
    content: "Professional product demonstration video showing [product] features, smooth camera movements, clean background, overlay text animations, modern style",
    tags: ["Marketing", "Animation"],
    category: "Business",
    type: "video",
    previewImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
  },
  {
    id: "13",
    title: "Nature Documentary",
    content: "Stunning nature documentary footage of [subject], slow motion, macro details, golden hour lighting, David Attenborough narration style",
    tags: ["Cinematic", "Landscape"],
    category: "Creative",
    type: "video",
    previewImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
  },
  {
    id: "14",
    title: "Social Media Reel",
    content: "Engaging short-form video for social media, quick cuts, trending transitions, vertical format, attention-grabbing hook in first 2 seconds",
    tags: ["Marketing", "Animation"],
    category: "Business",
    type: "video",
    previewImage: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop",
  },
];
