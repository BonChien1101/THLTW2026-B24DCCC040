import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Card, Col, Divider, Empty, Row, Space, Tag, Typography } from 'antd';
import { history, useParams } from 'umi';
import moment from 'moment';
import type { BaiViet } from '../BlogCaNhan/kieuDuLieu';
import NoiDungMarkdown from '../BlogCaNhan/noiDungMarkdown';
import { docDanhSachBaiViet, tangLuotXem } from '../BlogCaNhan/luuTru';

const { Title, Text } = Typography;

const TrangChiTiet: React.FC = () => {
	const { slug } = useParams<{ slug: string }>(); // Lấy slug từ URL
	const [dsBaiViet, setDsBaiViet] = useState<BaiViet[]>([]);
	const bai = useMemo(() => dsBaiViet.find((b) => b.slug === slug) || null, [dsBaiViet, slug]);

	useEffect(() => { 
		setDsBaiViet(docDanhSachBaiViet());
	}, []);

	useEffect(() => {
		if (!slug) return;
		tangLuotXem(slug); // Tăng lượt xem khi vào trang chi tiết
		setDsBaiViet(docDanhSachBaiViet());
	}, [slug]);

	const dsLienQuan = useMemo(() => {
		if (!bai) return [];
		const tapThe = new Set(bai.the || []);
		return dsBaiViet
			.filter((b) => b.trangThai === 'da_dang' && b.slug !== bai.slug)
			.filter((b) => (b.the || []).some((t) => tapThe.has(t)))
			.sort((a, b) => (b.ngayDang || b.ngayTao).localeCompare(a.ngayDang || a.ngayTao))
			.slice(0, 6);
	}, [bai, dsBaiViet]);

	if (!bai || bai.trangThai !== 'da_dang')
		return (
			<Card>
				<Empty description='Không tìm thấy bài viết' />
				<div style={{ marginTop: 12 }}>
					<Button onClick={() => history.push('/quan-ly-bai-viet/trang-chu')}>Quay lại</Button>
				</div>
			</Card>
		);

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} lg={16}>
				<Card>
					<Space direction='vertical' style={{ width: '100%' }} size={12}>
						<Button onClick={() => history.push('/quan-ly-bai-viet/trang-chu')}>Quay lại</Button>
						<div>
							<Title level={2} style={{ marginBottom: 8 }}>
								{bai.tieuDe}
							</Title>
							<Space size={12} wrap>
								<Avatar src={bai.tacGia.avatar} />
								<Text>
									<b>{bai.tacGia.ten}</b>
								</Text>
								<Text type='secondary'>{moment(bai.ngayDang || bai.ngayTao).format('DD/MM/YYYY')}</Text>
								<Text type='secondary'>• {bai.luotXem} lượt xem</Text>
							</Space>
						</div>
						<Space size={[8, 8]} wrap>
							{(bai.the || []).map((t) => (
								<Tag key={t}>{t}</Tag>
							))}
						</Space>
						<Divider style={{ margin: '8px 0' }} />
						<div>
							<img
								alt={bai.tieuDe}
								src={bai.anhDaiDien}
								style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 8 }}
							/>
						</div>
						<Divider style={{ margin: '8px 0' }} />
						<NoiDungMarkdown noiDung={bai.noiDung} />
					</Space>
				</Card>
			</Col>
			<Col xs={24} lg={8}>
				<Card title='Bài viết liên quan'>
					{dsLienQuan.length === 0 ? (
						<Empty description='Chưa có bài liên quan' />
					) : (
						<Space direction='vertical' style={{ width: '100%' }} size={10}>
							{dsLienQuan.map((b) => (
								<Card
									key={b.slug}
									hoverable
									bodyStyle={{ padding: 12 }}
									onClick={() => history.push(`/quan-ly-bai-viet/chi-tiet/${b.slug}`)}
								>
									<Space direction='vertical' style={{ width: '100%' }} size={4}>
										<Text strong>{b.tieuDe}</Text>
										<Text type='secondary'>{moment(b.ngayDang || b.ngayTao).format('DD/MM/YYYY')}</Text>
									</Space>
								</Card>
							))}
						</Space>
					)}
				</Card>
			</Col>
		</Row>
	);
};

export default TrangChiTiet;
