import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/messages")
      .then(res => res.json())
      .then(setMessages);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Mensagens WhatsApp</h1>

      {messages.map(msg => (
        <div
          key={msg._id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10
          }}
        >
          <strong>{msg.from}</strong>

          {msg.type === "text" && (
            <p>{msg.text}</p>
          )}

          {msg.type === "audio" && (
            <audio controls src={msg.audioUrl} />
          )}
        </div>
      ))}
    </div>
  );
}
