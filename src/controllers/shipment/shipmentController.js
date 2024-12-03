import { ShipmentModel } from "../../models/shipment/shipmentModel.js";
import { OrdersController } from "../order/orderController.js";
import { sendNotifcationAdmin } from "../../sockets/index.js";

export class ShipmentController {

    static async getAllShipments(req, res) { 
        try {
            const shipments = await ShipmentModel.findAll();
            res.json(shipments);
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Error fetching shipments', error });
        }
    }

    static async getShipmentById(req, res) {
        try {
            const { orderId } = req.params;
            const shipment = await
            ShipmentModel.findOne({ where: { orderId: orderId } });
            if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
            res.status(200).json(shipment);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching shipment', error });
        }
    }

    static async createShipment(req, res) {
        try{
            const shipment = await ShipmentModel.create(req.body);
            sendNotifcationAdmin('new-shipment', shipment);
            res.status(201).json(shipment);     
        }catch(error){ 
            console.log(error);
            res.status(500).json({ message: 'Error creating shipment', error });
        }
    }

    static async createShipmentEmpty({order}) {
        try{
            const shipment = await ShipmentModel.create({
                orderId: order.id,
                trackingNumber: order.trackingNumber || null,
                shipmentStatus: order.status,
                orderDate: new Date(),
                estimatedDeliveryDate: new Date() + 3, 
                deliveredDate: order.deliveredDate || null, 
                clientName: order.customerName,
                clientEmail: order.customerEmail,
                clientAddress: order.customerAddress,
                additionalNotes: order.additionalDetails || null,
                urgent: order.urgent
            });

            return shipment
        } catch(error){
            throw error;
        }
    }

    // Make a shipment and its order urgent
    static async makeShipmentUrgent(req, res) {
        try {
            const { id } = req.params;
            await OrdersController.makeOrderUrgent({ shipmentId: id });
            res.status(200).json({ message: 'Shipment updated successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating shipment', error });
        }
    }

    static async updateShipment({order}) {
        try {
            const { status, id } = order.dataValues;
            const shipment = await ShipmentModel.findOne({ where: { orderId: id } });
            if(!shipment) throw new Error('Shipment not found');
            shipment.shipmentStatus = status;
            status === 'delivered' ? shipment.deliveredDate = new Date() : null;
            await shipment.save();
            return shipment
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error updating shipment', error });
        }
    }

    static async deleteShipment(req, res) {
        try {
            const { orderId } = req.params;
            const deletedShipment = await ShipmentModel.destroy({ where: { orderId: orderId } });
            if (!deletedShipment) return res.status(404).json({ message: 'Shipment not found' });
            res.status(200).json({ message: 'Shipment deleted successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error deleting shipment', error });
        }
    }
}