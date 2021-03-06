import React, { Component } from 'react';
import Swing from 'react-swing';
import { Direction } from 'swing';
import { connect } from 'react-redux';
import { addOtherUsers, sendMessage } from '../actions';
import { getOtherUsers } from '../Service';
import { sendInvite } from '../Service';

import Chat from '../components/chat'

const mockData = [{message:"hey LINDSEY", own:true, author: "me"},{message:"bye", own:false, author: "yomomma"},{message:"bye", own:false, author: "yopoppa"},{message:"bye", own:false, author: "yomomma"}]

class OtherUsersDeck extends Component {
  constructor(props) {
    super(props);
    this.fetchOtherUsers();
    this.rendered = 0;
  }

  fetchOtherUsers() {
    const eventId = this.props.computedMatch.params.eventId;
    getOtherUsers(eventId)
    .then(data => data.json())
    .then(data => {
      return data.filter(el => el.email !== this.props.authObj.email)
    })
    .then(data => this.props.addOtherUsers(data))
  }

  sendMessage = (msg) => {
    this.props.sendMessage(msg);
  }

  cardThrown = async (e) => {
    if(e.throwDirection === Direction.RIGHT){
      const eventId = this.props.computedMatch.params.eventId;
      console.log(eventId);
      const data = {
        eventId: eventId,
        emails: {
          currentUser: this.props.authObj,
          otherUser: {email:e.target.id, name:e.target.key}
        }
      }
      const invite = await sendInvite(data);
      console.log(invite);
      if (invite === 'email sent') {
        console.log('an email has been sent to the other user');
      }
    }
  }

  render() {
    this.rendered++
    const data = this.props.otherUsers;
    return (
      <div>
        <span>{this.props.date}</span>
        <Swing
          className="stack"
          tagName="div"
          setStack={(stack)=> this.setState({stack:stack})}
          ref="stack"
          throwout={this.rendered === 1 ? this.cardThrown : null}
        >
          {data.map(item =>
            <div id={item.email} key={item.name} className="Card">
              <img draggable={false} src={item.img} className="CardImage" alt="profile-pic"/>
              <h2>{item.name}</h2>
            </div>
          )}
        </Swing>
        <div>
          <Chat
            messages={mockData}
            onSendMessage={this.sendMessage}
          />
        </div>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authObj: state.auth.authObj,
  otherUsers: state.entities.otherUsers,
  date: state.entities.date
})

const mapDispatchToProps = (dispatch) => ({
  addOtherUsers: (eventId) => dispatch(addOtherUsers(eventId)),
  sendMessage: (msg) => dispatch(sendMessage(msg))
})

export default connect(mapStateToProps, mapDispatchToProps)(OtherUsersDeck);
