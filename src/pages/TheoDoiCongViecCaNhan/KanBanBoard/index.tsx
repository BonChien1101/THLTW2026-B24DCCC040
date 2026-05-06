import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Card, Col, Modal, Row, Space, Tag, Typography } from 'antd';
import React, { useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useModel } from 'umi';

const { Text } = Typography;

const tieuDeCot: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, string> = {
	can_lam: 'Cần làm',
	dang_lam: 'Đang làm',
	hoan_thanh: 'Hoàn thành',
};

const mauCot: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, string> = {
	can_lam: 'blue',
	dang_lam: 'gold',
	hoan_thanh: 'green',
};

const mauUuTien: Record<TheoDoiCongViecCaNhan.MucDoUuTien, string> = {
	Cao: 'red',
	'Trung bình': 'orange',
	Thấp: 'default',
};

const sapXepTheoDeadline = (a: TheoDoiCongViecCaNhan.CongViec, b: TheoDoiCongViecCaNhan.CongViec) => {
	const da = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
	const db = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
	return da - db;
};

const KanBanBoard: React.FC = () => {
	const {
		danhSachCongViec,
		doiTrangThaiHangLoat,
		xoaCongViec,
		setHienForm,
		setDangSua,
		setCongViecDangChon,
	} = useModel('theodoicongvieccanhan');

	const nhomTheoTrangThai = useMemo(() => {
		const ketQua: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, TheoDoiCongViecCaNhan.CongViec[]> = {
			can_lam: [],
			dang_lam: [],
			hoan_thanh: [],
		};
		danhSachCongViec.forEach((cv: TheoDoiCongViecCaNhan.CongViec) => {
			ketQua[cv.trangThai].push(cv);
		});
		(Object.keys(ketQua) as TheoDoiCongViecCaNhan.TrangThaiCongViec[]).forEach((k) => {
			ketQua[k].sort(sapXepTheoDeadline);
		});
		return ketQua;
	}, [danhSachCongViec]);

	return (
		<DragDropContext
			onDragEnd={(ketQuaKeoTha) => {
			if (!ketQuaKeoTha.destination) return;
			const { source, destination, draggableId } = ketQuaKeoTha;
			if (source.droppableId === destination.droppableId) return;
			doiTrangThaiHangLoat(draggableId, destination.droppableId as TheoDoiCongViecCaNhan.TrangThaiCongViec);
		}}
		>
			<Row gutter={[12, 12]}>
				{(Object.keys(tieuDeCot) as TheoDoiCongViecCaNhan.TrangThaiCongViec[]).map((trangThai) => (
					<Col xs={24} md={8} key={trangThai}>
						<Card title={<Space><Tag color={mauCot[trangThai]}>{tieuDeCot[trangThai]}</Tag><Text type='secondary'>{nhomTheoTrangThai[trangThai].length}</Text></Space>}>
							<Droppable droppableId={trangThai}>
								{(provided) => (
									<div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 260 }}>
										{nhomTheoTrangThai[trangThai].map((cv, index) => (
											<Draggable draggableId={cv.id} index={index} key={cv.id}>
												{(dragProvided, dragSnapshot) => (
													<div
														ref={dragProvided.innerRef}
														{...dragProvided.draggableProps}
														{...dragProvided.dragHandleProps}
														style={{
															padding: 12,
															border: '1px solid #f0f0f0',
															borderRadius: 8,
															background: dragSnapshot.isDragging ? '#fafafa' : '#fff',
															marginBottom: 10,
															...dragProvided.draggableProps.style,
														}}
													>
														<Space direction='vertical' size={4} style={{ width: '100%' }}>
															<Space style={{ justifyContent: 'space-between', width: '100%' }}>
																<Text strong>{cv.ten}</Text>
																<Space size={8}>
																	<EditOutlined
																		onClick={() => {
																			setDangSua(true);
																			setCongViecDangChon(cv);
																			setHienForm(true);
																		}}
																	/>
																	<DeleteOutlined
																		onClick={() => {
																			Modal.confirm({
																				title: 'Xóa task?',
																				icon: <ExclamationCircleOutlined />,
																				content: cv.ten,
																				onOk: () => xoaCongViec(cv.id),
																			});
																		}}
																	/>
																</Space>
															</Space>
															{cv.moTa ? <Text type='secondary'>{cv.moTa}</Text> : null}
															<Space size={6} wrap>
																<Tag color={mauUuTien[cv.mucDoUuTien]}>Ưu tiên: {cv.mucDoUuTien}</Tag>
																{cv.deadline ? (
																	<Tag color={new Date(cv.deadline).getTime() < Date.now() && cv.trangThai !== 'hoan_thanh' ? 'red' : 'default'}>
																		Deadline: {new Date(cv.deadline).toLocaleString()}
																	</Tag>
																) : null}
															</Space>
														</Space>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</Card>
					</Col>
				))}
			</Row>
		</DragDropContext>
	);
};

export default KanBanBoard;
