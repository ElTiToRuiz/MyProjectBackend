import express from "express";
import { ShipmentController } from "../controllers/shipment/shipmentController.js";

export const shipmentRouter = express.Router();

// Route for getting all shipments
shipmentRouter.get("/", ShipmentController.getAllShipments);


// Route for putting a shipment as urgent
shipmentRouter.put("/:id/urgent", ShipmentController.makeShipmentUrgent);