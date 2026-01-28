import { useState } from "react";
export default () => {
    const [dataSource, setDataSource] = useState([ 
        { 
            id: 'DH001', 
            customerName: 'Nguyễn Văn A', 
            phone: '0912345678', 
            address: '123 Nguyễn Huệ, Q1, TP.HCM', 
            products: [ { 
                productId: 1, 
                productName: 'Laptop Dell XPS 13', 
                quantity: 1, price: 25000000 
            } ], 
            totalAmount: 25000000, 
            status: 'Chờ xử lý', 
            createdAt: '2024-01-15' } 
    ])
    return {
        dataSource,
        setDataSource,
    }
}