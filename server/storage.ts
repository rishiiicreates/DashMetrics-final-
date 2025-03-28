import { 
  type User, 
  type InsertUser, 
  type Platform, 
  type InsertPlatform, 
  type Analytics, 
  type InsertAnalytics, 
  type Bookmark, 
  type InsertBookmark 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Platform methods
  getPlatformsByUserId(userId: number): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: number, platform: Partial<Platform>): Promise<Platform | undefined>;
  deletePlatform(id: number): Promise<boolean>;
  
  // Analytics methods
  getAnalyticsByUserId(userId: number): Promise<Analytics[]>;
  getAnalyticsByUserIdAndPlatform(userId: number, platformId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  
  // Bookmark methods
  getBookmarksByUserId(userId: number): Promise<Bookmark[]>;
  getBookmark(id: number): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  updateBookmark(id: number, bookmark: Partial<Bookmark>): Promise<Bookmark | undefined>;
  deleteBookmark(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private platforms: Map<number, Platform>;
  private analytics: Map<number, Analytics>;
  private bookmarks: Map<number, Bookmark>;
  private userId: number;
  private platformId: number;
  private analyticsId: number;
  private bookmarkId: number;

  constructor() {
    this.users = new Map();
    this.platforms = new Map();
    this.analytics = new Map();
    this.bookmarks = new Map();
    this.userId = 1;
    this.platformId = 1;
    this.analyticsId = 1;
    this.bookmarkId = 1;
    
    // Add demo data
    this.seedDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      profilePic: insertUser.profilePic || "" 
    };
    this.users.set(id, user);
    return user;
  }

  // Platform methods
  async getPlatformsByUserId(userId: number): Promise<Platform[]> {
    return Array.from(this.platforms.values()).filter(
      (platform) => platform.userId === userId
    );
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.platformId++;
    const platform: Platform = { 
      ...insertPlatform, 
      id,
      isActive: insertPlatform.isActive !== undefined ? insertPlatform.isActive : true 
    };
    this.platforms.set(id, platform);
    return platform;
  }

  async updatePlatform(id: number, platformUpdate: Partial<Platform>): Promise<Platform | undefined> {
    const platform = this.platforms.get(id);
    if (!platform) return undefined;

    const updatedPlatform = { ...platform, ...platformUpdate };
    this.platforms.set(id, updatedPlatform);
    return updatedPlatform;
  }

  async deletePlatform(id: number): Promise<boolean> {
    return this.platforms.delete(id);
  }

  // Analytics methods
  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(
      (analytics) => analytics.userId === userId
    );
  }

  async getAnalyticsByUserIdAndPlatform(userId: number, platformId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(
      (analytics) => analytics.userId === userId && analytics.platformId === platformId
    );
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsId++;
    const analytics: Analytics = { 
      ...insertAnalytics, 
      id,
      date: insertAnalytics.date || new Date()
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  // Bookmark methods
  async getBookmarksByUserId(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId
    );
  }

  async getBookmark(id: number): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.bookmarkId++;
    const bookmark: Bookmark = { 
      ...insertBookmark, 
      id,
      tags: insertBookmark.tags || []
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async updateBookmark(id: number, bookmarkUpdate: Partial<Bookmark>): Promise<Bookmark | undefined> {
    const bookmark = this.bookmarks.get(id);
    if (!bookmark) return undefined;

    const updatedBookmark = { ...bookmark, ...bookmarkUpdate };
    this.bookmarks.set(id, updatedBookmark);
    return updatedBookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Seed demo data
  private seedDemoData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: "hrishikesh",
      email: "rishiicreates@gmail.com",
      name: "Hrishikesh",
      profilePic: "https://pbs.twimg.com/media/Gm-iaOwbYAM16us.jpg",
      password: "$2a$10$demopasswordhash",
      provider: "password"
    };
    this.createUser(demoUser);

    // Create demo platforms
    const platforms = [
      { userId: 1, platformType: "instagram", handle: "rishiicreatess", isActive: true },
      { userId: 1, platformType: "twitter", handle: "rishiicreates", isActive: true },
      { userId: 1, platformType: "linkedin", handle: "rishii-creates-627a58301", isActive: true },
      { userId: 1, platformType: "youtube", handle: "rishiiicreates", isActive: true }
    ];

    platforms.forEach(platform => {
      this.createPlatform(platform);
    });

    // Create demo analytics data - historical data for charts
    // Follower counts for Instagram
    const datePoints = 30; // 30 days of data
    const now = new Date();
    const baseFollowers = 20000;
    
    for (let i = 0; i < datePoints; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (datePoints - i));
      
      // Instagram followers (platform 1)
      this.createAnalytics({
        userId: 1,
        platformId: 1,
        metric: "followers",
        value: baseFollowers + Math.floor(i * 150 * (1 + Math.random() * 0.3)),
        date
      });

      // Twitter followers (platform 2)
      this.createAnalytics({
        userId: 1,
        platformId: 2,
        metric: "followers",
        value: baseFollowers - 5000 + Math.floor(i * 100 * (1 + Math.random() * 0.4)),
        date
      });

      // LinkedIn followers (platform 3)
      this.createAnalytics({
        userId: 1,
        platformId: 3,
        metric: "followers",
        value: baseFollowers - 8000 + Math.floor(i * 80 * (1 + Math.random() * 0.2)),
        date
      });
    }

    // Latest analytics metrics
    this.createAnalytics({
      userId: 1, 
      platformId: 1, 
      metric: "engagement", 
      value: 52, // 5.2%
      date: new Date()
    });

    this.createAnalytics({
      userId: 1, 
      platformId: 1, 
      metric: "reach", 
      value: 83247,
      date: new Date()
    });

    this.createAnalytics({
      userId: 1, 
      platformId: 1, 
      metric: "responseTime", 
      value: 47, // 47 minutes
      date: new Date()
    });

    // Create demo bookmarks
    const bookmarks = [
      {
        userId: 1,
        title: "10 Tips for Better Social Media Engagement",
        url: "https://example.com/social-media-tips",
        platformType: "twitter",
        tags: ["engagement", "tips", "socialmedia"]
      },
      {
        userId: 1,
        title: "How to Use Analytics to Grow Your Following",
        url: "https://example.com/analytics-growth",
        platformType: "instagram",
        tags: ["analytics", "growth", "strategy"]
      },
      {
        userId: 1,
        title: "The Future of Social Media Marketing",
        url: "https://example.com/future-marketing",
        platformType: "linkedin",
        tags: ["future", "trends", "marketing"]
      }
    ];

    bookmarks.forEach(bookmark => {
      this.createBookmark(bookmark);
    });
  }
}

export const storage = new MemStorage();
