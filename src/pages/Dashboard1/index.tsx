import {useEffect, useState} from "react";
import { Card, Col, Row, Statistic, Badge, Avatar} from 'antd';
import{useModel} from 'umi'

export default function Dashboard1() {
  const [doanhThu, setDoanhThu] = useState(0);
  const {dataSource: products, setDataSource: setProducts} = useModel('danhsachsanpham');
  const {dataSource: orders, setDataSource: setOrders} = useModel('danhsachdonhang');

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [orderCounts, setOrderCounts] = useState({ pending: 0, shipping: 0, completed: 0, canceled: 0 });
  const totalValue = (Array.isArray(products) ? products.reduce((acc, product) => acc + (product.price * product.quantity), 0) : 0);
  const isCompleted = (order: any) => {
    const s = String(order?.status ?? order?.state ?? '').toLowerCase().trim();
    return s.includes('đã hoàn thành')
  };
  const totalDoanhThu = (
    Array.isArray(orders)
      ? orders
          .filter((order) => isCompleted(order))
          .reduce((acc, order) => acc + Number(order.totalAmount ?? 0), 0)
      : 0
  );
  useEffect (()=>{
    setTotalProducts(Array.isArray(products) ? products.length : 0);
    setTotalOrders(Array.isArray(orders) ? orders.length : 0);
    setTotalStockValue(totalValue);
    setDoanhThu(totalDoanhThu);

    // don hang theo status
    if (Array.isArray(orders)) {
      const a = (str: string) => str.trim()
      let pending = 0, shipping = 0, completed = 0, canceled = 0;
      orders.forEach((o: any) => {
        const raw = String(o?.status ?? o?.state ?? '');
        const n = a(raw);
        if (n.includes('Chờ xử lý')) pending++;
        else if (n.includes('Đang vận chuyển')) shipping++;
        else if (n.includes('Đã hoàn thành')) completed++;
        else if (n.includes('Đã huỷ')) canceled++;
      });
      setOrderCounts({ pending, shipping, completed, canceled });
    } else {
      setOrderCounts({ pending: 0, shipping: 0, completed: 0, canceled: 0 });
    }
  }, [products, orders]);


  return (
    <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={8}>
        <Card style={{ backgroundColor: '#f0fff0' }} title="Tổng Số Sản Phẩm" bordered={false}>
            <Statistic value={totalProducts} />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ backgroundColor: '#f0f8ff' }} title="Tổng Số Đơn Hàng" bordered={false}>
          <Statistic value={totalOrders} />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ backgroundColor: '#af4e4eff' }} title="Tổng Giá Trị Tồn Kho" bordered={false}>
          <Statistic value={totalStockValue} />
        </Card>
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={8}>
        <Card style={{ backgroundColor: '#dfe36fff' }} title="Tổng Doanh Thu" bordered={false}>
          <Statistic value={doanhThu} />
        </Card>
      </Col>
    </Row>


    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={6}>
        <Badge count={orderCounts.pending} showZero>
          <Avatar size={60} style={{ color: 'orange' }}>Chờ xử lý</Avatar>
        </Badge>
      </Col>
      <Col span={6}>
        <Badge count={orderCounts.shipping} showZero>
          <Avatar size={60} style={{ color: 'blue' }}>Đang vận chuyển</Avatar>
        </Badge>
      </Col>
      <Col span={6}>
        <Badge count={orderCounts.completed} showZero>
          <Avatar size={60} style={{ color: 'green' }}>Đã hoàn thành</Avatar>
        </Badge>
      </Col>
      <Col span={6}>
        <Badge count={orderCounts.canceled} showZero>
          <Avatar size={60} style={{ color: 'red' }}>Đã huỷ</Avatar>
        </Badge>
      </Col>
    </Row>
    </div>
  );
}