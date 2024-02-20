import { useEffect, useState } from "react"
import axios from "axios"

const LongPulling = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')


    useEffect(() => {
        getMess()
    }, [])

    const getMess = async () => {
        console.log("get mess")
        try {
            const {data} = await axios.get('http://localhost:5000/get-messages')
            setMessages(allMes => [data, ...allMes])
            await getMess()
        } catch (e) {
            console.log(e)
            setMessages(allMes => ["Error... Reconnect by 2 sec", ...allMes])
            setTimeout(() => {
                getMess()
            }, 2000)
        }

    }

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now()
        })
        getMess()
    }

    return (
        <div>
            <div>
                <input type="text" onChange={e => setValue(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((mess,i) =>
                    <div key={i}>{mess.message}</div>
                )}
            </div>
        </div>
    )
}

export default LongPulling