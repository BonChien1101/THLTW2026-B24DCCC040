import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from "antd";
import { Link } from "umi";
interface DanhMucMonHoc {
  id: number;
  name: string;
}

const STORAGE_KEY = "danhMucMonHoc";

export default function QuanLyDanhMucMonHoc() {
  const [dsDanhMuc, setDsDanhMuc] = useState<DanhMucMonHoc[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DanhMucMonHoc | null>(null);
  const [form] = Form.useForm<DanhMucMonHoc>();

  // 
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: DanhMucMonHoc[] = JSON.parse(raw);
        setDsDanhMuc(parsed);
      } else {
        // dữ liệu mặc định lần đầu
        const defaultData: DanhMucMonHoc[] = [
          { id: 1, name: "Toán" },
          { id: 2, name: "Văn" },
          { id: 3, name: "Anh" },
          { id: 4, name: "Khoa học" },
          { id: 5, name: "Công nghệ" },
        ];
        setDsDanhMuc(defaultData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      }
    } catch (e) {
      console.error("Lỗi đọc localStorage:", e);
    }
  }, []);

  // Mỗi khi dsDanhMuc đổi thì lưu lại vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dsDanhMuc));
    } catch (e) {
      console.error("Lỗi ghi localStorage:", e);
    }
  }, [dsDanhMuc]);

  const columns = [
    { title: "Mã", dataIndex: "id", key: "id", width: 80 },
    { title: "Tên môn học", dataIndex: "name", key: "name" },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      align: "center" as const,
      render: (_: any, record: DanhMucMonHoc) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này?"
            onConfirm={() => {
              setDsDanhMuc((prev) =>
                prev.filter((item) => item.id !== record.id)
              );
              message.success("Đã xóa danh mục");
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleSubmit = (values: DanhMucMonHoc) => {
    if (editing) {
      setDsDanhMuc((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...item, name: values.name } : item
        )
      );
      message.success("Cập nhật danh mục thành công");
    } else {
      setDsDanhMuc((prev) => [
        ...prev,
        { id: Date.now(), name: values.name },
      ]);
      message.success("Thêm danh mục thành công");
    }
    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý danh mục môn học</h1>
      <div style={{ marginBottom: 32 }}>
      <Space style={{ marginBottom: 32 }}>
          <Link to="/quan-ly-danh-muc-mon-hoc">
          <Button type="primary">Danh mục môn học</Button>
          </Link>
          <Link to="/quan-ly-tien-do-hoc-tap">
          <Button>Tiến độ học tập</Button>
          </Link>
          <Link to="/thiet-lap-muc-tieu-hang-thang">
          <Button>Mục tiêu hàng tháng</Button>
          </Link>
      </Space>  
      </div>
      <div style={{ marginBottom: 6 }}>
      <Button
        type="primary"
        style={{ marginBottom: 6 }}
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setOpen(true);
        }}
      >
        Thêm danh mục
      </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns as any}
        dataSource={dsDanhMuc}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editing ? "Sửa danh mục môn học" : "Thêm danh mục môn học"}
        visible={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên môn học"
            name="name"
            rules={[{ required: true, message: "Nhập tên môn học" }]}
          >
            <Input placeholder="VD: Toán, Văn, Anh..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editing ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}