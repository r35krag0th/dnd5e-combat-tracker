import React, { Component } from 'react';

export default class ActorInput extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            actorName: props.actorName || ''
        }
    }

    handleChange(e) {
        console.log("ActorInput Changed... --> " + e.target.value);
        this.setState({
            actorName: e.target.value
        });
    }

    handleSubmit(e) {
        console.log("ActorInput being added --> " + this.state.actorName);

        this.props.newActorHook(this.state.actorName);
    }

    render() {
        const actorName = this.props.actorName;
        return (
            <div className="actorInput">
                <input type="text" name="actorInput" value={actorName} onChange={this.handleChange} />
                <button onClick={this.handleSubmit}>
                    Add
                </button>
            </div>
        );
    }
}

