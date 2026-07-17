import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import servicesRouter from "./services";
import galleryRouter from "./gallery";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(servicesRouter);
router.use(galleryRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(uploadRouter);

export default router;
