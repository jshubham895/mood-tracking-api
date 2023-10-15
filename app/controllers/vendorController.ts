import { Request, Response } from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Product, Stock, UpdateRequestObject } from "../interfaces/interface";

const dbPath = path.join(__dirname, "..", "..", "db", "db.json");

export async function getData(_req: Request, res: Response) {
	const data = await readFile(dbPath, "utf-8");
	return res.status(201).json(JSON.parse(data));
}

export async function addOrUpdateStock(req: Request, res: Response) {
	try {
		const data = await readFile(dbPath, "utf-8");
		const dbData = JSON.parse(data);
		const products: Product[] = dbData.products;
		const updateData: UpdateRequestObject[] = req.body.updateData;
		const newData = updateProductInfo(products, updateData);
		dbData.products = newData;
		await writeFile(dbPath, JSON.stringify(dbData), "utf-8");
		return res.status(201).json(dbData);
	} catch (err) {
		console.error(err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while updating data.");
	}
}

function updateProductInfo(
	products: Product[],
	updateData: UpdateRequestObject[]
) {
	let updatedProductData = [...products];
	updateData.forEach((updateItem) => {
		let product: Product | undefined;
		updatedProductData = updatedProductData.filter((item) => {
			if (item.id === updateItem.id) product = item;
			return item.id !== updateItem.id;
		});
		if (!product) {
			throw new Error("Prdouct not found");
		}
		let newProductData = { ...product };
		let newStockArray = [...product.stock];
		updateItem.stock.forEach((item) => {
			let productItem: Stock | undefined;
			newStockArray = newStockArray.filter((stock) => {
				if (stock.size === item.size) productItem = stock;
				return stock.size !== item.size;
			});
			let newStockItem = {
				size: item.size,
				price: item?.price ?? productItem!.price,
				quantity: item?.quantity ?? productItem!.quantity
			};
			newStockArray.push(newStockItem);
		});
		newProductData.stock = newStockArray;
		updatedProductData.push(newProductData);
	});
	return updatedProductData;
}
