import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	Modal,
	Popconfirm,
	Radio,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { history } from 'umi';
import type { BaiViet, TrangThaiBaiViet } from '../BlogCaNhan/kieuDuLieu';
import { taoIdBaiViet, taoSlug } from '../BlogCaNhan/luuTru';
import { useBlogCaNhan } from '../BlogCaNhan/useBlogCaNhan';

const { Title, Text } = Typography;

type GiaTriForm = {
	tieuDe: string;
	slug?: string;
	noiDung: string;
	anhDaiDien: string;
	the: string[];
	trangThai: TrangThaiBaiViet;
	tomTat: string;
};

const QuanLyBaiViet: React.FC = () => {
	const { dsBaiViet, setDsBaiViet, dsThe } = useBlogCaNhan();
	const [form] = Form.useForm<GiaTriForm>();
	const [hienModal, setHienModal] = useState(false);
	const [dangSua, setDangSua] = useState<BaiViet | null>(null);
	const [tuKhoa, setTuKhoa] = useState('');
	const [tuKhoaDaDebounce, setTuKhoaDaDebounce] = useState('');
	const [trangThaiLoc, setTrangThaiLoc] = useState<TrangThaiBaiViet | 'tat_ca'>('tat_ca');
	const timer = useRef<number | null>(null);

	useEffect(() => {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			setTuKhoaDaDebounce(tuKhoa.trim());
		}, 300);
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, [tuKhoa]);

	const duLieuLoc = useMemo(() => {
		let ds = dsBaiViet;
		if (trangThaiLoc !== 'tat_ca') ds = ds.filter((b) => b.trangThai === trangThaiLoc);
		if (tuKhoaDaDebounce) {
			const q = tuKhoaDaDebounce.toLowerCase();
			ds = ds.filter((b) => b.tieuDe.toLowerCase().includes(q));
		}
		return ds.sort((a, b) => b.ngayTao.localeCompare(a.ngayTao));
	}, [dsBaiViet, trangThaiLoc, tuKhoaDaDebounce]);

	const moModalThem = () => {
		setDangSua(null);
		form.resetFields();
		form.setFieldsValue({
			trangThai: 'nhap',
			tieuDe: '',
			tomTat: '',
			slug: '',
			noiDung: '',
			anhDaiDien: '',
			the: [],
		});
		setHienModal(true);
	};

	const moModalSua = (b: BaiViet) => {
		setDangSua(b);
		form.setFieldsValue({
			tieuDe: b.tieuDe,
			slug: b.slug,
			tomTat: b.tomTat,
			noiDung: b.noiDung,
			anhDaiDien: b.anhDaiDien,
			the: b.the,
			trangThai: b.trangThai,
		});
		setHienModal(true);
	};

	const xoa = (slug: string) => {
		setDsBaiViet((prev) => prev.filter((b) => b.slug !== slug));
		message.success('Đã xóa bài viết');
	};

	const luu = async () => {
		const giaTri = await form.validateFields();
		const now = new Date().toISOString();
		const slugTuDong = taoSlug(giaTri.slug || giaTri.tieuDe);
		if (!slugTuDong) {
			message.error('Slug không hợp lệ');
			return;
		}

		const slugTrung = duLieuLoc.some((b) => b.slug === slugTuDong && b.slug !== dangSua?.slug);
		if (slugTrung) {
			message.error('Slug đã tồn tại, hãy đổi tiêu đề hoặc slug');
			return;
		}

		if (!dangSua) {
			const baiMoi: BaiViet = {
				id: taoIdBaiViet(),
				tieuDe: giaTri.tieuDe,
				slug: slugTuDong,
				tomTat: giaTri.tomTat,
				noiDung: giaTri.noiDung,
				anhDaiDien: giaTri.anhDaiDien,
				the: giaTri.the || [],
				trangThai: giaTri.trangThai,
				ngayTao: now,
				ngayDang: giaTri.trangThai === 'da_dang' ? now : null,
				tacGia: { ten: 'Trương Công Chiến', avatar: 'https://i.pravatar.cc/120?img=12' },
				luotXem: 0,
			};
			setDsBaiViet((prev) => [baiMoi, ...prev]);
			message.success('Đã thêm bài viết');
		} else {
			setDsBaiViet((prev) =>
				prev.map((b) => {
					if (b.slug !== dangSua.slug) return b;
					const ngayDangMoi = giaTri.trangThai === 'da_dang' ? b.ngayDang || now : null;
					return {
						...b,
						tieuDe: giaTri.tieuDe,
						slug: slugTuDong,
						tomTat: giaTri.tomTat,
						noiDung: giaTri.noiDung,
						anhDaiDien: giaTri.anhDaiDien,
						the: giaTri.the || [],
						trangThai: giaTri.trangThai,
						ngayDang: ngayDangMoi,
					};
				}),
			);
			message.success('Đã cập nhật bài viết');
		}

		setHienModal(false);
		setDangSua(null);
	};

	const cot: ColumnsType<BaiViet> = [
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			key: 'tieuDe',
			render: (_, b) => (
				<Space direction='vertical' size={2}>
					<Text strong>{b.tieuDe}</Text>
					<Text type='secondary'>{b.slug}</Text>
				</Space>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 110,
			render: (v: TrangThaiBaiViet) => (
				<Tag color={v === 'da_dang' ? 'green' : 'default'}>{v === 'da_dang' ? 'Đã đăng' : 'Nháp'}</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'the',
			key: 'the',
			render: (ds: string[]) => (
				<Space size={[6, 6]} wrap>
					{(ds || []).map((t) => (
						<Tag key={t}>{t}</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'luotXem',
			key: 'luotXem',
			width: 90,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ngayTao',
			key: 'ngayTao',
			width: 130,
			render: (v: string) => moment(v).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			width: 220,
			render: (_, b) => (
				<Space>
					<Button size='small' onClick={() => moModalSua(b)}>
						Sửa
					</Button>
					<Button size='small' onClick={() => history.push(`/quan-ly-bai-viet/chi-tiet/${b.slug}`)} disabled={b.trangThai !== 'da_dang'}>
						Xem
					</Button>
					<Popconfirm title='Xóa bài viết này?' okText='Xóa' cancelText='Hủy' onConfirm={() => xoa(b.slug)}>
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
							Quản lý bài viết
						</Title>
					</Col>
					<Col xs={24} md={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button type='primary' onClick={moModalThem}>
							Thêm bài viết
						</Button>
					</Col>
				</Row>

				<Row gutter={[12, 12]}>
					<Col xs={24} md={10}>
						<Input value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} placeholder='Tìm theo tiêu đề...' allowClear />
					</Col>
					<Col xs={24} md={6}>
						<Select
							value={trangThaiLoc}
							onChange={(v) => setTrangThaiLoc(v)}
							style={{ width: '100%' }}
							options={[
								{ value: 'tat_ca', label: 'Tất cả trạng thái' },
								{ value: 'nhap', label: 'Nháp' },
								{ value: 'da_dang', label: 'Đã đăng' },
							]}
						/>
					</Col>
				</Row>

				<Table rowKey='id' columns={cot} dataSource={duLieuLoc} pagination={{ pageSize: 8 }} />
			</Space>

			<Modal
				visible={hienModal}
				onCancel={() => {
					setHienModal(false);
					setDangSua(null);
				}}
				onOk={luu}
				okText='Lưu'
				cancelText='Hủy'
				title={dangSua ? 'Sửa bài viết' : 'Thêm bài viết'}
				width={900}
				maskClosable={false}
			>
				<Form layout='vertical' form={form}>
					<Row gutter={12}>
						<Col xs={24} md={16}>
							<Form.Item name='tieuDe' label='Tiêu đề' rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
								<Input
									onChange={(e) => {
									if (dangSua) return;
									form.setFieldsValue({ slug: taoSlug(e.target.value) });
								}}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={8}>
							<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Nhập slug' }]}>
								<Input />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='tomTat' label='Tóm tắt' rules={[{ required: true, message: 'Nhập tóm tắt' }]}>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Row gutter={12}>
						<Col xs={24} md={12}>
							<Form.Item name='anhDaiDien' label='Ảnh đại diện (URL)' rules={[{ required: true, message: 'Nhập URL ảnh' }]}>
								<Input placeholder='https://...' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='the' label='Thẻ' rules={[{ required: true, message: 'Chọn ít nhất 1 thẻ' }]}>
								<Select mode='tags' placeholder='Nhập thẻ và enter' options={dsThe.map((t) => ({ value: t, label: t }))} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='trangThai' label='Trạng thái' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
						<Radio.Group
							options={[
								{ value: 'nhap', label: 'Nháp' },
								{ value: 'da_dang', label: 'Đã đăng' },
							]}
						/>
					</Form.Item>
					<Form.Item name='noiDung' label='Nội dung (Markdown)' rules={[{ required: true, message: 'Nhập nội dung' }]}>
						<Input.TextArea rows={10} placeholder='# Tiêu đề\n\nNội dung...' />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default QuanLyBaiViet;
