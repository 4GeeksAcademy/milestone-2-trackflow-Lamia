import {
  Carrier,
  Product,
  ProductCategory,
  Shipment,
  ShipmentStatus,
} from "../types/models";

export function calculateShippingCost(
  shipment: Shipment,
  product: Product,
  carrier: Carrier
): number {
  const baseRate = carrier.baseRateUSD;
  const weightCost =
    product.weightKg * carrier.ratePerKgUSD * shipment.quantity;
  const distanceCost =
    shipment.destination.distanceKm * carrier.ratePerKmUSD;

  let total = baseRate + weightCost + distanceCost;

  if (shipment.priority === "Express") {
    total *= 1.3;
  } else if (shipment.priority === "Same-day") {
    total *= 1.6;
  }

  return Number(total.toFixed(2));
}

export function scoreCarrierForShipment(
  carrier: Carrier,
  shipment: Shipment,
  product: Product
): number {
  let score = 0;

  if (carrier.operatesIn.includes(shipment.destination.country)) {
    score += 20;
  }

  if (
    product.weightKg * shipment.quantity <= carrier.maxWeightKg
  ) {
    score += 20;
  }

  if (carrier.acceptsPriority.includes(shipment.priority)) {
    score += 15;
  }

  if (!product.isFragile) {
    score += 15;
  } else if (carrier.handlesFragile) {
    score += 15;
  }

  score += carrier.onTimeRate * 0.3;

  return Number(score.toFixed(2));
}

export function selectBestCarrier(
  carriers: Carrier[],
  shipment: Shipment,
  product: Product
): { carrier: Carrier; score: number; cost: number } | null {
  const suitable = carriers
    .map((carrier) => ({
      carrier,
      score: scoreCarrierForShipment(carrier, shipment, product),
      cost: calculateShippingCost(shipment, product, carrier),
    }))
    .filter((item) => item.score >= 50);

  if (suitable.length === 0) {
    return null;
  }

  suitable.sort((a, b) => a.cost - b.cost);

  return suitable[0];
}

export function countProductsByCategory(
  products: Product[]
): Record<ProductCategory, number> {
  return {
    Fashion: products.filter((p) => p.category === "Fashion").length,
    Electronics: products.filter((p) => p.category === "Electronics").length,
    Cosmetics: products.filter((p) => p.category === "Cosmetics").length,
    Home: products.filter((p) => p.category === "Home").length,
    Other: products.filter((p) => p.category === "Other").length,
  };
}

export function calculateTotalInventoryValue(
  products: Product[]
): number {
  const total = products.reduce(
    (sum, product) =>
      sum + product.stockQuantity * product.UnitCostUSD,
    0
  );

  return Number(total.toFixed(2));
}

export function calculateAverageShipmentDistance(
  shipments: Shipment[]
): number {
  if (shipments.length === 0) return 0;

  const total = shipments.reduce(
    (sum, shipment) => sum + shipment.destination.distanceKm,
    0
  );

  return Number((total / shipments.length).toFixed(2));
}

export function groupShipmentsByStatus(
  shipments: Shipment[]
): Record<ShipmentStatus, Shipment[]> {
  return {
    Pending: shipments.filter((s) => s.status === "Pending"),
    Assigned: shipments.filter((s) => s.status === "Assigned"),
    "In transit": shipments.filter((s) => s.status === "In transit"),
    Delivered: shipments.filter((s) => s.status === "Delivered"),
    Failed: shipments.filter((s) => s.status === "Failed"),
  };
}

export function findTopCarriers(
  shipments: Shipment[],
  topN: number
): Array<{ carrier: string; count: number }> {
  const counts: Record<string, number> = {};

  shipments.forEach((shipment) => {
    if (shipment.carrier) {
      counts[shipment.carrier] =
        (counts[shipment.carrier] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .map(([carrier, count]) => ({ carrier, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}