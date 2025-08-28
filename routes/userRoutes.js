import express from "express";

const router = express.Router();

router.get('/dashboard', (req, res)=>{
    const {name} = req.query;
    res.render('usersPage/dashboard', {name})
})

export default router;
