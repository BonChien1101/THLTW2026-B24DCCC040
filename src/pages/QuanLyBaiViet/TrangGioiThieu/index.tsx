import React from 'react';
import { Avatar, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { FacebookFilled, GithubOutlined, MailOutlined, } from '@ant-design/icons';

const { Title, Text } = Typography;

const TrangGioiThieu: React.FC = () => {
	const tacGia = {
		ten: 'Trương Công Chiến',
		avatar: 'https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-1/670656019_3935099566626168_108047487248855275_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHhmBTxVItbEAG-KkbJ_532J7FTNz7mCe8nsVM3PuYJ710ldEfQsTHcLhto2-qUoPYUISbqXU1lkvKYv6AHAKCj&_nc_ohc=ZJlPYUccUacQ7kNvwHy_vb2&_nc_oc=AdoCwkPELAfHp9rFhlJ9zHHB6TRBZWVmXS5pKfBA2q3j_wbSju7sk_HpeGLIaobNu6E&_nc_zt=24&_nc_ht=scontent.fhan5-6.fna&_nc_gid=ptTIAgLWnU2mdVannTCEXQ&_nc_ss=7a3a8&oh=00_Af0k8k5V0OFCcYiMF9rxt3IrbPeFbFjLR3BRP_KwUUvb1Q&oe=69EE5263',
		tieuSu:
			'Là sinh viên yêu thích lập trình web. Mục tiêu của blog là ghi lại kiến thức và chia sẻ trải nghiệm học tập, dự án.',
		kyNang: ['React', 'TypeScript', 'Ant Design', 'Node.js', 'UI/UX', 'JavaScript', 'Python'],
		lienKet: [
			{ nhan: 'Email', bieuTuong: <MailOutlined />, giaTri: 'chiensenpaiii2006@gmail.com' },
			{ nhan: 'GitHub', bieuTuong: <GithubOutlined />, giaTri: 'https://github.com/BonChien1101/THLTW2026-B24DCCC040' },
			{ nhan: 'Facebook', bieuTuong: <FacebookFilled />, giaTri: 'https://www.facebook.com/chien11012006' },
		],
	};

	return (
		<Card>
			<Row gutter={[16, 16]} align='middle'>
				<Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
					<Space direction='vertical' align='center' size={8}>
						<Avatar size={120} src={tacGia.avatar} />
						<Title level={3} style={{ margin: 0 }}>
							{tacGia.ten}
						</Title>
						<Text type='secondary'>Tác giả</Text>
					</Space>
				</Col>
				<Col xs={24} md={16}>
					<Title level={4} style={{ marginTop: 0 }}>
						Giới thiệu
					</Title>
					<Text>{tacGia.tieuSu}</Text>
					<Divider />
					<Title level={5} style={{ marginBottom: 8 }}>
						Kỹ năng
					</Title>
					<Space size={[8, 8]} wrap>
						{tacGia.kyNang.map((k) => (
							<Tag key={k} color='blue'>
								{k}
							</Tag>
						))}
					</Space>
					<Divider />
					<Title level={5} style={{ marginBottom: 8 }}>
						Liên kết
					</Title>
					<Space direction='vertical' size={6}>
						{tacGia.lienKet.map((l) => (
							<Space key={l.nhan} size={10}>
								{l.bieuTuong}
								<Text strong>{l.nhan}:</Text>
								<Text>{l.giaTri}</Text>
							</Space>
						))}
					</Space>
				</Col>
			</Row>
		</Card>
	);
};

export default TrangGioiThieu;
