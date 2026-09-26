import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  test,
  expect,
  vi,
} from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryReplSet } from "mongodb-memory-server";

const providers = vi.hoisted(() => ({
  upload: vi.fn(async () => ({
    secure_url: "https://example.com/file",
    public_id: "synthetic/upload",
  })),
  destroy: vi.fn(async () => {}),
  mail: vi.fn(async () => {}),
}));
vi.mock("../src/utils/cloudinaryUpload.js", () => ({
  uploadToCloudinary: providers.upload,
  uploadPdfToCloudinary: providers.upload,
  deleteFromCloudinary: providers.destroy,
}));
vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail: providers.mail }) },
}));

let repl, app, models, cookie, admin, passwordHash, resumeService;
const secret = "synthetic-test-setup-secret-at-least-32-characters";
const projectData = {
  title: "Example project",
  shortDescription: "Example summary",
  description: "Example project content",
  technologies: ["React"],
  category: "web",
};
const blogData = {
  title: "Example article",
  excerpt: "Example excerpt",
  content: "Example article content long enough for validation.",
};
const resumeData = {
  title: "Resume",
  file: { url: "https://example.com/resume.pdf", publicId: "synthetic/resume" },
};
const contactData = {
  name: "Sample User",
  email: "sample@example.com",
  subject: "Example subject",
  message: "Example contact message",
};
const auth = (req) => req.set("Cookie", cookie);

beforeAll(async () => {
  for (const name of [
    "JWT_SECRET",
    "EMAIL_HOST",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "EMAIL_FROM",
    "CONTACT_EMAIL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ])
    vi.stubEnv(name, "synthetic-test-value");
  vi.stubEnv("FRONTEND_URL", "http://localhost:5173");
  vi.stubEnv("JWT_EXPIRES_IN", "1h");
  vi.stubEnv("EMAIL_PORT", "1025");
  vi.stubEnv("LOG_LEVEL", "silent");
  vi.stubEnv("ADMIN_SETUP_TOKEN", secret);
  repl = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
    binary: { version: "7.0.14" },
  });
  vi.stubEnv("MONGODB_URI", repl.getUri());
  await mongoose.connect(repl.getUri());
  app = (await import("../src/app.js")).default;
  models = Object.fromEntries(
    await Promise.all(
      [
        "Admin",
        "Project",
        "Blog",
        "Certificate",
        "Experience",
        "Skill",
        "Resume",
        "Contact",
        "SiteSettings",
        "ResumeWriteLock",
      ].map(async (name) => [
        name,
        (await import(`../src/models/${name}.js`)).default,
      ])
    )
  );
  await Promise.all(Object.values(models).map((model) => model.init()));
  passwordHash = await (
    await import("../src/utils/password.js")
  ).hashPassword("synthetic-password");
  resumeService = await import("../src/services/resumeService.js");
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  if (repl) await repl.stop();
  vi.unstubAllEnvs();
});
beforeEach(async () => {
  await Promise.all(Object.values(models).map((model) => model.deleteMany({})));
  vi.clearAllMocks();
  admin = await models.Admin.create({
    name: "Test Admin",
    email: "admin@example.com",
    password: passwordHash,
  });
  cookie =
    "accessToken=" +
    (await import("../src/utils/jwt.js")).generateAccessToken({
      id: admin.id,
      role: "admin",
    });
});

