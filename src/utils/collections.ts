import {
  Carrier,
  Product,
  ProductCategory,
  WarehouseLocation,
} from "../types/models";

export function filterProductsByWarehouse(
  products: Product[],
  warehouse: WarehouseLocation
): Product[] {
  return products.filter((product) => product.warehouse === warehouse);
}

export function filterProductsByCategory(
  products: Product[],
  category: ProductCategory
): Product[] {
  return products.filter((product) => product.category === category);
}

export function filterLowStockProducts(products: Product[]): Product[] {
  return products.filter(
    (product) => product.stockQuantity <= product.minStockThreshold
  );
}
   export function sortProductsByStock(
    products: Product[],
    order: "asc" | "desc"
   ): Product[] {
    return [...products].sort((a, b) => {
      if(order === "asc") {
        return a.stockQuantity - b.stockQuantity;
      } else {
        return b.stockQuantity - a.stockQuantity;
      }
    });
   }

export function sortCarriersByReliability(
  carriers: Carrier[],
  order: "asc" | "desc"
): Carrier[] {
  return [...carriers].sort((a, b) => {
   if (order === "asc") {
    return a.onTimeRate - b.onTimeRate;
   } else {
    return b.onTimeRate - a.onTimeRate;
   }
});
}