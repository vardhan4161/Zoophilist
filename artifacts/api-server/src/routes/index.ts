import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import servicesRouter from "./services";
import galleryRouter from "./gallery";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(servicesRouter);
router.use(galleryRouter);
router.use(adminRouter);

export default router;
