import React, { useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import DanhSachCauLacBo from './DanhSachCauLacBo';
import DonDangKyThanhVienPage from './DonDangKyThanhVien';
import BaoCaoThongKePage from './BaoCaoThongKe';
import QuanLyThanhVienCLBPage from './QuanLyThanhVienCLB';
const QuanLyCauLacBoLayouts: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('danh-sach-clb');

  const items: MenuProps['items'] = [
    { key: 'danh-sach-clb', label: 'Danh sách CLB' },
    { key: 'don-dang-ky-thanh-vien', label: 'Đơn đăng ký thành viên' },
    { key: 'quan-ly-thanh-vien-clb', label: 'Quản lý thành viên CLB' },
    { key: 'thong-ke-bao-cao', label: 'Thông kê báo cáo' },
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'danh-sach-clb':
        return <DanhSachCauLacBo/>;
      case 'don-dang-ky-thanh-vien':
        return <DonDangKyThanhVienPage/>;
      case 'quan-ly-thanh-vien-clb':
        return <QuanLyThanhVienCLBPage/>;
      case 'thong-ke-bao-cao':
        return <BaoCaoThongKePage />;
      default:
        return null;
    }
  };

    return (
    <div>
        <div
        className="clb-menu-wrapper"
        style={{ display: 'flex', justifyContent: 'center' }}
        >
        <Menu
            mode="horizontal"
            selectedKeys={[activeKey]}
            items={items}
            onClick={(info) => setActiveKey(info.key)}
            style={{ width: '100%', maxWidth: 670 }}
            className="clb-menu"
        />
        </div>

        <div style={{ marginTop: 16 }}>
        {renderContent()}
        </div>
    </div>
    );
};

export default QuanLyCauLacBoLayouts;
