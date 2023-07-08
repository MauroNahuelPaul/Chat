import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { messageModel } from "../dao/models/message.model.js";

const router = Router();

router.get("/realTimeProducts", async (req, res) => {
    res.render("realTimeProducts");
});

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageModel.find().lean().exec();
    res.render("chat", { messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
