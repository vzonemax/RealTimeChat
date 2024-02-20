import React, { useState, useRef } from "react"

const WebSock = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [userName, setUserName] = useState("")

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                userName,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
            console.log("connect to server")
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log("socket close")
        }
        socket.current.onerror = () => {
            console.log("socket error")
        }
    }

    const sendMessage = async () => {
        const message = {
            userName,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div>
                <div>
                    <input type="text" placeholder="Enter your name" onChange={e => setUserName(e.target.value)} />
                    <button onClick={connect}>sign in</button>
                </div>
                <div>
                    {messages.map((mess, i) =>
                        <div key={i}>{mess.message}</div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div>
                <input type="text" placeholder="Enter your message" onChange={e => setValue(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((mess) =>
                    <div key={mess.id}>
                        {mess.event === 'connection'
                            ? <div>User {mess.userName} was connected</div>
                            : <div> {mess.userName}. {mess.message} </div>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default WebSock