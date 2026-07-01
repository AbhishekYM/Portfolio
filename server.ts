import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import db from "./db";

// Simple middleware to verify a secret token or key for admin endpoints
function verifyAdminToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers['authorization'];
  if (token === 'Bearer abhishek-artisan-session-token') {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access to the guild archives." });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==================== PUBLIC API ENDPOINTS ====================

  // Fetch all portfolio data in a single clean ledger payload
  app.get("/api/portfolio", (req, res) => {
    try {
      const projects = db.prepare("SELECT * FROM projects ORDER BY sort_order ASC").all() as any[];
      const skills = db.prepare("SELECT * FROM skills ORDER BY category, id ASC").all() as any[];
      const chronicle = db.prepare("SELECT * FROM chronicle ORDER BY sort_order ASC, year DESC").all() as any[];
      const guestbook = db.prepare("SELECT * FROM guestbook ORDER BY timestamp DESC").all() as any[];

      // Parse JSON fields back to objects/arrays for React convenience
      const parsedProjects = projects.map(p => ({
        ...p,
        techStack: JSON.parse(p.tech_stack),
        keyFeatures: JSON.parse(p.key_features),
        stats: JSON.parse(p.stats)
      }));

      // Structure skills by categories
      const categoriesMap = new Map<string, any>();
      skills.forEach(s => {
        if (!categoriesMap.has(s.category)) {
          categoriesMap.set(s.category, { title: s.category, description: s.category === "Backend Architecture" ? "The engine room of reliability and speed." : "Fluid, high-contrast, responsive interfaces.", skills: [] });
        }
        categoriesMap.get(s.category).skills.push({ id: s.id, name: s.name, level: s.level, detail: s.detail });
      });

      res.json({
        projects: parsedProjects,
        skills: Array.from(categoriesMap.values()),
        chronicle,
        guestbook
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Sign the visitor register (Guestbook)
  app.post("/api/guestbook", (req, res) => {
    try {
      const { name, organization, message, inkColor } = req.body;
      if (!name || !message) {
        return res.status(400).json({ error: "Name and message are required." });
      }

      const id = Math.random().toString(36).substring(2, 9);
      const now = new Date();
      // Format as YYYY-MM-DD HH:MM
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      db.prepare(`
        INSERT INTO guestbook (id, name, organization, message, timestamp, ink_color)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, name, organization || null, message, timestamp, inkColor || 'charcoal');

      // Return newly created item
      res.json({
        id,
        name,
        organization,
        message,
        timestamp,
        inkColor: inkColor || 'charcoal'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dispatch a formal contact inquiry letter
  app.post("/api/inquiries", (req, res) => {
    try {
      const { name, email, subject, body } = req.body;
      if (!name || !email || !body) {
        return res.status(400).json({ error: "Name, email, and message body are required." });
      }

      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      db.prepare(`
        INSERT INTO inquiries (name, email, subject, body, timestamp, status)
        VALUES (?, ?, ?, ?, ?, 'unread')
      `).run(name, email, subject || 'Consultation Offer', body, timestamp);

      res.json({ success: true, message: "Letter sealed and dispatched successfully." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== ADMIN API ENDPOINTS ====================

  // Login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password must be supplied." });
    }

    try {
      const savedPass = db.prepare("SELECT value FROM admin_config WHERE key = 'password'").get() as { value: string };
      if (password === savedPass.value) {
        res.json({ success: true, token: 'abhishek-artisan-session-token' });
      } else {
        res.status(401).json({ error: "Invalid passphrase. ACCESS DENIED." });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Inquiries (Admin)
  app.get("/api/admin/inquiries", verifyAdminToken, (req, res) => {
    try {
      const inquiries = db.prepare("SELECT * FROM inquiries ORDER BY id DESC").all();
      res.json(inquiries);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update Inquiry Status (Admin)
  app.post("/api/admin/inquiries/status", verifyAdminToken, (req, res) => {
    try {
      const { id, status } = req.body;
      db.prepare("UPDATE inquiries SET status = ? WHERE id = ?").run(status, id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Clear an Inquiry (Admin)
  app.delete("/api/admin/inquiries/:id", verifyAdminToken, (req, res) => {
    try {
      db.prepare("DELETE FROM inquiries WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save/Update Project (Admin)
  app.post("/api/admin/projects", verifyAdminToken, (req, res) => {
    try {
      const { id, title, category, period, description, longDescription, techStack, keyFeatures, schemaLayout, stats, sortOrder } = req.body;
      if (!id || !title || !category) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const existing = db.prepare("SELECT COUNT(*) as count FROM projects WHERE id = ?").get(id) as { count: number };
      
      if (existing.count > 0) {
        db.prepare(`
          UPDATE projects 
          SET title = ?, category = ?, period = ?, description = ?, long_description = ?, tech_stack = ?, key_features = ?, schema_layout = ?, stats = ?, sort_order = ?
          WHERE id = ?
        `).run(
          title, category, period, description, longDescription, 
          JSON.stringify(techStack), JSON.stringify(keyFeatures), schemaLayout || null, JSON.stringify(stats), 
          sortOrder || 0, id
        );
      } else {
        db.prepare(`
          INSERT INTO projects (id, title, category, period, description, long_description, tech_stack, key_features, schema_layout, stats, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          id, title, category, period, description, longDescription, 
          JSON.stringify(techStack || []), JSON.stringify(keyFeatures || []), schemaLayout || null, JSON.stringify(stats || []), 
          sortOrder || 0
        );
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Project (Admin)
  app.delete("/api/admin/projects/:id", verifyAdminToken, (req, res) => {
    try {
      db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save/Update Skill (Admin)
  app.post("/api/admin/skills", verifyAdminToken, (req, res) => {
    try {
      const { id, category, name, level, detail } = req.body;
      if (!category || !name || level === undefined) {
        return res.status(400).json({ error: "Missing required skill fields." });
      }

      if (id) {
        db.prepare(`
          UPDATE skills SET category = ?, name = ?, level = ?, detail = ? WHERE id = ?
        `).run(category, name, level, detail || '', id);
      } else {
        db.prepare(`
          INSERT INTO skills (category, name, level, detail) VALUES (?, ?, ?, ?)
        `).run(category, name, level, detail || '');
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Skill (Admin)
  app.delete("/api/admin/skills/:id", verifyAdminToken, (req, res) => {
    try {
      db.prepare("DELETE FROM skills WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save/Update Chronicle (Admin)
  app.post("/api/admin/chronicle", verifyAdminToken, (req, res) => {
    try {
      const { id, year, title, organization, description, type, sortOrder } = req.body;
      if (!year || !title || !organization || !type) {
        return res.status(400).json({ error: "Missing required chronicle fields." });
      }

      if (id) {
        db.prepare(`
          UPDATE chronicle SET year = ?, title = ?, organization = ?, description = ?, type = ?, sort_order = ? WHERE id = ?
        `).run(year, title, organization, description || '', type, sortOrder || 0, id);
      } else {
        db.prepare(`
          INSERT INTO chronicle (year, title, organization, description, type, sort_order) VALUES (?, ?, ?, ?, ?, ?)
        `).run(year, title, organization, description || '', type, sortOrder || 0);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Chronicle (Admin)
  app.delete("/api/admin/chronicle/:id", verifyAdminToken, (req, res) => {
    try {
      db.prepare("DELETE FROM chronicle WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Change Password (Admin)
  app.post("/api/admin/change-password", verifyAdminToken, (req, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters." });
      }
      db.prepare("UPDATE admin_config SET value = ? WHERE key = 'password'").run(newPassword);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== VITE & STATIC FILES SERVING ====================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
