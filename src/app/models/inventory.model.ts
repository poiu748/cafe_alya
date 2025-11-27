// Inventory unit
export enum InventoryUnit {
    KG = 'kg',
    LITER = 'liter',
    UNIT = 'unit',
    PACK = 'pack'
}

// Inventory item
export interface InventoryItem {
    id: string;
    name: string;
    description: string;
    currentStock: number;
    minStock: number;
    unit: InventoryUnit;
    unitCost: number;
    supplier?: string;
    lastRestocked?: Date;
    lowStockAlert: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Stock movement
export interface StockMovement {
    id: string;
    itemId: string;
    quantity: number;
    type: 'in' | 'out';
    reason: string;
    createdBy: string;
    createdAt: Date;
}
