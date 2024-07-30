export type ProductType = {
  id: string;
  title: string;
  price: number;
  brandId: string;
  brand: {
    id: string;
    name: string;
  };
};

export type BrandType = {
  id: string;
  name: string;
};
