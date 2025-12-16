import express from "express";
const { Router } = express;

const router = Router();

router.get("/dashboard", (req, res) => {
    res.json({message: "Owner dashboard data"});
})

export default router;