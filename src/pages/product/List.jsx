import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppModal from "../../components/AppModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/services/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-ui/react";
import { SelectItem, SelectItemIndicator } from "@base-ui/react";

const ProductPage = () => {
  const _initForm = {
    id: null,
    name: "",
    email: "",
    password: "",
    is_active: 1,
  };

  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(_initForm);
  const [isEdit, setIsEdit] = useState(false);
  const fetchProducts = async () => {
    try {
      // get All Users
      const response = await api.get("/product");
      setProducts(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      // get All Users
      const response = await api.get("/category");
      setCategories(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData(_initForm);
    setIsEdit(false);
  };

  const handleEditModal = (product) => {
    console.log(product);
    setShowModal(true);
    setIsEdit(true);
    setFormData(product);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category_id: formData.category_id,
        price: formData.price,
        description: formData.description,
        stock: formData.stock,
        is_active: parseInt(formData.is_active),
      };
      if (isEdit) {
        // update data
        await api.put(`/product/${formData.id}`, payload);
        // setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
      } else {
        // insert data
        await api.post("/product", payload);
        // const newUser = {
        //   ...formData,
        //   id: Date.now(),
        // };

        // setUsers([...users, newUser]);
      }
      setFormData(_initForm);
      await fetchProducts();
    } catch (error) {
      const errMsg = error.message;
      console.log(errMsg);
    } finally {
      setShowModal(false);
    }
    // jika edit data
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Are you sure want to delete this data?",
    );
    if (confirmation) {
      // delete
      await api.delete(`/product/${id}`);
      fetchProducts();
      // setUsers(users.filter((u) => u.id !== id));
    }
    // filter: users
  };

  return (
    <>
      <Card className="shadow-sm border-border p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Data Product</CardTitle>
          </div>
          <Button onClick={handleOpenModal}>Create New Product</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0 fw-bold">Data Product</h4>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-y bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">#</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length > 0 ? (
                products.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-6 whitespace-nowrap">{index + 1}</td>
                    <td>{row.name}</td>
                    <td>{row.category_name}</td>
                    <td>{row.price}</td>
                    <td>{row.stock}</td>
                    <td>
                      <span
                        className={`border rounded-sm p-2 ${row.is_active === 1 ? "bg-green-600" : "bg-red-600"}   text-white`}
                      >
                        {user.is_active === 1 ? "Active" : "In-Active"}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-right whitespace-nowrap">
                      <Button
                        onClick={() => handleEditModal(row)}
                        size="sm"
                        className="me-2 bg-green-600"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(row.id)}
                        variant="destructive"
                        size="sm"
                        className="me-2"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    Product Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <AppModal
        show={showModal}
        onClose={handleCloseModal}
        title={isEdit ? "Edit User" : "Create New User"}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save Change" : "Save"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value ={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})} required>
              <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select One"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input
              type="password"
              name="password"
              value={formData.stock}
              onChange={handleChange}
              required={isEdit ? false : true}
              placeholder="Enter your password"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              type="password"
              name="password"
              value={formData.description}
              onChange={handleChange}
              required={isEdit ? false : true}
              placeholder="Enter your password"
            />
          </div>
          {isEdit ? (
            <div className="space-y-2">
              <Label>Activation</Label>
              <RadioGroup
                value={String(formData.is_active)}
                onValueChange={(val) =>
                  setFormData({ ...formData, is_active: parseInt(val) })
                }
                className="w-fit flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="inactive" />
                  <Label htmlFor="inactive">In-Active</Label>
                </div>
              </RadioGroup>
            </div>
          ) : (
            ""
          )}
        </div>
      </AppModal>
    </>
  );
};

export default ProductPage;
