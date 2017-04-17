import React, { Component } from 'react';
var FontAwesome = require('react-fontawesome');
var classNames = require('classnames');

export default class CombatActor extends Component {
    constructor(props) {
        super(props);

        console.log("CombatActor{id=" + props.id + ", name=" + props.name + "}");

        // Fuzzy Health Index
        // ==================
        //  0 = Healthy
        // +1 = Wounded
        // +2 = Heavily Wounded
        // +3 = Dead!
        this.state = {
            id: props.id || null,
            name: props.name || null,
            sequenceId: props.sequenceId || 0,
            fuzzy_health_index: props.fuzzy_health_index || 0,
            visible: props.visible || 0,
            creature_type: props.creature_type || 'monster',
        }

        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.retreatFuzzyHealthIndex = this.retreatFuzzyHealthIndex.bind(this);
        this.progressFuzzyHealthIndex = this.progressFuzzyHealthIndex.bind(this);

        this.handleMoveUp = this.handleMoveUp.bind(this);
        this.handleMoveDown = this.handleMoveDown.bind(this);
    }

    getId() {
        return this.key;
    }

    getName() {
        return this.state.name;
    }

    isVisible() {
        return this.state.visible === true;
    }

    isHealthy() {
        return this.state.fuzzy_health_index === 0;
    }

    isWounded() {
        return this.state.fuzzy_health_index === 1;
    }

    isHeavilyWounded() {
        return this.state.fuzzy_health_index === 2;
    }

    isDead() {
        return this.state.fuzzy_health_index === 3;
    }

    toggleVisibility(e) {
        e.preventDefault();
        this.setState((previousState) => ({
            visible: !previousState.visible
        }));
    }

    progressFuzzyHealthIndex(e) {
        e.preventDefault();
        if (this.state.fuzzy_health_index >= 3) {
            return;
        }
        this.setState((previousState) => ({
            fuzzy_health_index: previousState.fuzzy_health_index + 1
        }));
    }

    retreatFuzzyHealthIndex(e) {
        e.preventDefault();
        if (this.state.fuzzy_health_index <= 0) {
            return;
        }

        this.setState((previousState) => ({
            fuzzy_health_index: previousState.fuzzy_health_index - 1
        }));
    }

    handleMoveUp(e) {
        // console.log("^^^^^ Move [" + this.props.name + "] (" + this.props.id + ") Up ^^^^^");
        this.props.hookHandleMoveUp(this.props.id);
    }

    handleMoveDown(e) {
        // console.log("vvvvv Move [" + this.props.name + "] (" + this.props.id + ") Down vvvvv");
        this.props.hookHandleMoveDown(this.props.id);
    }

    isPlayer() {
        return this.state.creature_type === 'player';
    }

    isMonster() {
        return this.state.creature_type === 'monster';
    }

    getClassNames() {
        return classNames({
            'actor': true,
            'visible': this.isVisible(),
            'invisible': !this.isVisible(),
            'healthy': this.isHealthy(),
            'wounded': this.isWounded(),
            'heavily-wounded': this.isHeavilyWounded(),
            'dead': this.isDead(),
            'player': this.isPlayer(),
            'monster': this.isMonster()
        });
    }

    baseRender(extra_jsx) {
        var actorClasses = this.getClassNames();

        var suffixTags = [];
        if (!this.isVisible()) {
            suffixTags.push('Hidden');
        }

        if (this.isDead()) {
            suffixTags.push('Dead');
        }
        const renderedSuffixTags = " (" + suffixTags.join(", ") + ")";

        return (
            <div className={actorClasses} key={this.props.id}>
                <span className="rankControls">
                    <a href="#" className="orderUp" onClick={this.handleMoveUp}>
                        <FontAwesome
                            name="chevron-up"
                            size="2x"
                            />
                    </a>
                    <a href="#" className="orderDown" onClick={this.handleMoveDown}>
                        <FontAwesome
                            name="chevron-down"
                            size="2x"
                            />
                    </a>
                </span>

                <span className="actorName">
                    {this.props.name} {this.props.sequenceId}{suffixTags.length > 0 ? renderedSuffixTags : ''}
                </span>

                {extra_jsx}
            </div>
        );
    }
}
