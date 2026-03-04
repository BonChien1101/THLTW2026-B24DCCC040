import { useEffect, useState } from "react";
import { Table , Button, Modal, Form, Input, InputNumber, DatePicker, message, Popconfirm, Tag, Checkbox, Space
} from "antd";
import {Link} from 'umi';
import dayjs, { Dayjs } from "dayjs";


interface MucTieuThang {
    id: number;
    month: string; // ISO: định dạng YYYY-MM
    subject?: string;
    totalHours: number;
    note?: string;
    achieved: boolean;
}

const STORAGE_KEY = "mucTieuThang";

export default function ThietLapMucTieuHangThang() {
    const [dsMucTieu, setDsMucTieu] = useState<MucTieuThang[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<MucTieuThang | null>(null);
    const [form] = Form.useForm<{
        id?: number;
        month: Dayjs;
        subject?: string;
        totalHours: number;
        note?: string;
        achieved: boolean;
    }>();
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed: MucTieuThang[] = JSON.parse(raw);
                setDsMucTieu(parsed);
              }
            } catch (e) {
            console.error("Lỗi đọc localStorage:", e);
        }
    }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dsMucTieu));
    } catch (e) {
      console.error("Lỗi ghi localStorage:", e);
    }
  }, [dsMucTieu]);

  const columns = [
    { title: "Mã", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      render: (val: string) => dayjs(val).format("MM/YYYY"),
    },
    {
      title: "Môn học trọng tâm",
      dataIndex: "subject",
      key: "subject",
      render: (val?: string) => val || "Tất cả môn",
    },
    {
      title: "Tổng thời lượng (giờ)",
      dataIndex: "totalHours",
      key: "totalHours",
    },
    {
      title: "Ghi Chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Trạng thái",
      dataIndex: "achieved",
      key: "achieved",
      render: (achieved: boolean) =>
        achieved ? (
          <Tag color="green">Đã hoàn thành</Tag>
        ) : (
          <Tag color="red">Chưa đạt</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      align: "center" as const,
      render: (_: any, record: MucTieuThang) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue({
                id: record.id,
                month: dayjs(record.month),
                subject: record.subject,
                totalHours: record.totalHours,
                note: record.note,
                achieved: record.achieved,
              });
              setOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa mục tiêu này?"
            onConfirm={() => {
              setDsMucTieu((prev) =>
                prev.filter((item) => item.id !== record.id)
              );
              message.success("Đã xóa mục tiêu");
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
    month: Dayjs;
    subject?: string;
    totalHours: number;
    note?: string;
    achieved: boolean;
  }) => {
    if (editing) {
      const updated: MucTieuThang = {
        id: editing.id,
        month: values.month.toISOString(),
        subject: values.subject,
        totalHours: values.totalHours,
        note: values.note,
        achieved: values.achieved,
      };
      setDsMucTieu((prev) =>
        prev.map((item) => (item.id === editing.id ? updated : item))
      );
      message.success("Cập nhật mục tiêu thành công");
    } else {
      // Thêm mới
      const created: MucTieuThang = {
        id: Date.now(),
        month: values.month.toISOString(),
        subject: values.subject,
        totalHours: values.totalHours,
        note: values.note,
        achieved: values.achieved,
      };
      setDsMucTieu((prev) => [...prev, created]);
      message.success("Thêm mục tiêu học tập thành công");
    }

    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Thiết lập mục tiêu học tập hàng tháng</h1>
      <div style={{ marginBottom: 32 }}>
      <Space style={{ marginBottom: 32 }}>
          <Link to="/quan-ly-danh-muc-mon-hoc">
          <Button>Danh mục môn học</Button>
          </Link>
          <Link to="/quan-ly-tien-do-hoc-tap">
          <Button>Tiến độ học tập</Button>
          </Link>
          <Link to="/thiet-lap-muc-tieu-hang-thang">
          <Button type="primary">Mục tiêu hàng tháng</Button>
          </Link>
      </Space>
      </div>
      <div style={{ marginBottom: 6 }}>
      <Button
        type="primary"
        style={{ marginBottom: 12, marginTop: 12 }}
        onClick={() => {
          setEditing(null);
          form.resetFields();
          form.setFieldsValue({ achieved: false });
          setOpen(true);
        }}
      >
        Thêm mục tiêu tháng
      </Button>
        </div>
      <Table
        rowKey="id"
        columns={columns as any}
        dataSource={dsMucTieu}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editing ? "Sửa mục tiêu học tập" : "Thêm mục tiêu học tập"}
        visible={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ achieved: false }}
        >
          <Form.Item
            label="Tháng"
            name="month"
            rules={[{ required: true, message: "Chọn tháng" }]}
          >
            <DatePicker picker="month" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Môn học trọng tâm" name="subject">
            <Input placeholder="Bỏ trống nếu áp dụng cho tất cả môn" />
          </Form.Item>
          <Form.Item
            label="Tổng thời lượng học (giờ)"
            name="totalHours"
            rules={[{ required: true, message: "Nhập tổng thời lượng học" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea
              rows={3}
            />
          </Form.Item>
          <Form.Item
            label="Đã hoàn thành?"
            name="achieved"
            valuePropName="checked"
          >
            <Checkbox />
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