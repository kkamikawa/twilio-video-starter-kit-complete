import './App.scss';
import React, {Component} from 'react';
import Room from './Room';
const { connect } = require('twilio-video');

class App extends Component {
    constructor(props){
        super(props)

        this.state = {
            identity: '',
            room: null
        }

        this.inputRef = React.createRef();

    }

    //ルームに参加する
    joinRoom = async () => {
        try {
            //作成したアクセストークン取得のエンドポイントを指定
            const {REACT_APP_ENDPOINT} = process.env;
            const response = await fetch(`${REACT_APP_ENDPOINT}/token?identity=${this.state.identity}`);
            const data = await response.json();
            const room = await connect(data.accessToken, {
            name: 'cool-room',//今回はテストなのでルーム名は固定
            audio: true,
            video: true
            });

            this.setState({ room: room });
        } catch(err) {
            console.log(err);
        }
    }

    //ルーム名を空にしてロビー画面にもどる
    returnToLobby = () => {
        this.setState({ room: null });
    }

    //入力時にプレースホルダーを空にする
    removePlaceholderText = () => {
        this.inputRef.current.placeholder = '';
    }

    //入力時にStateにidentityとして入力値をセット
    updateIdentity = (event) => {
        this.setState({
            identity: event.target.value
        });
    }

    render() {
        //ユーザーが名前を入力したときのみボタンを有効にするためのフラグ
        const disabled = this.state.identity === '' ? true : false;

        return (
            <div className="app">
            {
                this.state.room === null
                ? <div className="lobby">
                    <input
                        value={this.state.identity} 
                        onChange={this.updateIdentity} 
                        ref={this.inputRef}
                        onClick={this.removePlaceholderText}
                        placeholder="名前を入力してください"/>
                    <button
                        disabled={disabled}
                        onClick={this.joinRoom}>
                        ルームに参加
                    </button>
                </div>
                : <Room returnToLobby={this.returnToLobby} room={this.state.room} />
            }
            </div>
        );
    }

}

export default App;
