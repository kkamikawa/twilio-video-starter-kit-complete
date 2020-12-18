import React, {Component} from 'react';
import './App.scss';
import Participant from './Participant';

class Room extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //参加者一覧をmapオブジェクトから配列に変更する
            remoteParticipants: Array.from(this.props.room.participants.values())
        }

    }

    //コンポーネントがマウント時に一回呼ばれる
    componentDidMount() {
        // 参加者が接続・切断された時のためのイベントリスナーを設置
        this.props.room.on('participantConnected', participant => this.addParticipant(participant));
        this.props.room.on('participantDisconnected', participant => this.removeParticipant(participant));

        //ローカル参加者がブラウザウィンドウを閉じると、参加者がルームから削除される
        window.addEventListener("beforeunload", this.leaveRoom);
    }

    //コンポーネントがアンマウントされたときにも切断
    componentWillUnmount() {
        this.leaveRoom();
    }

    //新規参加者をStateに追加
    addParticipant = (participant) => {
        console.log(`${participant.identity} がルームに参加しました。`);

        this.setState({
            remoteParticipants: [...this.state.remoteParticipants, participant]
        });
        }

    //退出者をStateから除外
    removeParticipant = (participant) => {
        console.log(`${participant.identity} がルームから退出しました。`);

        this.setState({
            remoteParticipants: this.state.remoteParticipants.filter(p => p.identity !== participant.identity)
        });
    }

    //ルームを退出
    leaveRoom = () => {
        this.props.room.disconnect();
        this.props.returnToLobby();
    }

    render() {
        return (
            <div className="room">
                <div className = "participants">
                    {/*ローカルの参加者を先に表示*/}
                    <Participant
                        key={this.props.room.localParticipant.identity}
                        localParticipant="true"
                        participant={this.props.room.localParticipant}/>
                    {
                        /*リモート参加者を表示*/
                        this.state.remoteParticipants.map(
                            participant => <Participant key={participant.identity} participant={participant}/>
                        )
                    }
                </div>
                <button id="leaveRoom" onClick={this.leaveRoom}>ルームから退出</button>
            </div>
        );
    }

}

export default Room;
