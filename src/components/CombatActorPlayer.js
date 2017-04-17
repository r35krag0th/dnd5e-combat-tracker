// import React from 'react';
import CombatActor from './CombatActor';

export default class CombatActorPlayer extends CombatActor {
    componentDidMount() {
        this.setState((previousState) => ({
            creature_type: 'player', visible: true
        }));
    }

    render() {
        return this.baseRender();
    }
}

