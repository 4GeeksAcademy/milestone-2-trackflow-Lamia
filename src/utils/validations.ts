import { Carrier, Product, Shipment } from "../types/models";

export function validateProduct(product: Product): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!product.sku) errors.push("SKU must not be empty");
  if (product.weightKg <= 0 || product.weightKg > 100) {
    errors.push("Weight must be greater than 0 and less than or equal to 100");
  }

  if (
    product.dimensions.lengthCm <= 0 ||
    product.dimensions.lengthCm > 200 ||
    product.dimensions.widthCm <= 0 ||
    product.dimensions.widthCm > 200 ||
    product.dimensions.heightCm <= 0 ||
    product.dimensions.heightCm > 200
  ) {
    errors.push("All dimensions must be greater than 0 and less than or equal to 200");
  }

  if (product.stockQuantity < 0) errors.push("Stock quantity must be greater than or equal to 0");
  if (product.minStockThreshold < 0) errors.push("Minimum stock threshold must be greater than or equal to 0");
  if (product.UnitCostUSD <= 0) errors.push("Unit cost must be greater than 0");

  return { valid: errors.length === 0, errors };
}

export function validateShipment(shipment: Shipment): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (shipment.quantity <= 0) errors.push("Quantity must be greater than 0");
  if (shipment.declaredValueUSD <= 0) errors.push("Declared value must be greater than 0");
  if (shipment.destination.distanceKm < 0) errors.push("Distance must be greater than or equal to 0");

  return { valid: errors.length === 0, errors };
}

export function validateCarrier(carrier: Carrier): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (carrier.baseRateUSD < 0) {
    errors.push("Base rate must be greater than or equal to 0");
  }
  if (carrier.ratePerKgUSD < 0) {
    errors.push("Rate per kg must be greater than or equal to 0");
  }
  if (carrier.ratePerKmUSD < 0) {
    errors.push("Rate per km must be greater than or equal to 0");
  }
  if (carrier.avgDeliveryDays <= 0) {
    errors.push("Average delivery days must be greater than 0");
  }
  if (carrier.onTimeRate < 0 ) {
    errors.push("On-time rate cannot be negative");
   }
  if (carrier.onTimeRate > 100) {
 errors.push("On-time rate cannot be greater than 100");
  }
  if (carrier.maxWeightKg <= 0) {
    errors.push("Max weight must be greater than 0");
  }
  if (carrier.operatesIn.length === 0) {
    errors.push("Carrier must operate in at least one country");
  }
  if (errors.length === 0) {
    return {
      valid: true,
      errors: []
    };
  }

  return { 
    valid: false,
    errors: errors
  };
}