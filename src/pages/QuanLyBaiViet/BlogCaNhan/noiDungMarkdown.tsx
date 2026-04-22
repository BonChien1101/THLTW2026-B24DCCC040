import React from 'react';
import { Typography } from 'antd';

const NoiDungMarkdown: React.FC<{ noiDung: string }> = ({ noiDung }) => {
	const tachDong = (noiDung || '').replace(/\r\n/g, '\n').split('\n');
	return (
		<Typography>
			<div style={{ lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
				{tachDong.map((dong, i) => {
					const d = dong.trimEnd();
					if (d.startsWith('### ')) return <Typography.Title key={i} level={4}>{d.slice(4)}</Typography.Title>;
					if (d.startsWith('## ')) return <Typography.Title key={i} level={3}>{d.slice(3)}</Typography.Title>;
					if (d.startsWith('# ')) return <Typography.Title key={i} level={2}>{d.slice(2)}</Typography.Title>;
					if (d.startsWith('> ')) return <Typography.Paragraph key={i} type='secondary' style={{ marginBottom: 8 }}>{d.slice(2)}</Typography.Paragraph>;
					if (d.startsWith('- ')) return <Typography.Paragraph key={i} style={{ marginBottom: 4 }}>• {d.slice(2)}</Typography.Paragraph>;
					return <Typography.Paragraph key={i} style={{ marginBottom: 8 }}>{d}</Typography.Paragraph>;
				})}
			</div>
		</Typography>
	);
};

export default NoiDungMarkdown;
