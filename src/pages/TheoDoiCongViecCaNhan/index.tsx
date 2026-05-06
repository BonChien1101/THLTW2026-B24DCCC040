import { PlusOutlined } from '@ant-design/icons';
import { Button, Menu, Modal, Space } from 'antd';
import type { MenuProps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import Dashboard from './Dashboard';
import DanhSachCongViec from './DanhSachCongViec';
import KanBanBoard from './KanBanBoard';
import ModalCongViec from './components/ModalCongViec';

const TheoDoiCongViecCaNhan: React.FC = () => {
  const [tabHienTai, setTabHienTai] = useState<string>('dashboard');
  const {
    taiDuLieu,
    dangTai,
    hienForm,
    setHienForm,
    setDangSua,
    setCongViecDangChon,
    congViecDangChon,
  } = useModel('theodoicongvieccanhan');

  useEffect(() => {
    taiDuLieu();
  }, [taiDuLieu]);

  const items: MenuProps['items'] = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'kanban', label: 'Kanban Board' },
      { key: 'danh_sach', label: 'Danh sách task' },
    ],
    [],
  );

  const noiDung = useMemo(() => {
    switch (tabHienTai) {
      case 'dashboard':
        return <Dashboard />;
      case 'kanban':
        return <KanBanBoard />;
      case 'danh_sach':
        return <DanhSachCongViec />;
      default:
        return null;
    }
  }, [tabHienTai]);

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
        <Menu
          mode='horizontal'
          selectedKeys={[tabHienTai]}
          items={items}
          onClick={(info) => setTabHienTai(info.key)}
          style={{ flex: 1, maxWidth: 720 }}
        />
        <Button
          type='primary'
          icon={<PlusOutlined />}
          loading={dangTai}
          onClick={() => {
            setDangSua(false);
            setCongViecDangChon(undefined);
            setHienForm(true);
          }}
        >
          Thêm task
        </Button>
      </Space>

      {noiDung}

      <Modal destroyOnClose visible={hienForm} footer={null} onCancel={() => setHienForm(false)}>
        <ModalCongViec congViec={congViecDangChon} />
      </Modal>
    </div>
  );
};

export default TheoDoiCongViecCaNhan;
