import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Col, Empty, Input, Pagination, Row, Space, Tag, Typography } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import type { BaiViet } from '../BlogCaNhan/kieuDuLieu';
import { luuBaiVietDangXem } from '../BlogCaNhan/luuTru';
import { useBlogCaNhan } from '../BlogCaNhan/useBlogCaNhan';

const { Title, Text, Paragraph } = Typography;

const KICH_THUOC_TRANG = 9;

const TrangChuBlog: React.FC = () => {
	const { dsBaiViet, dsThe } = useBlogCaNhan();
	const [tuKhoa, setTuKhoa] = useState('');
	const [tuKhoaDaDebounce, setTuKhoaDaDebounce] = useState('');
	const [theDangChon, setTheDangChon] = useState<string | null>(null);
	const [trang, setTrang] = useState(1);
	const timer = useRef<number | null>(null);

	useEffect(() => {
		const { query } = history.location as any;
		const tuKhoaQuery = typeof query?.q === 'string' ? query.q : '';
		const theQuery = typeof query?.tag === 'string' ? query.tag : null;
		const trangQuery = typeof query?.page === 'string' ? Number(query.page) : 1;
		setTuKhoa(tuKhoaQuery);
		setTuKhoaDaDebounce(tuKhoaQuery.trim());
		setTheDangChon(theQuery);
		setTrang(Number.isFinite(trangQuery) && trangQuery > 0 ? trangQuery : 1);
	}, []);

	const dayQueryLenUrl = (capNhat: { q?: string; tag?: string | null; page?: number }) => {
		const { query } = history.location as any;
		const moi = {
			...query,
			...(capNhat.q !== undefined ? { q: capNhat.q || undefined } : {}),
			...(capNhat.tag !== undefined ? { tag: capNhat.tag || undefined } : {}),
			...(capNhat.page !== undefined ? { page: capNhat.page && capNhat.page > 1 ? String(capNhat.page) : undefined } : {}),
		};
		history.replace({ pathname: '/quan-ly-bai-viet/trang-chu', query: moi });
	};

	useEffect(() => {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			setTuKhoaDaDebounce(tuKhoa.trim());
			setTrang(1);
			dayQueryLenUrl({ q: tuKhoa.trim(), page: 1 });
		}, 300);
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, [tuKhoa]);

	const dsDaDang = useMemo(() => dsBaiViet.filter((b) => b.trangThai === 'da_dang'), [dsBaiViet]);

	const dsLoc = useMemo(() => {
		let ds: BaiViet[] = dsDaDang;
		if (theDangChon) ds = ds.filter((b) => (b.the || []).includes(theDangChon));
		if (tuKhoaDaDebounce) {
			const q = tuKhoaDaDebounce.toLowerCase();
			ds = ds.filter((b) => {
				const gop = `${b.tieuDe} ${b.tomTat} ${(b.the || []).join(' ')}`.toLowerCase();
				return gop.includes(q);
			});
		}
		return ds.sort((a, b) => (b.ngayDang || b.ngayTao).localeCompare(a.ngayDang || a.ngayTao));
	}, [dsDaDang, theDangChon, tuKhoaDaDebounce]);

	const tong = dsLoc.length;
	const batDau = (trang - 1) * KICH_THUOC_TRANG;
	const dsHienThi = dsLoc.slice(batDau, batDau + KICH_THUOC_TRANG);

	const xuLyChonThe = (the: string) => {
		setTheDangChon((cu) => {
			const moi = cu === the ? null : the;
			dayQueryLenUrl({ tag: moi, page: 1 });
			return moi;
		});
		setTrang(1);
	};

	const moChiTiet = (b: BaiViet) => {
		luuBaiVietDangXem(b.slug);
		history.push(`/quan-ly-bai-viet/chi-tiet/${b.slug}`);
	};

	return (
		<Card>
			<Space direction='vertical' style={{ width: '100%' }} size={16}>
				<div>
					<Title level={3} style={{ marginBottom: 4 }}>
						Blog cá nhân
					</Title>
					<Text type='secondary'>Khám phá bài viết, lọc theo thẻ và tìm kiếm nhanh</Text>
				</div>
				<Row gutter={[12, 12]} align='middle'>
					<Col xs={24} md={10}>
						<Input.Search
							value={tuKhoa}
							onChange={(e) => setTuKhoa(e.target.value)}
							placeholder='Tìm theo tiêu đề, tóm tắt hoặc thẻ...'
							allowClear
						/>
					</Col>
					<Col xs={24} md={14}>
						<Space size={[8, 8]} wrap>
							{dsThe.map((t) => (
								<Tag
									key={t}
									color={theDangChon === t ? 'blue' : 'default'}
									onClick={() => xuLyChonThe(t)}
									style={{ cursor: 'pointer', userSelect: 'none' }}
								>
									{t}
								</Tag>
							))}
						</Space>
					</Col>
				</Row>

				{dsHienThi.length === 0 ? (
					<Empty description='Không có bài viết phù hợp' />
				) : (
					<Row gutter={[16, 16]}>
						{dsHienThi.map((b) => (
							<Col key={b.id} xs={24} sm={12} lg={8}>
								<Card
									hoverable
									cover={
										<div style={{ height: 160, overflow: 'hidden' }}>
											<img
												alt={b.tieuDe}
												src={b.anhDaiDien}
												style={{ width: '100%', height: '160px', objectFit: 'cover' }}
											/>
										</div>
									}
									onClick={() => moChiTiet(b)}
								>
									<Space direction='vertical' style={{ width: '100%' }} size={8}>
										<div>
											<Title level={5} style={{ marginBottom: 0 }}>
												{b.tieuDe}
											</Title>
											<Text type='secondary'>
												{moment(b.ngayDang || b.ngayTao).format('DD/MM/YYYY')} · {b.tacGia.ten}
											</Text>
										</div>
										<Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
											{b.tomTat}
										</Paragraph>
										<Space size={[8, 8]} wrap>
											{(b.the || []).map((t) => (
												<Tag key={`${b.id}-${t}`} onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													xuLyChonThe(t);
												}} style={{ cursor: 'pointer' }}>
													{t}
												</Tag>
											))}
										</Space>
									</Space>
								</Card>
							</Col>
						))}
					</Row>
				)}

				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Pagination
						current={trang}
						pageSize={KICH_THUOC_TRANG}
						total={tong}
						showSizeChanger={false}
						onChange={(p) => {
							setTrang(p);
							dayQueryLenUrl({ page: p });
						}}
					/>
				</div>
			</Space>
		</Card>
	);
};

export default TrangChuBlog;