describe("authentication and request boundaries", () => {
  test("setup requires the secret and only one concurrent admin can be created", async () => {
    await models.Admin.deleteMany({});
    const data = {
      name: "New Admin",
      email: "new@example.com",
      password: "synthetic-password",
    };
    expect(
      (await request(app).post("/api/auth/create-admin").send(data)).status
    ).toBe(403);
    const results = await Promise.all(
      ["one", "two"].map((name) =>
        request(app)
          .post("/api/auth/create-admin")
          .set("x-admin-setup-token", secret)
          .send({ ...data, email: name + "@example.com" })
      )
    );
    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(await models.Admin.countDocuments()).toBe(1);
  });
  test("disabled and deleted admins cannot use an existing signed token", async () => {
    await models.Admin.updateOne({ _id: admin.id }, { isActive: false });
    expect((await auth(request(app).get("/api/projects/admin"))).status).toBe(
      403
    );
    await models.Admin.deleteMany({});
    expect((await auth(request(app).get("/api/projects/admin"))).status).toBe(
      401
    );
  });
  test("cross-origin writes are rejected and the configured frontend is allowed", async () => {
    expect(
      (
        await auth(request(app).post("/api/projects"))
          .set("Origin", "https://attacker.example")
          .send(projectData)
      ).status
    ).toBe(403);
    expect(
      (
        await request(app)
          .post("/api/auth/logout")
          .set("Sec-Fetch-Site", "cross-site")
      ).status
    ).toBe(403);
    expect(
      (
        await auth(request(app).post("/api/projects"))
          .set("Origin", "http://localhost:5173")
          .send(projectData)
      ).status
    ).toBe(201);
  });
  test("profile deletion uses req.admin and provider cleanup failure does not undo database update", async () => {
    await models.Admin.updateOne(
      { _id: admin.id },
      {
        image: {
          url: "https://example.com/a.png",
          publicId: "synthetic/profile",
        },
        resume: { url: "https://example.com/a.pdf", publicId: "synthetic/pdf" },
      }
    );
    providers.destroy.mockRejectedValueOnce(new Error("synthetic outage"));
    expect(
      (await auth(request(app).delete("/api/auth/profile/image"))).status
    ).toBe(200);
    expect(
      (await auth(request(app).delete("/api/auth/profile/resume"))).status
    ).toBe(200);
    const saved = await models.Admin.findById(admin.id);
    expect(saved.image.publicId).toBeNull();
    expect(saved.resume.publicId).toBeNull();
    expect(
      (await auth(request(app).patch("/api/auth/profile/image"))).status
    ).toBe(400);
  });
});

describe("content visibility and input validation", () => {
  test("public routes cannot expose drafts even with bypass query parameters", async () => {
    const project = await models.Project.create(projectData);
    await models.Blog.create(blogData);
    expect(
      (await request(app).get("/api/projects?published=false")).body.projects
    ).toHaveLength(0);
    expect(
      (await request(app).get("/api/projects/slug/" + project.slug)).status
    ).toBe(404);
    expect((await request(app).get("/api/projects/" + project.id)).status).toBe(
      401
    );
    expect(
      (await request(app).get("/api/blogs?published=false")).body.blogs
    ).toHaveLength(0);
    expect(
      (await auth(request(app).get("/api/projects/admin"))).body.projects
    ).toHaveLength(1);
    expect(
      (await auth(request(app).get("/api/blogs/admin"))).body.blogs
    ).toHaveLength(1);
    expect((await request(app).get("/api/blogs/admin")).status).toBe(401);
  });
  test("public certificates and skills exclude hidden entries", async () => {
    const certificate = await models.Certificate.create({
      title: "Hidden Certificate",
      issuer: "Example",
      issueDate: new Date(),
      isVisible: false,
    });
    await models.Skill.create({
      name: "Hidden Skill",
      category: "tools",
      proficiency: 50,
      isActive: false,
    });
    expect(
      (await request(app).get("/api/certificates?visible=false")).body
        .certificates
    ).toHaveLength(0);
    expect(
      (await request(app).get("/api/certificates/" + certificate.id)).status
    ).toBe(404);
    expect((await request(app).get("/api/skills")).body.skills).toHaveLength(0);
    expect(
      (await auth(request(app).get("/api/skills/admin"))).body.skills
    ).toHaveLength(1);
  });
  test("multipart project booleans and arrays parse correctly and storage fields are not writable", async () => {
    let req = auth(request(app).post("/api/projects"));
    for (const [k, v] of Object.entries({
      ...projectData,
      technologies: "React",
      published: "false",
      featured: "true",
      order: "2",
    }))
      req = req.field(k, v);
    const res = await req;
    expect(res.status).toBe(201);
    expect(res.body.project.published).toBe(false);
    expect(res.body.project.technologies).toEqual(["React"]);
    const patch = await auth(
      request(app).patch("/api/projects/" + res.body.project._id)
    ).send({ image: { publicId: "other-account/asset" }, published: true });
    expect(patch.status).toBe(200);
    expect(patch.body.project.image.publicId).toBeNull();
    expect(patch.body.project.published).toBe(true);
    expect(
      (
        await auth(request(app).post("/api/projects")).send({
          ...projectData,
          title: { $ne: null },
        })
      ).status
    ).toBe(400);
    expect(
      (
        await auth(request(app).post("/api/blogs")).send({
          ...blogData,
          title: { $ne: null },
        })
      ).status
    ).toBe(400);
  });
  test("custom slugs survive creation and existing links survive title edits", async () => {
    const res = await auth(request(app).post("/api/blogs")).send({
      ...blogData,
      slug: "stable-link",
    });
    expect(res.status).toBe(201);
    expect(res.body.blog.slug).toBe("stable-link");
    const update = await auth(
      request(app).patch("/api/blogs/" + res.body.blog._id)
    ).send({ title: "A renamed article" });
    expect(update.body.blog.slug).toBe("stable-link");
  });
  test("certificate PATCH preserves omitted order and visibility and validates types", async () => {
    const c = await models.Certificate.create({
      title: "Hidden Certificate",
      issuer: "Example",
      issueDate: new Date(),
      order: 8,
      isVisible: false,
    });
    const res = await auth(
      request(app).patch("/api/certificates/" + c.id)
    ).send({ title: "Renamed Certificate" });
    expect(res.status).toBe(200);
    expect(res.body.certificate.order).toBe(8);
    expect(res.body.certificate.isVisible).toBe(false);
    expect(
      (
        await auth(request(app).patch("/api/certificates/" + c.id)).send({
          title: 42,
        })
      ).status
    ).toBe(400);
  });
  test("experience PATCH preserves endDate and rejects untrusted logo IDs", async () => {
    const e = await models.Experience.create({
      company: "Example",
      position: "Engineer",
      startDate: "2020-01-01",
      endDate: "2021-01-01",
    });
    const res = await auth(request(app).patch("/api/experiences/" + e.id)).send(
      { position: "Senior Engineer", companyLogo: { publicId: "other/asset" } }
    );
    expect(res.status).toBe(200);
    expect(res.body.experience.endDate).toContain("2021-01-01");
    expect(res.body.experience.companyLogo.publicId).toBeNull();
  });
  test("settings reject operators and nested PATCH preserves unrelated values", async () => {
    const res = await auth(request(app).post("/api/site-settings")).send({
      siteName: "Test Site",
      developerName: "Test Developer",
      socialLinks: {
        github: "https://github.com/example",
        linkedin: "https://linkedin.com/in/example",
      },
    });
    expect(res.status).toBe(201);
    const update = await auth(request(app).patch("/api/site-settings")).send({
      socialLinks: { github: "https://github.com/changed" },
    });
    expect(update.body.settings.socialLinks.linkedin).toBe(
      "https://linkedin.com/in/example"
    );
    expect(
      (
        await auth(request(app).patch("/api/site-settings")).send({
          siteName: { $ne: null },
        })
      ).status
    ).toBe(400);
  });
});

