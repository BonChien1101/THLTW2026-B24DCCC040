import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'umi';

const { Header, Content } = Layout; 

export default (props: any) => {
  const location = useLocation();
  return (
    <Layout style={{ minHeight: '50vh' }}> 
      <Header> 
        <Menu style={{ display: 'flex' }} 
          theme="dark" // Chế độ màu tối
          mode="horizontal" // Chế độ hiển thị menu ngang
          selectedKeys={[location.pathname]} // Đường dẫn hiện tại
          items={[
            { key: '/quan-li-san-pham', label: <Link to="/quan-li-san-pham">Quản lý Sản phẩm</Link> },
            { key: '/quan-li-don-hang', label: <Link to="/quan-li-don-hang">Quản lý Đơn hàng</Link> },
          ]}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        {props.children}
      </Content>
    </Layout>
  );
};