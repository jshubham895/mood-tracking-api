type UpdateProductObject = {
	size: string;
	quantity?: number;
	price?: number;
};

type UserProductObject = {
	size: string;
	quantity: number;
};

export type Stock = {
	size: string;
	quantity: number;
	price: number;
};

export type UpdateRequestObject = {
	id: string;
	stock: UpdateProductObject[];
};

export type UserRequestObject = {
	id: string;
	stock: UserProductObject[];
};

export type Product = {
	id: string;
	name: string;
	stock: Stock[];
};
