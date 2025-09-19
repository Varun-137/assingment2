import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  Row,
  Col,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
  Button,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";


const getAvatar = (username = "user") => {
  return `https://avatars.dicebear.com/v2/avataaars/${encodeURIComponent(
    username
  )}.svg?options[mood][]=happy`;
};

function UserCard({ user, isFavorite, onLike, onEdit, onDelete }) {
  const avatar = useMemo(() => getAvatar(user.username), [user.username]);

  return (
    <div className="card mb-4 shadow-sm">
      <img
        src={avatar}
        alt={`${user.username} avatar`}
        className="card-img-top p-3"
        style={{ height: 220, objectFit: "contain" }}
      />

      
      <div className="card-body">
        <h5 className="card-title mb-1">{user.name}</h5>
        <p className="card-subtitle text-muted mb-3">@{user.username}</p>

        <div className="small mb-2 d-flex align-items-center mr-2 gap-4">
          <MailOutlined className="me-2" />  {user.email}
        </div>
        <div className="small mb-2 d-flex align-items-center">
          <PhoneOutlined className="me-2" /> {user.phone}
        </div>
        <div className="small mb-2 d-flex align-items-center">
          <GlobalOutlined className="me-2" /> {user.website}
        </div>
      </div>

      
      <div className="d-flex justify-content-between px-3 pb-3 text-muted">
        <Tooltip title={isFavorite ? "Unlike" : "Like"}>
          {isFavorite ? (
            <HeartFilled
              style={{ fontSize: 18, color: "#e03131" }}
              className="icon-click"
              onClick={() => onLike(user.id)}
            />
          ) : (
            <HeartOutlined
              style={{ fontSize: 18 }}
              className="icon-click"
              onClick={() => onLike(user.id)}
            />
          )}
        </Tooltip>

        <Tooltip title="Edit">
          <EditOutlined
            style={{ fontSize: 18 }}
            className="icon-click"
            onClick={() => onEdit(user)}
          />
        </Tooltip>

        <Popconfirm
          title="Delete this user?"
          okText="Delete"
          okType="danger"
          onConfirm={() => onDelete(user.id)}
        >
          <Tooltip title="Delete">
            <DeleteOutlined style={{ fontSize: 18 }} className="icon-click" />
          </Tooltip>
        </Popconfirm>
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    let active = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (active) setUsers(data);
      } catch (err) {
        if (active) setError(err.message || "Failed to load users");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      active = false;
    };
  }, []);


  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleEdit = (user) => {
    setEditing(user);
    form.setFieldsValue(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setFavorites((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });
  };

  const saveChanges = (values) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editing.id ? { ...u, ...values } : u))
    );
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">User Profiles</h1>
      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spin size="large" />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && users.length === 0 && (
        <Empty description="No users found" />
      )}
      <Row gutter={[16, 16]}>
        {users.map((user) => (
          <Col key={user.id} xs={24} sm={12} md={8} lg={6}>
            <UserCard
              user={user}
              isFavorite={favorites.has(user.id)}
              onLike={toggleFavorite}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>
      <Modal
        title={editing ? `Edit ${editing.username}` : "Edit User"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        
      >
        <Form layout="vertical" form={form} onFinish={saveChanges}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", required: true, message: "Enter valid email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Website" name="website">
            <Input />
          </Form.Item>

          <div className="d-flex justify-content-end gap-2">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
