import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Popconfirm, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {Link} from 'umi';
interface TienDoHocTap {
  id: number;
  subject: string;
  time: string; // ISO
  duration: number; // phút
  content: string;
  note?: string;
}

const STORAGE_KEY = "tienDoHocTap";

export default function QuanLyTienDoHocTap() {
  const [dsTienDo, setDsTienDo] = useState<TienDoHocTap[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TienDoHocTap | null>(null);
  const [form] = Form.useForm<{
    id?: number;
    subject: string;
    time: Dayjs;
    duration: number;
    content: string;
    note?: string;
  }>();

  // Load dữ liệu từ localStorage khi mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: TienDoHocTap[] = JSON.parse(raw);
        setDsTienDo(parsed);
      }
    } catch (e) {
      console.error("Lỗi đọc localStorage:", e);
    }
  }, []);

  // Mỗi khi dsTienDo đổi thì lưu lại vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dsTienDo));
    } catch (e) {
      console.error("Lỗi ghi localStorage:", e);
    }
  }, [dsTienDo]);

  const columns = [
    { title: "Mã", dataIndex: "id", key: "id", width: 80 },
    { title: "Môn học", dataIndex: "subject", key: "subject" },
    {
      title: "Thời gian học",
      dataIndex: "time",
      key: "time",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thời lượng (phút)",
      dataIndex: "duration",
      key: "duration",
      width: 140,
    },
    { title: "Nội dung đã học", dataIndex: "content", key: "content" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      align: "center" as const,
      render: (_: any, record: TienDoHocTap) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue({
                id: record.id,
                subject: record.subject,
                time: dayjs(record.time),
                duration: record.duration,
                content: record.content,
                note: record.note,
              });
              setOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa lịch học này?"
            onConfirm={() => {
              setDsTienDo((prev) =>
                prev.filter((item) => item.id !== record.id)
              );
              message.success("Đã xóa lịch học");
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

  const handleSubmit = (values: {
    id?: number;
    subject: string;
    time: Dayjs;
    duration: number;
    content: string;
    note?: string;
  }) => {
    if (editing) {
      // dùng id edit sua
      const updated: TienDoHocTap = {
        id: editing.id,
        subject: values.subject,
        time: values.time.toISOString(),
        duration: values.duration,
        content: values.content,
        note: values.note,
      };
      setDsTienDo((prev) =>
        prev.map((item) => (item.id === editing.id ? updated : item))
      );
      message.success("Cập nhật tiến độ thành công");
    } else {
      // Thêm mới
      const created: TienDoHocTap = {
        id: Date.now(),
        subject: values.subject,
        time: values.time.toISOString(),
        duration: values.duration,
        content: values.content,
        note: values.note,
      };
      setDsTienDo((prev) => [...prev, created]);
      message.success("Thêm tiến độ học tập thành công");
    }
    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý tiến độ học tập</h1>
      <div style={{ marginBottom: 32 }}>
        <Space style={{ marginBottom: 32 }}>
          <Link to="/quan-ly-danh-muc-mon-hoc">
          <Button>Danh mục môn học</Button>
          </Link>
          <Link to="/quan-ly-tien-do-hoc-tap">
          <Button type="primary">Tiến độ học tập</Button>
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
        Thêm lịch học
      </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns as any}
        dataSource={dsTienDo}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editing ? "Sửa tiến độ học tập" : "Thêm tiến độ học tập"}
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
            label="Môn học"
            name="subject"
            rules={[{ required: true, message: "Nhập tên môn học" }]}
          >
            <Input placeholder="VD: Toán, Anh..." />
          </Form.Item>
          <Form.Item
            label="Thời gian học"
            name="time"
            rules={[{ required: true, message: "Chọn thời gian" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Thời lượng (phút)"
            name="duration"
            rules={[{ required: true, message: "Nhập thời lượng học" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Nội dung đã học"
            name="content"
            rules={[{ required: true, message: "Nhập nội dung đã học" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={2} />
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