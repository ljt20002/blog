import { Button, Form, Input } from "@arco-design/web-react"
import { useRef, useState } from "react"

const Test = ()=>{
    const id = useRef(0)
    const [form,setForm] = useState<any>({})
    return <>
    <Form>
        {
            Object.keys(form).map((i,index)=>{
                return <Form.Item key={index} >
                    <Input placeholder="请输入" />
                    <Button onClick={()=>{
                        const middle = JSON.parse(JSON.stringify(form))
                        delete middle[i]
                        setForm(middle)
                    }}>删除</Button>
                </Form.Item>
            })
        }
    </Form>
    <Button onClick={()=>{
        setForm({
            ...form,
           [id.current++]: {}
        })
    }}>新增条件组</Button>
    </>
}
export default Test