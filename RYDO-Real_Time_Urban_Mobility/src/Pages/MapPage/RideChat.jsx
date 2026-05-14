import {
  useEffect,
  useRef,
  useState,
} from 'react';

import './RideChat.css';

function formatTime(ts) {
  const d = new Date(
    ts || Date.now()
  );

  return d.toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );
}

export default function RideChat({
  messages,
  currentRole,
  onSend,
}) {
  const [text, setText] =
    useState('');

  const boxRef =
    useRef(null);

  useEffect(() => {
    if (!boxRef.current)
      return;

    boxRef.current.scrollTop =
      boxRef.current
        .scrollHeight;
  }, [messages?.length]);

  const submit = (e) => {
    e.preventDefault();

    const trimmed =
      text.trim();

    if (!trimmed) return;

    onSend?.(trimmed);

    setText('');
  };

  return (
    <div className="ride-chat">
      {/* HEADER */}
      <div className="chat-header">
        <div>
          <h3>
            Live Ride Chat
          </h3>

          <p className="chat-hint">
            Chat with your
            driver or
            passenger in
            realtime.
          </p>
        </div>

        <div className="chat-live">
          <span className="live-dot"></span>

          LIVE
        </div>
      </div>

      {/* MESSAGES */}
      <div
        className="messages-box"
        ref={boxRef}
      >
        {!messages ||
        messages.length ===
          0 ? (
          <div className="chat-empty-wrapper">
            <p className="chat-empty">
              No messages
              yet
            </p>

            <small>
              Start the
              conversation
            </small>
          </div>
        ) : (
          messages.map((m) => {
            const mine =
              m.role ===
              currentRole;

            const cls = [
              'message',

              mine
                ? 'mine'
                : '',

              m.role ===
              'system'
                ? 'system'
                : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                className={
                  cls
                }
                key={
                  m.id ||
                  `${m.ts}-${m.text}`
                }
              >
                {m.role !==
                  'system' && (
                  <div className="meta">
                    <span>
                      {mine
                        ? 'You'
                        : m.userName ||
                          m.role}
                    </span>

                    <span>
                      {formatTime(
                        m.ts
                      )}
                    </span>
                  </div>
                )}

                <p>
                  {m.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT */}
      <form
        className="chat-form"
        onSubmit={submit}
      >
        <input
          value={text}
          onChange={(e) =>
            setText(
              e.target
                .value
            )
          }
          placeholder="Type your message..."
        />

        <button
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}