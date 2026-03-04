import { useMemo, useState } from "react"
import {Input, Form, Button   } from "antd"
import { set } from "lodash";
export default () => {
    const [secret, setSecret] = useState<number>(Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState<number | undefined>(undefined);
    const [finished, setFinished] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [count, setCount] = useState<number>(0);
    const handleSubmit = () => {
        if (guess === undefined) {
            setStatus("Vui lòng nhập một số");
            return;
        }
        if (guess < 1 || guess > 100) {
            setStatus("Vui lòng nhập một số từ 1 đến 100");
            return;
        }
        if (count === 10) {
            setStatus("Bạn đã hết lượt đoán");
            setFinished(true);
            return;
        }
        setCount((prev) => {
            const newCount = (prev + 1);
            if (newCount === 10) {
                alert("Bạn đã hết lượt đoán, số bí mật là " + secret);
                
                setSecret(Math.floor(Math.random() * 100) + 1);
                setFinished(true);
                setCount(0);
            }
            return newCount;
        });

        if (secret === guess) {
            setStatus("Bạn đã đoán đúng!");
        } else if (guess < secret) {
            setStatus("Bạn đoán quá thấp!");
        } else if (guess > secret) {
            setStatus("Bạn đoán quá cao!");
        }
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
            <h1 style={{ color: "blue" }}>Đoán Số</h1>
            <Form onFinish={handleSubmit}>
                <Form.Item>
                    <Input
                        type="number"
                        placeholder="Nhập số bạn đoán..."
                        value={guess}
                        onChange={(e) => setGuess(Number(e.target.value))}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Đoán
                    </Button>
                    <Button type="default" style={{ marginLeft: "10px" }}  onClick={() => {
                        setGuess(undefined);
                        setStatus("");
                        setCount(0);
                        setSecret(Math.floor(Math.random() * 100) + 1);
                    }}>
                        Làm mới
                    </Button>
                </Form.Item>
            </Form>
            {status && <p style={{ color: status.includes("đoán đúng") ? "green" : "red",}}>{status}</p>}
            {count > 0 && <p>Bạn đã đoán {count} lần</p>}
        </div>
    )
}