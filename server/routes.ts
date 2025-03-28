import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { insertUserSchema, insertBookmarkSchema } from "@shared/schema";
import OpenAI from "openai";

// JWT secret key - in a real app, this would be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "dashmetrics_secret_key";

// OpenAI API key - must be provided through environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });
    req.body.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // === AUTH ROUTES ===
  
  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // In a real app, compare hashed passwords
      // const validPassword = await bcrypt.compare(password, user.password);
      const validPassword = true; // For demo purposes, always return true
      
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Return user data and token
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePic: user.profilePic
        },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password in a real app
      // userData.password = await bcrypt.hash(userData.password, 10);

      // Create user
      const newUser = await storage.createUser(userData);

      // Create JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Return user data and token
      res.status(201).json({
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          profilePic: newUser.profilePic
        },
        token
      });
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Google OAuth simulation (since we can't implement real OAuth flow in this environment)
  app.post("/api/auth/google", async (req, res) => {
    try {
      // In a real app, this would validate the token with Google
      // Here we just create or retrieve a user based on the provided email
      const { email, name, profilePic } = req.body;
      
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create user if doesn't exist
        user = await storage.createUser({
          username: email.split('@')[0],
          email,
          name,
          profilePic,
          password: "google-oauth-no-password",
          provider: "google"
        });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePic: user.profilePic
        },
        token
      });
    } catch (error) {
      console.error("Google OAuth error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GitHub OAuth simulation
  app.post("/api/auth/github", async (req, res) => {
    try {
      // In a real app, this would validate the token with GitHub
      const { email, name, profilePic } = req.body;
      
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create user if doesn't exist
        user = await storage.createUser({
          username: email.split('@')[0],
          email,
          name,
          profilePic,
          password: "github-oauth-no-password",
          provider: "github"
        });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePic: user.profilePic
        },
        token
      });
    } catch (error) {
      console.error("GitHub OAuth error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === ANALYTICS ROUTES ===
  
  // Get dashboard analytics
  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      
      // Get all analytics for this user
      const analyticsData = await storage.getAnalyticsByUserId(userId);
      
      // Get latest metrics
      const latestFollowers = analyticsData
        .filter(a => a.metric === "followers")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .reduce((acc, curr) => {
          if (!acc[curr.platformId]) {
            acc[curr.platformId] = curr;
          }
          return acc;
        }, {} as Record<number, any>);
      
      // Calculate total followers
      const totalFollowers = Object.values(latestFollowers).reduce(
        (sum, item) => sum + item.value, 
        0
      );
      
      // Get other latest metrics
      const latestEngagement = analyticsData
        .find(a => a.metric === "engagement");
      
      const latestReach = analyticsData
        .find(a => a.metric === "reach");
      
      const latestResponseTime = analyticsData
        .find(a => a.metric === "responseTime");
      
      res.json({
        stats: {
          followers: totalFollowers,
          engagement: latestEngagement?.value || 0,
          reach: latestReach?.value || 0,
          responseTime: latestResponseTime?.value || 0
        }
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get follower growth data for charts
  app.get("/api/dashboard/follower-growth", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      
      // Get all follower analytics for this user
      const analyticsData = await storage.getAnalyticsByUserId(userId);
      const followerData = analyticsData.filter(a => a.metric === "followers");
      
      // Get platforms
      const platforms = await storage.getPlatformsByUserId(userId);
      
      // Group data by date and platform
      const groupedData = followerData.reduce((acc, curr) => {
        const dateStr = new Date(curr.date).toISOString().split('T')[0];
        
        if (!acc[dateStr]) {
          acc[dateStr] = { date: dateStr };
        }
        
        // Find platform
        const platform = platforms.find(p => p.id === curr.platformId);
        if (platform) {
          acc[dateStr][platform.platformType] = curr.value;
        }
        
        return acc;
      }, {} as Record<string, any>);
      
      // Convert to array and sort by date
      const result = Object.values(groupedData).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      res.json({ data: result });
    } catch (error) {
      console.error("Get follower growth error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get engagement by platform data
  app.get("/api/dashboard/platform-engagement", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      
      // Get platforms for this user
      const platforms = await storage.getPlatformsByUserId(userId);
      
      // For demo purposes, generate engagement data
      const engagementData = platforms.map(platform => {
        let engagement, likes, comments, shares;
        
        // Assign realistic engagement values based on platform
        switch (platform.platformType) {
          case "instagram":
            engagement = 70;
            likes = 80;
            comments = 65;
            shares = 40;
            break;
          case "twitter":
            engagement = 85;
            likes = 65;
            comments = 70;
            shares = 90;
            break;
          case "linkedin":
            engagement = 55;
            likes = 60;
            comments = 45;
            shares = 50;
            break;
          case "youtube":
            engagement = 40;
            likes = 45;
            comments = 60;
            shares = 30;
            break;
          case "facebook":
            engagement = 62;
            likes = 65;
            comments = 70;
            shares = 50;
            break;
          default:
            engagement = 50;
            likes = 50;
            comments = 50;
            shares = 50;
        }
        
        return {
          platform: platform.platformType,
          engagement,
          likes,
          comments,
          shares
        };
      });
      
      res.json({ data: engagementData });
    } catch (error) {
      console.error("Get platform engagement error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recent activities
  app.get("/api/dashboard/recent-activities", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      
      // For demo purposes, generate recent activities
      const recentActivities = [
        {
          id: 1,
          type: "like",
          platform: "instagram",
          message: "Your Instagram post received 257 likes",
          time: "2 hours ago"
        },
        {
          id: 2,
          type: "comment",
          platform: "twitter",
          message: "@markjohnson commented on your Twitter post",
          time: "5 hours ago"
        },
        {
          id: 3,
          type: "mention",
          platform: "linkedin",
          message: "You were mentioned in 5 new LinkedIn posts",
          time: "Yesterday"
        },
        {
          id: 4,
          type: "scheduled",
          platform: "twitter",
          message: "Your scheduled post for Twitter is ready to be published",
          time: "2 days ago"
        }
      ];
      
      res.json({ activities: recentActivities });
    } catch (error) {
      console.error("Get recent activities error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get top performing content
  app.get("/api/dashboard/top-content", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      
      // For demo purposes, generate top content data
      const topContent = [
        {
          id: 1,
          rank: 1,
          platform: "instagram",
          type: "image",
          title: "Summer collection photoshoot behind the scenes",
          growth: 32.4,
          engagement: 4200,
          score: 85
        },
        {
          id: 2,
          rank: 2,
          platform: "youtube",
          type: "video",
          title: "10 Tips for Better Social Media Engagement",
          growth: 28.7,
          engagement: 12900,
          score: 72
        },
        {
          id: 3,
          rank: 3,
          platform: "linkedin",
          type: "article",
          title: "The Future of Remote Work in Tech Industry",
          growth: -4.2,
          engagement: 847,
          score: 68
        },
        {
          id: 4,
          rank: 4,
          platform: "twitter",
          type: "thread",
          title: "Breaking down our latest product updates",
          growth: 18.9,
          engagement: 2300,
          score: 60
        }
      ];
      
      res.json({ content: topContent });
    } catch (error) {
      console.error("Get top content error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === PLATFORM ROUTES ===
  
  // Get connected platforms
  app.get("/api/platforms", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const platforms = await storage.getPlatformsByUserId(userId);
      res.json({ platforms });
    } catch (error) {
      console.error("Get platforms error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add platform
  app.post("/api/platforms", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const { platformType, handle } = req.body;
      
      if (!platformType || !handle) {
        return res.status(400).json({ message: "Platform type and handle are required" });
      }
      
      const newPlatform = await storage.createPlatform({
        userId,
        platformType,
        handle,
        isActive: true
      });
      
      res.status(201).json({ platform: newPlatform });
    } catch (error) {
      console.error("Add platform error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update platform
  app.patch("/api/platforms/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const platformId = parseInt(req.params.id);
      
      // Check if platform exists and belongs to user
      const platform = await storage.getPlatform(platformId);
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      
      if (platform.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized: Platform belongs to another user" });
      }
      
      // Update platform
      const updatedPlatform = await storage.updatePlatform(platformId, req.body);
      
      res.json({ platform: updatedPlatform });
    } catch (error) {
      console.error("Update platform error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete platform
  app.delete("/api/platforms/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const platformId = parseInt(req.params.id);
      
      // Check if platform exists and belongs to user
      const platform = await storage.getPlatform(platformId);
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      
      if (platform.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized: Platform belongs to another user" });
      }
      
      // Delete platform
      await storage.deletePlatform(platformId);
      
      res.status(204).send();
    } catch (error) {
      console.error("Delete platform error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === BOOKMARK ROUTES ===
  
  // Get bookmarks
  app.get("/api/bookmarks", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const bookmarks = await storage.getBookmarksByUserId(userId);
      res.json({ bookmarks });
    } catch (error) {
      console.error("Get bookmarks error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add bookmark
  app.post("/api/bookmarks", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      
      // Validate bookmark data
      const bookmarkData = insertBookmarkSchema.parse({
        ...req.body,
        userId
      });
      
      // Create bookmark
      const newBookmark = await storage.createBookmark(bookmarkData);
      
      res.status(201).json({ bookmark: newBookmark });
    } catch (error) {
      console.error("Add bookmark error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid bookmark data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update bookmark
  app.patch("/api/bookmarks/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const bookmarkId = parseInt(req.params.id);
      
      // Check if bookmark exists and belongs to user
      const bookmark = await storage.getBookmark(bookmarkId);
      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      if (bookmark.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized: Bookmark belongs to another user" });
      }
      
      // Update bookmark
      const updatedBookmark = await storage.updateBookmark(bookmarkId, req.body);
      
      res.json({ bookmark: updatedBookmark });
    } catch (error) {
      console.error("Update bookmark error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete bookmark
  app.delete("/api/bookmarks/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.body.user.id;
      const bookmarkId = parseInt(req.params.id);
      
      // Check if bookmark exists and belongs to user
      const bookmark = await storage.getBookmark(bookmarkId);
      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      if (bookmark.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized: Bookmark belongs to another user" });
      }
      
      // Delete bookmark
      await storage.deleteBookmark(bookmarkId);
      
      res.status(204).send();
    } catch (error) {
      console.error("Delete bookmark error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === AI TAG SUGGESTIONS ===
  
  // Get AI-powered tag suggestions
  app.post("/api/ai/tag-suggestions", authenticateToken, async (req, res) => {
    try {
      const { title, url, platformType, content } = req.body;
      
      if (!OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "AI tag suggestion service unavailable", 
          suggestions: ["social", "media", "content"] // Fallback tags
        });
      }
      
      if (!title && !url && !content) {
        return res.status(400).json({ 
          message: "Content information is required to generate tags",
          suggestions: []
        });
      }
      
      // Build prompt based on available content
      let prompt = "Generate 5-7 relevant hashtags or content tags for the following";
      
      if (platformType) {
        prompt += ` ${platformType} post`;
      } else {
        prompt += " social media post";
      }
      
      if (title) {
        prompt += `\nTitle: "${title}"`;
      }
      
      if (url) {
        prompt += `\nURL: ${url}`;
      }
      
      if (content) {
        prompt += `\nContent: "${content}"`;
      }
      
      prompt += "\n\nReturn only a JSON array of lowercase tags without # symbol. Example: [\"marketing\", \"socialmedia\", \"analytics\"]";
      
      try {
        // Call OpenAI API
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a social media expert that provides relevant hashtags and content tags."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        });
        
        const tagSuggestions = response.choices[0]?.message?.content || "";
        
        // Parse the JSON response, filter out any non-alphanumeric characters
        let suggestions = [];
        try {
          suggestions = JSON.parse(tagSuggestions);
          // Make sure all suggestions are strings and remove any special characters
          suggestions = (suggestions as any[])
            .filter((tag: any) => typeof tag === "string")
            .map((tag: string) => tag.replace(/[^a-z0-9]/gi, "").toLowerCase())
            .filter((tag: string) => tag.length > 0);
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          // Extract tags from unformatted text as a backup
          suggestions = tagSuggestions
            .replace(/[\[\]"{}]/g, "")
            .split(",")
            .map((tag: string) => tag.trim().replace(/[^a-z0-9]/gi, "").toLowerCase())
            .filter((tag: string) => tag.length > 0);
        }
        
        // Ensure we have at least some suggestions
        if (suggestions.length === 0) {
          suggestions = ["content", "social", "media", platformType].filter(Boolean);
        }
        
        res.json({ suggestions });
      } catch (aiError) {
        console.error("OpenAI API error:", aiError);
        // Provide fallback tags based on platform type
        const fallbackTags = ["content", "social", "media"];
        if (platformType) {
          fallbackTags.push(platformType);
        }
        if (title) {
          fallbackTags.push("post");
        }
        
        res.json({ 
          message: "Error generating AI tags", 
          suggestions: fallbackTags
        });
      }
    } catch (error) {
      console.error("Tag suggestion error:", error);
      res.status(500).json({ 
        message: "Internal server error",
        suggestions: ["social", "media", "content"]
      });
    }
  });

  return httpServer;
}