describe("data integrity and error flows", () => {
  test("failed resume replacement rolls back deactivation of the prior resume", async () => {
    const original = await resumeService.createResume(resumeData);
    await expect(
      resumeService.createResume({ ...resumeData, title: "x".repeat(101) })
    ).rejects.toThrow();
    expect((await resumeService.getResume()).id).toBe(original.id);
    expect(await models.Resume.countDocuments()).toBe(1);
  });
  test("concurrent first resume uploads leave exactly one active record", async () => {
    await Promise.all(
      [1, 2, 3].map((n) =>
        resumeService.createResume({ ...resumeData, title: "Resume " + n })
      )
    );
    expect(await models.Resume.countDocuments()).toBe(3);
    expect(await models.Resume.countDocuments({ isActive: true })).toBe(1);
  });
  test("resume metadata PATCH preserves activation and parses false without truthiness coercion", async () => {
    const original = await resumeService.createResume(resumeData);
    const rename = await auth(
      request(app).patch("/api/resume/" + original.id)
    ).send({ title: "Renamed" });
    expect(rename.status).toBe(200);
    expect(rename.body.resume.isActive).toBe(true);
    const hide = await auth(
      request(app).patch("/api/resume/" + original.id)
    ).send({ isActive: "false" });
    expect(hide.body.resume.title).toBe("Renamed");
    expect(hide.body.resume.isActive).toBe(false);
  });
  test("contact state values agree and read flags require booleans", async () => {
    const contact = await models.Contact.create(contactData);
    for (const status of ["in-progress", "resolved", "archived", "new"]) {
      const res = await auth(
        request(app).patch("/api/contact/" + contact.id + "/status")
      ).send({ status });
      expect(res.status).toBe(200);
      expect(res.body.contact.status).toBe(status);
    }
    expect(
      (
        await auth(
          request(app).patch("/api/contact/" + contact.id + "/read")
        ).send({ isRead: "false" })
      ).status
    ).toBe(400);
    expect(
      (
        await auth(
          request(app).patch("/api/contact/" + contact.id + "/read")
        ).send({ isRead: false })
      ).body.contact.isRead
    ).toBe(false);
  });
  test("contact email escapes user HTML and email failure still preserves the message", async () => {
    const data = {
      ...contactData,
      name: "<b>Tester</b>",
      message: "<img src=x onerror=alert(1)> & hello",
    };
    expect((await request(app).post("/api/contact").send(data)).status).toBe(
      201
    );
    const mail = providers.mail.mock.calls[0][0];
    expect(mail.html).toContain("&lt;img");
    expect(mail.html).not.toContain("<img");
    expect(mail.text).toContain("<img");
    providers.mail.mockRejectedValueOnce(new Error("synthetic SMTP outage"));
    expect(
      (await request(app).post("/api/contact").send(contactData)).status
    ).toBe(201);
    expect(await models.Contact.countDocuments()).toBe(2);
  });
  test("malformed JSON, wrong upload types, and missing files are client errors", async () => {
    expect(
      (
        await request(app)
          .post("/api/contact")
          .set("Content-Type", "application/json")
          .send("{bad")
      ).status
    ).toBe(400);
    expect(
      (
        await auth(request(app).post("/api/resume")).attach(
          "resume",
          Buffer.from("not a PDF"),
          { filename: "file.txt", contentType: "text/plain" }
        )
      ).status
    ).toBe(400);
    expect(
      (
        await auth(request(app).post("/api/resume")).attach(
          "resume",
          Buffer.alloc(5 * 1024 * 1024 + 1),
          { filename: "file.pdf", contentType: "application/pdf" }
        )
      ).status
    ).toBe(413);
    expect(
      (await auth(request(app).post("/api/upload/project-image"))).status
    ).toBe(400);
    expect(providers.upload).not.toHaveBeenCalled();
  });
});

