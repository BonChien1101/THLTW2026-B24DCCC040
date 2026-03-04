import { useMemo, useState } from 'react';
import { Table, Button, Space,} from 'antd';
import { useModel, Link} from 'umi';
export default function QuanLiMonHoc() {
    const [open, setOpen] = useState(false);
        return (
            <div style={{ padding: 24 }}>
                <h1 style={{ marginBottom: 24 }}>Quản lý môn học</h1>
            <Space style={{ marginBottom: 32 }}>
                <Link to="/quan-ly-danh-muc-mon-hoc">
                <Button>Danh mục môn học</Button>
                </Link>
                <Link to="/quan-ly-tien-do-hoc-tap">
                <Button>Tiến độ học tập</Button>
                </Link>
                <Link to="/thiet-lap-muc-tieu-hang-thang">
                <Button>Mục tiêu hàng tháng</Button>
                </Link>
            </Space>

        </div>
    );
}