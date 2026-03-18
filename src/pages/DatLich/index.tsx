import React, { useState } from 'react';
import { Card, Menu } from 'antd';
import type { MenuProps } from 'antd';
import LichHenPage from '../LichHen';
import QuanLyNhanVienDichVu from '../QuanLyNhanVienDichVu';

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
  <Card>{title} Coming soon....</Card>
);

const DatLichLayout: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('nhan-vien-dich-vu');

  const items: MenuProps['items'] = [
    { key: 'nhan-vien-dich-vu', label: 'Nhân viên & dịch vụ', },
    { key: 'quan-ly-lich-hen', label: 'Quản lý lịch hẹn' },
    { key: 'danh-gia', label: 'Đánh giá dịch vụ & nhân viên' },
    { key: 'thong-ke', label: 'Thống kê & báo cáo' },
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'quan-ly-lich-hen':
        return <LichHenPage />;
      case 'nhan-vien-dich-vu':
        return <QuanLyNhanVienDichVu />;
      case 'danh-gia':
        return <Placeholder title="Đánh giá dịch vụ & nhân viên" />;
      case 'thong-ke':
        return <Placeholder title="Thống kê & báo cáo" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Menu
        mode="inline"
        style={{ width: 260, height: '100%' }}
        selectedKeys={[activeKey]}
        items={items}
        onClick={(info) => setActiveKey(info.key)}
      />
      <div style={{ flex: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default DatLichLayout;
