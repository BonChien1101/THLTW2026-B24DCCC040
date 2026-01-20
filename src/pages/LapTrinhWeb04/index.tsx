import { Button } from 'antd';
import { Table} from 'antd';
import {useModel} from 'umi'


const LapTrinhWeb04 = () => {
    const dulieulaytuModel = useModel('LapTrinhWeb');
    const cot = [  
        
    ];

    const hang = [

    ];

    return (
        <>
            <h1>Lap Trinh Web 04</h1>
            <Table bordered dataSource={dulieulaytuModel.hang} columns={cot} pagination={false} />
        </>
    );
};

export default LapTrinhWeb04;