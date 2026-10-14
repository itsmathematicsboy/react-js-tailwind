import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AppModal from "../../components/AppModal";
import api from "@/services/api";

// import { Card, Form, Button, Table, Modal } from "react-bootstrap";
// import AppModal from "../../components/AppModal";

// const dataUsers = [
//   {
//     id: 1,
//     name: "Reza",
//     email: "ribrahim50@gmail.com",
//     password: 12345678,
//   },
//   {
//     id: 2,
//     name: "Budi",
//     email: "budi@gmail.com",
//     password: 12345678,
//   },
//   {
//     id: 3,
//     name: "ani",
//     email: "ani@gmail.com",
//     password: 12345678,
//   },
// ];

const ListUser = () => {
  const _initForm = {
    id: null,
    name: "",
    email: "",
    password: "",
    status: "Active",
  };

  const [showModal, setShowModal] = useState(false);
  const [users, setusers] = useState([]);
  const [formData, setFormData] = useState(_initForm);
  const [isEdit, setIsEdit] = useState(false);

  const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        setusers(response.data.data);
      } catch (error) {
        console.log(error.message);
      }
    }
  
  const handleOpenModal = () => {
    setShowModal(true);
    setFormData(_initForm);
    setIsEdit(false);
  };

  const handleEditModal = (user) => {
    console.log(user);
    setShowModal(true);
    setIsEdit(true);
    setFormData(user);
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

   useEffect(() => {
     fetchUser();
   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      is_active: parseInt(formData.is_active),
    };

    try {
      // jika edit data
      if (isEdit) {
        await api.put(`/user/${formData.id}`, payload);
      } else {
        await api.post("/user", payload);
        // const newUser = {
        //   ...formData,
        //   id: Date.now(),
        // };
  
        // setUsers([...users, newUser]);
      }
      setFormData(_initForm);
    } catch (error) {
      const errMsg = error.message;
      console.log(errMsg);
    } finally {
      fetchUser();
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure want to delete this data?");
    try {
        await api.delete(`/user/${id}`);
        fetchUser();

    } catch (error) {
      console.log(error.message);
    }
    };
    // filter: users


  return (
    <>
      <Card className="shadow-sm border-0 p-6">
        <CardHeader className="flex flex-row items-center justify-between space0y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Data User</CardTitle>
          </div>
          <Button variant="primary" onClick={handleOpenModal}>
            Create New User
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0 fw-bold">Data User</h4>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-y bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-6 whitespace-nowrap">{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`border rounded-sm p-1 ${user.is_active === 1 ? "bg-green-700" : "bg-red-700"} bg-green-700 text-white`}
                      >
                        {user.is_active === 1 ? "Active" : "Non-Active"}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-right whitespace-nowrap">
                      <Button
                        onClick={() => handleEditModal(user)}
                        variant="warning"
                        size="sm"
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        variant="danger"
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
                    Belum ada data user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={formData.email} onChange={handleChange} type="email" name="email" placeholder="Enter your email" required></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter your passwod" required></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}

      <AppModal
        show={showModal}
        onClose={handleCloseModal}
        title={isEdit ? "Edit User" : "Create New User"}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save Change" : "Save"}
      >
        {/* <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange}></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={formData.email} onChange={handleChange} type="email" name="email" placeholder="Enter your email" required></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter your passwod" required></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select One</option>
              <option value="Active">Publish</option>
              <option value="In Active">Draft</option>
            </Form.Select>
          </Form.Group>
        </Form> */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Masukan Nama"
              value={formData.name}
              onChange={handleChange}
            ></Input>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              id="email"
              name="email"
              required
              placeholder="Masukan Email"
              value={formData.email}
              onChange={handleChange}
            ></Input>
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Masukan Password"
              value={formData.password}
              required={isEdit ? false : true}
              onChange={handleChange}
            >
              {isEdit ? (
                <div className="space-y-2">
                  <label>Activation</label>
                </div>
              ):(
                ""
              )}
            </Input>
          </div>
        </div>
      </AppModal>
    </>
  );
};

export default ListUser;
