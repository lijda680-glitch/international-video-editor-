import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Telegraf } from "telegraf";
import axios from "axios";
import fs from "fs-extra";
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function startServer() {
  const app = express();

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", botActive: !!BOT_TOKEN });
  });

  // Telegram Bot Setup
  if (BOT_TOKEN) {
    const bot = new Telegraf(BOT_TOKEN);

    bot.start((ctx) => {
      const welcomeMsg = {
        am: "ሰላም! እኔ የቪድዮ ኤዲተር ቦት ነኝ። ቪድዮ ላኩልኝ እና በጥራት አቀነባብራለሁ።\n\nእባክዎ ቪድዮ ይላኩ!",
        en: "Hello! I am an International Video Editor Bot. Send me a video and I will enhance it for you.\n\nPlease send a video!",
      };
      ctx.reply(`${welcomeMsg.am}\n\n${welcomeMsg.en}`);
    });

    bot.on("video", async (ctx) => {
      const video = ctx.message.video;
      const fileId = video.file_id;

      await ctx.reply("የኤዲቲንግ አይነት ይምረጡ / Choose editing style:", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✨ Auto-Enhance (ጥራት መጨመሪያ)", callback_data: `edit_auto_${fileId}` },
              { text: "🎬 Cinematic (ሲኒማቲክ)", callback_data: `edit_cinema_${fileId}` }
            ],
            [
              { text: "🌈 Vibrant (ደማቅ)", callback_data: `edit_vibrant_${fileId}` },
              { text: "🎞️ B&W (ጥቁርና ነጭ)", callback_data: `edit_bw_${fileId}` }
            ]
          ]
        }
      });
    });

    bot.on("callback_query", async (ctx) => {
      const data = (ctx.callbackQuery as any).data;
      if (!data.startsWith("edit_")) return;

      const [_, style, fileId] = data.split("_");
      await ctx.answerCbQuery("Processing started...");
      await ctx.editMessageText(`ኤዲቲንግ ተጀምሯል: ${style.toUpperCase()}... (Processing...)`);

      try {
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const tempDir = path.join(__dirname, "temp");
        await fs.ensureDir(tempDir);
        
        const inputPath = path.join(tempDir, `${fileId}_input.mp4`);
        const outputPath = path.join(tempDir, `${fileId}_output.mp4`);
        
        // Download
        const response = await axios({ url: fileLink.href, method: "GET", responseType: "stream" });
        const writer = fs.createWriteStream(inputPath);
        response.data.pipe(writer);
        await new Promise<void>((resolve, reject) => {
          writer.on("finish", () => resolve());
          writer.on("error", (err) => reject(err));
        });

        // FFmpeg Filters based on style
        let filters: string[] = [];
        let caption = "";

        switch (style) {
          case "auto":
            filters = ["unsharp=5:5:1.0:5:5:0.0", "hqdn3d=1.5:1.5:6:6", "eq=contrast=1.1:brightness=0.05:saturation=1.2"];
            caption = "✨ Auto-Enhanced Quality";
            break;
          case "cinema":
            filters = ["curves=preset=lighter", "colorlevels=rimin=0.05:gimin=0.05:bimin=0.05", "unsharp=3:3:0.5"];
            caption = "🎬 Cinematic Style";
            break;
          case "vibrant":
            filters = ["eq=saturation=1.5:contrast=1.2", "unsharp=5:5:0.8"];
            caption = "🌈 Vibrant Colors";
            break;
          case "bw":
            filters = ["format=gray", "eq=contrast=1.3"];
            caption = "🎞️ Classic B&W";
            break;
        }

        await ctx.reply("ቪድዮው እየተሰራ ነው... (Applying filters...)");

        await new Promise<void>((resolve, reject) => {
          ffmpeg(inputPath)
            .videoFilters(filters)
            .videoCodec("libx264")
            .outputOptions(["-preset fast", "-crf 20", "-pix_fmt yuv420p"])
            .on("end", () => resolve())
            .on("error", reject)
            .save(outputPath);
        });

        await ctx.replyWithVideo({ source: outputPath }, { caption: `✅ ${caption}\n\nProcessed by International Video Bot` });

        // Cleanup
        await fs.remove(inputPath);
        await fs.remove(outputPath);
      } catch (error) {
        console.error("Bot Error:", error);
        ctx.reply("ስህተት ተከስቷል። (An error occurred during processing.)");
      }
    });

    bot.launch().then(() => {
      console.log("Telegram Bot is running...");
    }).catch((err) => {
      console.error("Failed to launch bot:", err);
    });

    // Enable graceful stop
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  } else {
    console.warn("TELEGRAM_BOT_TOKEN is missing. Bot will not start.");
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
