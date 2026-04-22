import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Input, Modal, Popconfirm, Row, Space, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { capNhatBaiVietTheoSlug } from '../BlogCaNhan/luuTru';
import { useBlogCaNhan } from '../BlogCaNhan/useBlogCaNhan';

const { Title, Text } = Typography;

type DongThe = {
	tenThe: string;
	soBaiVietDangDung: number;
};

type GiaTriModal = {
	tenThe: string;
};

const QuanLyThe: React.FC = () => {
	const { dsBaiViet, setDsBaiViet, dsThe } = useBlogCaNhan();
	const [tuKhoa, setTuKhoa] = useState('');
	const [hienModal, setHienModal] = useState(false);
	const [dangSua, setDangSua] = useState<string | null>(null);
	const [tenThe, setTenThe] = useState('');

	const dsDong = useMemo(() => {
		const q = tuKhoa.trim().toLowerCase();
		const mapDem = new Map<string, number>();
		dsBaiViet.forEach((b) => {
			(b.the || []).forEach((t) => {
				mapDem.set(t, (mapDem.get(t) || 0) + 1);
			});
		});
		let ds: DongThe[] = dsThe.map((t) => ({ tenThe: t, soBaiVietDangDung: mapDem.get(t) || 0 }));
		if (q) ds = ds.filter((d) => d.tenThe.toLowerCase().includes(q));
		return ds.sort((a, b) => b.soBaiVietDangDung - a.soBaiVietDangDung || a.tenThe.localeCompare(b.tenThe));
	}, [dsBaiViet, dsThe, tuKhoa]);

	const moModalThem = () => {
		setDangSua(null);
		setTenThe('');
		setHienModal(true);
	};

	const moModalSua = (t: string) => {
		setDangSua(t);
		setTenThe(t);
		setHienModal(true);
	};

	const chuanHoaThe = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');

	const luuModal = () => {
		const giaTri: GiaTriModal = { tenThe: chuanHoaThe(tenThe) };
		if (!giaTri.tenThe) {
			message.error('Tên thẻ không hợp lệ');
			return;
		}

		if (!dangSua) {
			const daTonTai = dsThe.some((t) => t === giaTri.tenThe);
			if (daTonTai) {
				message.error('Thẻ đã tồn tại');
				return;
			}
			message.success('Đã thêm thẻ (thẻ sẽ xuất hiện khi bạn gán cho bài viết)');
			setHienModal(false);
			return;
		}

		const tenMoi = giaTri.tenThe;
		const tenCu = dangSua;
		if (tenMoi === tenCu) {
			setHienModal(false);
			return;
		}
		const daTonTai = dsThe.some((t) => t === tenMoi);
		if (daTonTai) {
			message.error('Tên thẻ mới bị trùng');
			return;
		}

		setDsBaiViet((prev) =>
			prev.map((b) => {
				if (!(b.the || []).includes(tenCu)) return b;
				const theMoi = Array.from(new Set((b.the || []).map((t) => (t === tenCu ? tenMoi : t))));
				capNhatBaiVietTheoSlug(b.slug, { the: theMoi });
				return { ...b, the: theMoi };
			}),
		);

		message.success('Đã đổi tên thẻ');
		setHienModal(false);
		setDangSua(null);
	};

	const xoaThe = (t: string) => {
		setDsBaiViet((prev) =>
			prev.map((b) => {
				if (!(b.the || []).includes(t)) return b;
				const theMoi = (b.the || []).filter((x) => x !== t);
				capNhatBaiVietTheoSlug(b.slug, { the: theMoi });
				return { ...b, the: theMoi };
			}),
		);
		message.success('Đã xóa thẻ khỏi các bài viết');
	};

	const cot: ColumnsType<DongThe> = [
		{
			title: 'Tên thẻ',
			dataIndex: 'tenThe',
			key: 'tenThe',
			render: (v) => <Text strong>{v}</Text>,
		},
		{
			title: 'Số bài viết đang sử dụng',
			dataIndex: 'soBaiVietDangDung',
			key: 'soBaiVietDangDung',
			width: 220,
			sorter: (a, b) => a.soBaiVietDangDung - b.soBaiVietDangDung,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			width: 220,
			render: (_, r) => (
				<Space>
					<Button size='small' onClick={() => moModalSua(r.tenThe)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa thẻ này khỏi tất cả bài viết?' okText='Xóa' cancelText='Hủy' onConfirm={() => xoaThe(r.tenThe)}>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<Space direction='vertical' style={{ width: '100%' }} size={16}>
				<Row gutter={[12, 12]} align='middle'>
					<Col xs={24} md={10}>
						<Title level={3} style={{ margin: 0 }}>
							Quản lý thẻ
						</Title>
					</Col>
					<Col xs={24} md={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button type='primary' onClick={moModalThem}>
							Thêm thẻ
						</Button>
					</Col>
				</Row>

				<Row gutter={[12, 12]}>
					<Col xs={24} md={10}>
						<Input value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} placeholder='Tìm theo tên thẻ...' allowClear />
					</Col>
				</Row>

				<Table<DongThe> rowKey='tenThe' columns={cot} dataSource={dsDong} pagination={{ pageSize: 10 }} />
			</Space>

			<Modal
				title={dangSua ? 'Sửa thẻ' : 'Thêm thẻ'}
				visible={hienModal}
				okText='Lưu'
				cancelText='Hủy'
				onCancel={() => setHienModal(false)}
				onOk={luuModal}
				destroyOnClose
			>
				<Input value={tenThe} onChange={(e) => setTenThe(e.target.value)} placeholder='VD: react, ui, antd...' allowClear />
				<div style={{ marginTop: 8 }}>
					<Text type='secondary'>Thẻ sẽ được chuẩn hóa về lowercase và thay khoảng trắng bằng dấu gạch.</Text>
				</div>
			</Modal>
		</Card>
	);
};

export default QuanLyThe;
