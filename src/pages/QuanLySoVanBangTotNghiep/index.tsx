import React, { useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import SoVanBangPage from './SoVanBang';
import QuyetDinhTotNghiepPage from './QuyetDInh';
import CauHinhPhuLucPage from './CauHinhPhuLuc';
import ThongTinVanBangPage from './ThongTinVanBang';

const QuanLySoVanBangTotNghiepLayout: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('so-van-bang');

  const items: MenuProps['items'] = [
    { key: 'so-van-bang', label: 'Sổ văn bằng' },
    { key: 'quyet-dinh-tot-nghiep', label: 'Quyết định tốt nghiệp' },
    { key: 'cau-hinh-phu-luc', label: 'Cấu hình biểu mẫu phụ lục' },
    { key: 'thong-tin-van-bang', label: 'Thông tin văn bằng' },
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'so-van-bang':
        return <SoVanBangPage />;
      case 'quyet-dinh-tot-nghiep':
        return <QuyetDinhTotNghiepPage />;
      case 'cau-hinh-phu-luc':
        return <CauHinhPhuLucPage />;
      case 'thong-tin-van-bang':
  return <ThongTinVanBangPage />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Menu
        mode='inline'
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

export default QuanLySoVanBangTotNghiepLayout;
