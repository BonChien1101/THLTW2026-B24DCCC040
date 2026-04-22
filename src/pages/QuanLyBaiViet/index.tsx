import React, { useMemo } from 'react';
import { Button, Menu, Space } from 'antd';
import type { MenuProps } from 'antd';
import { history } from 'umi';

const QuanLyBlogCaNhanLayout: React.FC<any> = (props) => {
    const duongDan = history.location.pathname;
    const khoaMacDinh = useMemo(() => {
        if (duongDan.includes('/trang-chu')) return 'trang-chu';
        if (duongDan.includes('/chi-tiet')) return 'trang-chi-tiet';
        if (duongDan.includes('/gioi-thieu')) return 'trang-gioi-thieu';
        if (duongDan.includes('/the')) return 'trang-the';
        if (duongDan.includes('/quan-ly')) return 'trang-quan-ly';
        return 'trang-chu';
    }, [duongDan]);

    const items: MenuProps['items'] = [
        { key: 'trang-chu', label: 'Trang Chủ' },
        { key: 'trang-gioi-thieu', label: 'Giới Thiệu' },
        { key: 'trang-quan-ly', label: 'Quản Lý Bài Viết' },
        { key: 'trang-the', label: 'Quản Lý Thẻ' },
    ];

    const xuLyChuyenTrang = (khoa: string) => {
        switch (khoa) {
            case 'trang-chu':
                history.push({ pathname: '/quan-ly-bai-viet/trang-chu', query: {} });
                return;
            case 'trang-gioi-thieu':
                history.push('/quan-ly-bai-viet/gioi-thieu');
                return;
            case 'trang-quan-ly':
                history.push('/quan-ly-bai-viet/quan-ly');
                return;
            case 'trang-the':
                history.push('/quan-ly-bai-viet/the');
                return;
            default:
                return;
        }
    };

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Menu
                    mode='horizontal'
                    selectedKeys={[khoaMacDinh]}
                    items={items}
                    onClick={(info) => {
                        xuLyChuyenTrang(info.key);
                    }}
                    style={{ flex: 1 }}
                />
                <Button type='primary' onClick={() => history.push('/quan-ly-bai-viet/quan-ly')}>
                    Viết bài
                </Button>
            </Space>
            <div style={{ marginTop: 16 }}>{(props as any).children}</div>
        </div>
    );
};

export default QuanLyBlogCaNhanLayout;
