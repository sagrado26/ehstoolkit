import type { Express } from "express";
import { storage } from "../storage";
import { insertDocumentSchema } from "@shared/schema";

export function registerDocumentRoutes(app: Express) {
  app.get("/api/documents", async (_req, res) => {
    try {
      res.json(await storage.getAllDocuments());
    } catch {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const item = await storage.getDocument(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: "Document not found" });
      res.json(item);
    } catch {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const data = insertDocumentSchema.parse(req.body);
      res.status(201).json(await storage.createDocument(data));
    } catch {
      res.status(400).json({ error: "Invalid document data" });
    }
  });

  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const updated = await storage.updateDocument(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Document not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDocument(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Document not found" });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });
}
