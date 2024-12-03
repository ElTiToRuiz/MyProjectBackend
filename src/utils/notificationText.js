// Order-related notifications:
export const orderCreated = (order) => ({
    title: 'New Order Created',
    message: `A new order has been created. Order ID: ${order.id}. Please review the details.`,
    is_persistent: true,
    priority: 'high',
    type: 'Order Alert',
    min_permission: 'admin',
    reference: order.id
});

export const orderStatusChanged = (order) => ({
    title: 'Order Status Changed',
    message: `The status of order ${order.id} has changed to ${order.status}.`,
    is_persistent: false,
    priority: 'medium',
    type: 'Order Update',
    min_permission: 'staff',
    reference: order.id
});

export const orderDelivered = (order) => ({
    title: 'Order Delivered',
    message: `Order ${order.id} has been delivered successfully.`,
    is_persistent: false,
    priority: 'low',
    type: 'Order Update',
    min_permission: 'staff',
    reference: order.id
});

export const orderCancelled = (order) => ({ 
    title: 'Order Cancelled',
    message: `Order ${order.id} has been cancelled.`,
    is_persistent: false,
    priority: 'low',
    type: 'Order Update',
    min_permission: 'staff',
    reference: order.id
});

export const orderUrgent = (order) => ({
    title: 'Urgent Order',
    message: `Order ${order.id} has been marked as urgent.`,
    is_persistent: false,
    priority: 'high',
    type: 'Order Alert',
    min_permission: 'staff',
    reference: order.id
});

export const newOrderAssigned = (order) => ({
    title: 'New Order Assigned',
    message: `You have been assigned a new order: #${order.id}. Please start processing it.`,
    is_persistent: true,
    priority: 'high',
    type: 'Order Alert',
    min_permission: 'staff',
    reference: order.id
});

// Inventory-related notifications:
export const noStock = (product) => ({
    title: 'No Stock Available',
    message: `Product ${product.name} is out of stock. Please update the inventory.`,
    is_persistent: true,
    priority: 'high',
    type: 'Inventory Alert',
    min_permission: 'admin'
});

export const inventoryThresholdReached = (product) => ({
    title: 'Inventory Threshold Reached',
    message: `The stock for product ${product.name} has reached the threshold. ${product.stockQuantity} remaining!`,
    is_persistent: false,
    priority: 'medium',
    type: 'Inventory Update',
    min_permission: 'staff'
});

export const newProductAdded = (product) => ({
    title: 'New Product Added',
    message: `A new product, ${product.name}, has been added to the inventory.`,
    is_persistent: false,
    priority: 'low',
    type: 'Inventory Update',
    min_permission: 'staff'
});

export const productUpdated = (product) => ({
    title: 'Product Updated',
    message: `The product ${product.name} has been updated.`,
    is_persistent: false,
    priority: 'medium',
    type: 'Inventory Update',
    min_permission: 'staff'
});

export const newStockAdded = (product) => ({
    title: 'New Stock Added',
    message: `New stock for product ${product.name} has been added.`,
    is_persistent: false,
    priority: 'low',
    type: 'Inventory Update',
    min_permission: 'staff'
});

// Team-related notifications:
const taskAssignedToTeam = (task) => ({
    title: 'Task Assigned to Team',
    message: `A new task has been assigned to your team: ${task.name}. Please review and take action.`,
    is_persistent: true,
    priority: 'high',
    type: 'Team Alert',
    min_permission: 'team_member'
});

const taskRemovedFromTeam = (task) => ({
    title: 'Task Removed from Team',
    message: `The task ${task.name} has been removed from your team.`,
    is_persistent: false,
    priority: 'low',
    type: 'Team Update',
    min_permission: 'team_member'
});

const addedToTeam = (team) => ({
    title: 'You\'ve Been Added to a Team',
    message: `You have been added to the team: ${team.name}. Check your tasks and get started!`,
    is_persistent: false,
    priority: 'medium',
    type: 'Team Update',
    min_permission: 'team_member',
    reference: team.id
});

