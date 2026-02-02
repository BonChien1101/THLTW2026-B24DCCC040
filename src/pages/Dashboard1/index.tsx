import {useEffect, useState} from "react";
import { Card, Col, Row, Statistic } from 'antd';
import{useModel} from 'umi'

export default function Dashboard1() {
  const [doanhThu, setDoanhThu] = useState(0);
  const {dataSource: products, setDataSource: setProducts} = useModel('danhsachsanpham');
  const {dataSource: orders, setDataSource: setOrders} = useModel('danhsachdonhang');

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
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
  }, [products, orders]);
  return (
    <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={8}>
        <Card style={{ backgroundColor: '#f0fff0' }} title="Tổng Số Sản Phẩm" bordered={false}>
            <Statistic style={{ color: '#3f8600' }} value={totalProducts} />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ backgroundColor: '#f0f8ff' }} title="Tổng Số Đơn Hàng" bordered={false}>
          <Statistic style={{ color: '#58ddc9ff' }} value={totalOrders} />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ backgroundColor: '#af4e4eff' }} title="Tổng Giá Trị Tồn Kho" bordered={false}>
          <Statistic style={{ color: '#db5661ff' }} value={totalStockValue} />
        </Card>
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={8}>
        <Card style={{ backgroundColor: '#f0fff0' }} title="Tổng Doanh Thu" bordered={false}>
          <Statistic style={{ color: '#3f8600' }} value={doanhThu} />
        </Card>
      </Col>
    </Row>
  </div>
  );
}