import { Table, Button, Card, Typography } from 'antd'
import { useState } from 'react'
const { Title } = Typography;

type Choice = "rock" | "paper" | "scissors";

type HistoryItem = {
    player: Choice;
    computer: Choice;
    result: string;
};

export default function OanTuTi() {
    const choices: Choice[] = ["rock", "paper", "scissors"];
    const [player,setPlayer] = useState<Choice | null>(null)
    const [computer,setComputer] = useState<Choice | null>(null)
    const [result,setResult] = useState<string>("")
    const [history,setHistory] = useState<HistoryItem[]>([])
    const playgame = (choice: Choice) => {
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        setPlayer(choice)
        setComputer(computerChoice)
        let roundResult = ""
        if (choice === computerChoice) {
            roundResult = "Hoà!"
        } else if (
            (choice === "rock" && computerChoice === "scissors") ||
            (choice === "paper" && computerChoice === "rock") ||
            (choice === "scissors" && computerChoice === "paper")
        ) {
            roundResult = "Bạn thắng!"
        } else {
            roundResult = "Bạn thua!"
        }
        setResult(roundResult)
        const newHistory: HistoryItem = {
            player: choice,
            computer: computerChoice,
            result: roundResult
        };

        setHistory((prevHistory) => [newHistory, ...prevHistory]);
    };

    const columns = [
        { title: "Ván", dataIndex: "round" },
        { title: "Người chơi", dataIndex: "player" },
        { title: "Máy", dataIndex: "computer" },
        { title: "Kết quả", dataIndex: "result" }
    ];
    return (
        <>
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <Title>Trò Chơi Oẳn Tù Tì</Title>

                <Card style={{ width: 400, margin: "auto" }}>
                    <Button onClick={() => playgame("rock")}>Búa</Button>
                    <Button onClick={() => playgame("paper")} style={{ margin: "0 10px" }}>
                        Bao
                    </Button>
                    <Button onClick={() => playgame("scissors")}>Kéo</Button>

                    <div style={{ marginTop: 20 }}>
                        <p>Người chơi: {player}</p>
                        <p>Máy tính: {computer}</p>
                        <Title level={3}>{result}</Title>
                    </div>
                </Card>
            </div>
            <h1>Lịch sử chơi</h1>
            <Table
                dataSource={history.map((item, index) => ({ ...item, round: index + 1 }))}
                columns={columns}
                rowKey="round"
            />
        </>
    );
}