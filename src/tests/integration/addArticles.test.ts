import request from "supertest";
import path from "path";
import app from "../../app"; // adjust based on your file structure
import { prisma } from "../../config/database/prisma";
import { randomUUID } from "crypto";

const testCategoryId = randomUUID();

describe("POST /api/add-article", () => {
  beforeAll(async () => {
    // Optional: Clean DB or seed category
    await prisma.articles.deleteMany();
    await prisma.category.upsert({
      where: { category_id: testCategoryId },
      update: {},
      create: {
        category_id: testCategoryId,
        name: "Test Category",
      },
    });
  });

  afterAll(async () => {
    await prisma.articles.deleteMany();
    await prisma.category.delete({ where: { category_id: testCategoryId } });
    await prisma.$disconnect();
  });

  it("should create an article with an image", async () => {
    const res = await request(app)
      .post("/api/add-article") // make sure this matches your route prefix
      .set("Cookie", ["token=fake-token-for-test"]) // depends on your authMiddleware
      .field("title", "Test Article")
      .field("content", "Test content here")
      .field("category_id", testCategoryId)
      .attach("image", path.join(__dirname, "../fixtures/image_test_article.jpeg"));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("title", "Test Article");
    expect(res.body.data).toHaveProperty("image_url");
  });

  it("should fail without an image", async () => {
    const res = await request(app)
      .post("/api/add-article")
      .set("Cookie", ["token=fake-token-for-test"])
      .field("title", "Test Article")
      .field("content", "Test content here")
      .field("category_id", testCategoryId);

    expect(res.status).toBe(500); // or 400 if handled as bad request
    expect(res.body.success).toBe(false);
  });
});
