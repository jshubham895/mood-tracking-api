import { Router } from "express";
const router = Router();
import vendorRoutes from "./vendor.routes";
import userRoutes from "./user.routes";

router.use("/vendor", vendorRoutes);

router.use("/user", userRoutes);

export = router;