test("skill PATCH preserves omitted flags and ordering", async () => {
  const skill = await models.Skill.create({
    name: "Test Skill",
    category: "tools",
    proficiency: 60,
    featured: true,
    isActive: false,
    order: 9,
  });
  const res = await auth(request(app).patch("/api/skills/" + skill.id)).send({
    name: "Renamed Skill",
  });
  expect(res.status).toBe(200);
  expect(res.body.skill.featured).toBe(true);
  expect(res.body.skill.isActive).toBe(false);
  expect(res.body.skill.order).toBe(9);
  expect(
    (await auth(request(app).get("/api/skills/admin/" + skill.id))).status
  ).toBe(200);
});

test("concurrent gallery uploads cannot exceed the gallery limit", async () => {
  const image = (n) => ({
    url: "https://example.com/" + n + ".png",
    publicId: "synthetic/" + n,
  });
  const project = await models.Project.create({
    ...projectData,
    images: Array.from({ length: 9 }, (_, n) => image(n)),
  });
  const { addProjectImages } =
    await import("../src/services/projectService.js");
  const results = await Promise.allSettled([
    addProjectImages(project.id, [image(10)]),
    addProjectImages(project.id, [image(11)]),
  ]);
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  expect((await models.Project.findById(project.id)).images).toHaveLength(10);
});

test("valid login returns a cookie without returning password hashes", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "synthetic-password" });
  expect(res.status).toBe(200);
  expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
  expect(res.body.admin.password).toBeUndefined();
  expect(
    (
      await request(app)
        .post("/api/auth/login")
        .send({ email: { $ne: null }, password: "synthetic-password" })
    ).status
  ).toBe(400);
});

test("current experience accepts no end date and certificate dates reject null", async () => {
  const res = await auth(request(app).post("/api/experiences")).send({
    company: "Example",
    position: "Engineer",
    employmentType: "full-time",
    startDate: "2022-01-01",
    endDate: "",
    current: true,
  });
  expect(res.status).toBe(201);
  expect(res.body.experience.endDate).toBeNull();
  const invalid = await auth(request(app).post("/api/certificates")).send({
    title: "Example Certificate",
    issuer: "Example",
    issueDate: null,
  });
  expect(invalid.status).toBe(400);
});

test("profile resume upload persists media with the authenticated admin ID", async () => {
  const res = await auth(request(app).patch("/api/auth/profile/resume")).attach(
    "resume",
    Buffer.from("%PDF-1.7\nsynthetic"),
    { filename: "resume.pdf", contentType: "application/pdf" }
  );
  expect(res.status).toBe(200);
  expect((await models.Admin.findById(admin.id)).resume.publicId).toBe(
    "synthetic/upload"
  );
});
