import { Router } from "express";
const router = Router();
import userRoutes from "./user.routes";
import moodLogRoutes from "./moodlog.routes";
import shareRoutes from "./share.routes";
import suggestionRoutes from "./suggestion.routes";
import insightRoutes from "./insight.routes";

router.use("/user", userRoutes);
router.use("/mood", moodLogRoutes);
router.use("/share", shareRoutes);
router.use("/suggestion", suggestionRoutes);
router.use("/insight", insightRoutes);

export = router;
