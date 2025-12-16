import express from "express";
const { Router } = express;

const router = Router();

router.get("/profile", (req, res) => {
    res.json({message: "Customer profile data"})
})

export default router;