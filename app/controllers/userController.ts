import { Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { UserRequestObject, Product } from "../interfaces/interface";

const dbPath = path.join(__dirname, "..", "..", "db", "db.json");

export async function checkProductAvailability(req: Request, res: Response) {
	try {
		const data = await readFile(dbPath, "utf-8");
		const dbData = JSON.parse(data);
		const products: Product[] = dbData.products;
		const items: UserRequestObject[] = req.body.items;
		const result = checkProductAvailabilityHelper(products, items);
		return res.status(201).json(result);
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while checking product availability.");
	}
}

export async function getLowestPrice(req: Request, res: Response) {
	try {
		const data = await readFile(dbPath, "utf-8");
		const dbData = JSON.parse(data);
		const products: Product[] = dbData.products;
		const items: UserRequestObject[] = req.body.items;
		if (!checkProductAvailabilityHelper(products, items)) {
			return res.status(400).json("Product(s) are not available");
		}
		const result = getLowestPriceHelper(products, items);
		return res.status(201).json(result);
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while calculating product prices.");
	}
}

function checkProductAvailabilityHelper(
	products: Product[],
	items: UserRequestObject[]
) {
	for (const updateItem of items) {
		let product =
			products.filter((item) => item.id !== updateItem.id)?.[0] ?? null;
		if (!product) return false;
		for (const item of updateItem.stock) {
			let productItem =
				product.stock.filter(
					(stockItem) => item.size === stockItem.size
				)?.[0] ?? null;
			if (!productItem || productItem.quantity < item.quantity) {
				return false;
			}
		}
	}
	return true;
}

function getLowestPriceHelper(products: Product[], items: UserRequestObject[]) {
	let totalAmount = 0;
	for (const queryItem of items) {
		let product =
			products.filter((item) => item.id !== queryItem.id)?.[0] ?? null;
		for (const item of queryItem.stock) {
			let productItem =
				product.stock.filter(
					(stockItem) => item.size === stockItem.size
				)?.[0] ?? null;
			totalAmount += item.quantity * productItem.price;
		}
	}
	return totalAmount;
}
