import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { useModel } from 'umi';
import title from '@/locales/vi-VN/global/title';
export default () => {
    const {dataSource, setDataSource} = useModel('danhsachdonhang');


    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Danh Mục',
            dataIndex: 'category',
            key: 'category',
            width: 200,
        },
        {
            title: 'Giá Cả',
            dataIndex: 'price',
            key: 'price',
            width: 200,
        },
        {
            title: 'Số Lượng Tồn Kho',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 200,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            width: 200,
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 200,
            render: (_: any, record: any) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => {
                            
                        }}
                    >
                        Sửa
                    </Button>
                    <span style={{ margin: '0 8px' }} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa sản phẩm này?"
                        onConfirm={() => {
                            const danhsachSPmoi = dataSource.filter((item: any) => item.id !== record.id);
                            setDataSource(danhsachSPmoi);
                            message.success('Đã xóa');
                        }}
                       
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>
                            Xoá
                        </Button>
                    </Popconfirm>
                </>
            ),

        },
    ];
    return <Table columns={columns} dataSource={dataSource} />;
}