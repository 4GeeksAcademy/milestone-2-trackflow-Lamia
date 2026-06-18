import { Product, Shipment } from "../types/models";
export function findProductBySKU(
    products: Product[],
    sku: string
): Product | null {
    return (
        products.find(
            (product) => product.sku.toLowerCase() === sku.toLocaleLowerCase()
        )|| null
    );
}
export function findShipmentById(
    shipments: Shipment[],
    id: string
): Shipment | null {
    return shipments.find((shipment) => shipment.id === id) || null;
}
export function binarySearchProductByWeight(
    sortedProducts: Product[],
    targetWeight: number
): number {
    let left = 0;
    let right = sortedProducts.length -1;
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const currentWeight = sortedProducts[middle].weightKg;
        if (currentWeight === targetWeight) {
            return middle;
        }
        if (currentWeight < targetWeight) {
            left = middle + 1;
        } else {
            right = middle -1;
        }
    }
    return -1;
}