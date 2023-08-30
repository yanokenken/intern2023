// WebSocketのインスタンスを作成する
const ws = new WebSocket("ws://localhost:8080/ws");

// 自分のメッセージID
const _sentMessageId = Math.random().toString(36);

// WebSocketのイベントハンドラ
// 接続
ws.onopen = () => {
		console.log("Connected to the websocket");
};

// メッセージ受信
ws.onmessage = (e) => {
		const message = JSON.parse(e.data);
		if (getNameId() === message.id) {
				return;
		}
		console.log(message);
		showSentMsg(
			message.text,
			message.id,
			'chat-start',
			message.date
		);
};

// メッセージ送信
function sendMessage() {
		const messageInput = document.getElementById('message');
		const nameId = getNameId();
		// 日付フォーマット（hh:mm:ss）
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const time = `${hours}時${minutes}日${seconds}秒`;


		// メッセージを送信する
		const payload = {
				id: nameId,
				text: messageInput.value,
				date: time
		};

		ws.send(JSON.stringify(payload));
		messageInput.value = '';
		showSentMsg(payload.text, nameId, 'chat-end', payload.date+'');
}

// 送信の吹き出しを表示
function showSentMsg(message, nameId, className,time){
	// メッセージの吹き出しを作成
	const logArea = document.getElementById('log');
	let msgBubbleStr = `
		<div class="chat @class-name@">
			<div class="chat-header">
				@id@
				<time class="text-xs opacity-50">@time@</time>
			</div>
			<div class="chat-bubble"><pre>@message@</pre></div>
		</div>
	`;
	msgBubbleStr = msgBubbleStr.replace('@class-name@', className);
	msgBubbleStr = msgBubbleStr.replace('@id@', nameId);
	msgBubbleStr = msgBubbleStr.replace('@message@', message);
	msgBubbleStr = msgBubbleStr.replace('@time@', time);
	logArea.innerHTML += msgBubbleStr;

	// 一番下までスクロール
	logArea.scrollTop = logArea.scrollHeight;

}

function getNameId(){
	let myname = document.getElementById('my_name').value;
	return `${myname}@${_sentMessageId}`;
}