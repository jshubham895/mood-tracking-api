import { Router } from "express";
const router = Router();

router.use("/vendor", require("./vendor.routes"));

router.use("/user", require("./user.routes"));

export = router;
