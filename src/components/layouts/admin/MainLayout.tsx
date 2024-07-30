"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { BrandType, ProductType } from "~/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

/* ################## PRODUCT SCHEMA ################### */

const addProductSchema = z.object({
  title: z.string(),
  price: z.preprocess((val) => Number(val), z.number().min(1000)),
  brand: z.string(),
});

/* ################## BRAND SCHEMA ################### */

const addBrandSchema = z.object({
  name: z.string(),
});

/* ################## MAIN LAYOUT ################### */

export default function MainLayout({
  products,
  brands,
  totalProducts,
}: {
  products: ProductType[];
  brands: BrandType[];
  totalProducts: number;
}) {
  // console.log(products);
  const [datas, setDatas] = useState(products);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-4xl font-semibold">
        {products.length ? "Products" : "No Products"}
      </h3>
      <div className="flex items-center gap-4">
        <AddProduct brands={brands} />
        <AddBrand />
      </div>
      <SearchProduct datas={datas} setDatas={setDatas} products={products} />
      <div className="flex flex-col justify-center gap-4 md:flex-row md:flex-wrap">
        {datas?.map((product) => {
          return (
            <Card key={product.id} className="w-96">
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Price: {formatPrice(product.price)}
                </CardDescription>
                <CardDescription>Brand: {product.brand.name}</CardDescription>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <EditProduct
                  product={product}
                  id={product.id}
                  brands={brands}
                />
                <DeleteProduct product={product.title} id={product.id} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <PaginationProducts setDatas={setDatas} totalProducts={totalProducts} />
    </div>
  );
}

/* ################## ADD PRODUCT ################### */

export function AddProduct({ brands }: { brands: BrandType[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  // console.log(brands);
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      price: 0,
      brand: "",
    },
  });

  const handleAddProductSubmit = async (
    values: z.infer<typeof addProductSchema>,
  ): Promise<void> => {
    setIsOpen(true);
    try {
      const response = await fetch("http://localhost:3000/api/product", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          price: Number(values.price),
          brandId: values.brand,
        }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
      const data = await response.json();
      router.refresh();
      form.reset();
      toast({
        title: `${values.title} added successfully`,
        description: "Product added successfully",
        variant: "default",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong: " + error,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-black">
            Add Product
          </Button>
        </DialogTrigger>

        <DialogContent className="w-96 md:w-full">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              action=""
              onSubmit={form.handleSubmit(handleAddProductSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands?.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button type="submit">Add Product</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ################## ADD BRAND ################### */

export function AddBrand() {
  const router = useRouter();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(addBrandSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleAddBrandSubmit = async (
    values: z.infer<typeof addBrandSchema>,
  ): Promise<void> => {
    setIsOpen(true);
    try {
      const response = await fetch("http://localhost:3000/api/brand", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: values.name.toUpperCase().charAt(0) + values.name.slice(1),
        }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }

      const data = await response.json();
      router.refresh();
      form.reset();
      toast({
        title: `${values.name} added successfully`,
        description: "Brand added successfully",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong: " + error,
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-black">
            Add Brand
          </Button>
        </DialogTrigger>
        <DialogContent className="w-96 md:w-full">
          <DialogHeader>
            <DialogTitle>Add Brand</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              action=""
              onSubmit={form.handleSubmit(handleAddBrandSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Add Brand</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ################## EDIT PRODUCT ################### */

export function EditProduct({
  product,
  id,
  brands,
}: {
  product: ProductType;
  id: string;
  brands: BrandType[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: product.title,
      price: product.price,
      brand: product.brand.id,
    },
  });

  const handleEditProductSubmit = async (
    values: z.infer<typeof addProductSchema>,
  ): Promise<void> => {
    setIsOpen(true);
    try {
      const response = await fetch("http://localhost:3000/api/product/" + id, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          price: values.price,
          brandId: values.brand,
        }),
      });

      const data = await response.json();
      router.refresh();
      form.reset();
      toast({
        title: `${values.title} updated successfully`,
        description: "Product updated successfully",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong: " + error,
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-teal-500">Edit Product</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleEditProductSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button type="submit" className="bg-teal-500 hover:bg-teal-700">
                Edit Product
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ################## DELETE PRODUCT ################### */

export function DeleteProduct({
  product,
  id,
}: {
  product: string;
  id: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const handleDeleteProductSubmit = async () => {
    setIsOpen(true);
    try {
      const response = await fetch("http://localhost:3000/api/product/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await response.json();
      router.refresh();
      setIsOpen(false);
      toast({
        title: `${product} deleted successfully`,
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong: " + error,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure? This action cannot be undone.
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action <strong>cannot</strong> be undone. This will
              permanently
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDeleteProductSubmit}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ################## SEARCH PRODUCT ################### */

export function SearchProduct({
  datas,
  setDatas,
  products,
}: {
  datas: ProductType[];
  setDatas: any;
  products: ProductType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filterProducts = (query: string) => {
    if (query === "") {
      setDatas(products);
    } else {
      const filtered = datas.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase()),
      );
      setDatas(filtered);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    setSearchQuery(query);
    filterProducts(query);
  };

  return (
    <div>
      <Input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-44 rounded border p-2 text-black"
      />
    </div>
  );
}

/* ################## PAGINATION PRODUCT ################### */

export function PaginationProducts({
  setDatas,
  totalProducts,
}: {
  setDatas: any;
  totalProducts: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  useEffect(() => {
    const fetchProducts = async (page: number) => {
      const response = await fetch(
        `http://localhost:3000/api/product?page=${page - 1}&pageSize=${itemsPerPage}`,
      );

      const data = await response?.json();
      setDatas(data.data);
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index + 1}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={page === currentPage}
              className={page === currentPage ? "text-black" : ""}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
