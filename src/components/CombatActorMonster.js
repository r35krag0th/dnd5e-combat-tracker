import React from 'react';
import CombatActor from './CombatActor';
var FontAwesome = require('react-fontawesome');

export default class CombatActorMonster extends CombatActor {
    // constructor(props) {
    //     super(props);
    //
    //     // this.setState({creature_type: 'monster'});
    // }

    componentDidMount() {
        this.setState((previousState) => ({
            creature_type: 'monster'
        }));
    }

    render() {
        const isShown = this.isVisible()
        return this.baseRender(
                <div className="generalControls">
                    <a href="#" onClick={this.toggleVisibility}>
                        <FontAwesome
                            name={isShown === true ? "eye-slash" : "eye"}
                            size="lg"
                            />
                    </a>
                    <a href="#" onClick={this.progressFuzzyHealthIndex}>
                        <FontAwesome
                            name="heart-o"
                            size="lg"
                            />
                    </a>
                    <a href="#" onClick={this.retreatFuzzyHealthIndex}>
                        <FontAwesome
                            name="heart"
                            size="lg"
                            />
                    </a>
                </div>
        );
    }
}