const removedFromTeam = (team) => ({
    title: 'You\'ve Been Removed from a Team',
    message: `You have been removed from the team: ${team.name}. Please check your tasks for further updates.`,
    is_persistent: false,
    priority: 'medium',
    type: 'Team Update',
    min_permission: 'team_member',
    reference: team.id
});

const teamAnnouncement = () => ({
    title: 'Team Announcement',
    message: 'A new announcement has been made for your team. Please check it in the announcements section.',
    is_persistent: false,
    priority: 'low',
    type: 'Team Update',
    min_permission: 'team_member',
    reference: team.id
});

// User-related notifications:
const userApprovalPending = () => ({
    title: 'User Approval Pending',
    message: 'Your account is currently under review. You will be notified once it is approved.',
    is_persistent: true,
    priority: 'high',
    type: 'User Alert',
    min_permission: 'admin',
    reference: user.id
});

const userApproved = () => ({
    title: 'Account Approved',
    message: 'Your account has been approved. Welcome to the system!',
    is_persistent: false,
    priority: 'low',
    type: 'User Update',
    min_permission: 'user',
    reference: user.id
});

const userRoleChanged = (user) => ({
    title: 'Role Updated',
    message: `Your role has been changed to "${user.role}". You may now access new features.`,
    is_persistent: false,
    priority: 'medium',
    type: 'User Update',
    min_permission: 'user'
});

// Shipment-related notifications:
const newShipmentAdded = (shipment) => ({ 
    title: 'New Shipment Added',
    message: `A new shipment has been added: ${shipment.name}. Please check the shipments section for details.`,
    is_persistent: false,
    priority: 'low',
    type: 'Shipment Update',
    min_permission: 'staff'
});

const shipmentInProgress = (shipment) => ({
    title: 'Shipment In Progress',
    message: `The shipment for order ${shipment.reference} is in progress.`,
    is_persistent: false,
    priority: 'medium',
    type: 'Shipment Update',
    min_permission: 'staff'
});

const shipmentStatusChanged = (shipment) => ({
    title: 'Shipment Status Changed',
    message: `The shipment for order ${shipment.reference} has changed status to ${shipment.status}.`,
    is_persistent: false,
    priority: 'medium',
    type: 'Shipment Update',
    min_permission: 'staff'
});

const shipmentDelivered = (shipment) => ({
    title: 'Shipment Delivered',
    message: `The shipment for order ${shipment.reference} has been delivered successfully.`,
    is_persistent: false,
    priority: 'low',
    type: 'Shipment Update',
    min_permission: 'staff'
});

const shipmentDelayed = (shipment) => ({
    title: 'Shipment Delayed',
    message: `The shipment for order #${shipment.reference} has been delayed. Updated delivery date: ${shipment.newDeliveryDate}.`,
    is_persistent: true,
    priority: 'high',
    type: 'Shipment Alert',
    min_permission: 'staff'
});

// System-related notifications:
const systemMaintenance = (maintenance) => ({
    title: 'System Maintenance',
    message: `Scheduled system maintenance will occur on ${maintenance.date} from ${maintenance.startTime} to ${maintenance.endTime}.`,
    is_persistent: false,
    priority: 'low',
    type: 'System Update',
    min_permission: 'admin'
});

const systemUpdate = (update) => ({
    title: 'System Update Available',
    message: `A new system update (version ${update.version}) is available. Please update for enhanced performance.`,
    is_persistent: false,
    priority: 'medium',
    type: 'System Update',
    min_permission: 'staff'
});

// Bug Reports and Feedback:
const bugReportAcknowledged = () => ({
    title: 'Bug Report Acknowledged',
    message: `Your bug report has been received. Our team is investigating it.`,
    is_persistent: true,
    priority: 'medium',
    type: 'Bug Report Update',
    min_permission: 'staff'
});

const feedbackResponse = () => ({
    title: 'Feedback Response',
    message: `Thank you for your feedback. Our team has reviewed it and will take action soon.`,
    is_persistent: false,
    priority: 'low',
    type: 'Feedback Update',
    min_permission: 'staff'
});