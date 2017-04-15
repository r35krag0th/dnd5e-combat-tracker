import React, { Component } from 'react';
import './App.css';
var classNames = require('classnames');
var FontAwesome = require('react-fontawesome');

class CombatTracker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            actors: props.actors || [],
            actor_count: props.actor_count || {},
            actor_rank: props.actor_rank || []
        }

        this.handleNewMonsterActor = this.handleNewMonsterActor.bind(this);
        this.handleActorMoveUp = this.handleActorMoveUp.bind(this);
        this.handleActorMoveDown = this.handleActorMoveDown.bind(this);

        // console.log(this.state);
    }

    componentDidMount() {
        console.log("~~~~~ Actors: ~~~~~");
        this.state.actors.forEach((actor) => {
                console.log(" + " + actor.getName());
                });
        if (this.state.actors.length === 0) {
            console.log("No actors exist.  Adding campaign PCs");

            this.handleNewPlayerActor("Sunniva Raven");
            this.handleNewPlayerActor("Rick O'Shea");
            this.handleNewPlayerActor("Mira Klose");
            this.handleNewPlayerActor("Sharra Fairweather");
        }
    }

    getActorCount(actorName) {
        // Example: "Goblin" would look for actorName == Goblin
        return this.state.actor_count[actorName] || 0;
    }

    handleNewPlayerActor(actorName) {
        console.log("===== Creating " + actorName + " ====");
        const actorId = actorName.replace(/[^a-zA-Z]/g, '');

        let newActorRank = this.state.actor_rank;
        newActorRank.push(actorId);

        // Update state, but append to the last known state
        this.setState((previousState) => ({
            actors: previousState.actors.concat([
                <CombatActorPlayer
                    key={actorId}
                    id={actorId}
                    name={actorName}
                    creature_type="player"
                    hookHandleMoveUp={this.handleActorMoveUp}
                    hookHandleMoveDown={this.handleActorMoveDown}
                    />
            ]),
            actor_rank: newActorRank,
        }));
    }

    handleNewMonsterActor(actorName) {
        console.log("===== Creating " + actorName + " =====");
        const currentActorCount = this.getActorCount(actorName);
        let actorSequenceId = currentActorCount + 1;

        const actorId = actorName + "_" + actorSequenceId;

        let newActorCount = this.state.actor_count;
        newActorCount[actorName] = actorSequenceId;

        let newActorRank = this.state.actor_rank;
        newActorRank.push(actorId);

        this.setState((previousState) => ({
            actors: previousState.actors.concat([
                <CombatActorMonster
                    key={actorId}
                    id={actorId}
                    sequenceId={actorSequenceId}
                    name={actorName}
                    hookHandleMoveUp={this.handleActorMoveUp}
                    hookHandleMoveDown={this.handleActorMoveDown}
                />
            ]),
            actor_count: newActorCount,
            actor_rank: newActorRank,
        }));

        console.log(this.state);
    }

    getActorById(actorId) {
        console.debug("===== getActorById :: " + actorId + " =====");
        var selectedActor = null;
        this.state.actors.forEach((actor) => {
            // console.log(actor);
            console.debug("      [Check] actor.id=" + actor.key + ", requestedActorId=" + actorId);
            if (actor.key === actorId) {
                console.debug("      [FOUND] " + actorId + " ===> " + actor.props.name);
                selectedActor = actor;
            }
        });
        return selectedActor;
    }

    getActorsInRankedOrder() {
        // NOTE: This can be improved by using getActorRank() and building the list "manually"
        var actorsInRankedOrder = [];
        this.state.actor_rank.forEach((actorId) => {
            var actor = this.getActorById(actorId);
            actorsInRankedOrder.push(actor);
        });

        return actorsInRankedOrder;
    }

    getActorRank(actorId) {
        return this.state.actor_rank.indexOf(actorId);
    }

    handleActorMoveUp(actorId) {
        // Get the current rank information
        var currentRanks = this.state.actor_rank;
        console.log("[Move Up :: " + actorId + " :: Before] " + currentRanks);
        // var totalRankedActors = currentRanks.length;

        // Get the actor's current position
        var actorPosition = this.getActorRank(actorId);

        // If they're already at the top.
        if (actorPosition === 0) {
            return;
        }

        // Get the previous position, and it's actorID
        var previousRank = actorPosition - 1;
        var actorToSwapWith = currentRanks[previousRank];

        if (previousRank < 0) {
            return;
        }

        currentRanks[previousRank] = actorId;
        currentRanks[actorPosition] = actorToSwapWith;

        console.debug("Previous Rank is " + previousRank + " -- " + actorToSwapWith);
        console.debug("Current Rank is " + actorPosition + " -- " + actorId);

        this.setState((previousState) => ({
            actor_rank: currentRanks
        }));

        // console.log("[Move Up :: " + actorId + " :: After] " + currentRanks);
    }

    handleActorMoveDown(actorId) {
        // Get the current rank information
        var currentRanks = this.state.actor_rank;
        var totalRankedActors = currentRanks.length;

        // Get the actor's current position
        var actorPosition = this.getActorRank(actorId);

        // If they're already at the bottom.
        if (actorPosition === totalRankedActors - 1) {
            console.debug("MoveDown -- Failing; Actor at bottom already");
            return;
        }

        // Get the previous position, and it's actorID
        var nextRank = actorPosition + 1;
        var actorToSwapWith = currentRanks[nextRank];

        if (nextRank < 0) {
            console.debug("MoveDown -- Failing; Actor would be negative in rank");
            return;
        }

        currentRanks[nextRank] = actorId;
        currentRanks[actorPosition] = actorToSwapWith;

        this.setState((previousState) => ({
            actor_rank: currentRanks
        }));
    }

    render() {
        // Now we need to get the actors in the rank order.
        var actorsInRankedOrder = this.getActorsInRankedOrder();
        return (
            <div className="CombatTracker">
                <div className="header">
                  <h2>Combat Tracker 5e</h2>
                </div>
                <div className="CombatTracker-ActorInput">
                    <ActorInput newActorHook={this.handleNewMonsterActor} />
                </div>
                <div className="CombatTracker-Actors">
                    {actorsInRankedOrder}
                </div>
            </div>
        );
    }
}

class CombatActor extends Component {
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

class CombatActorMonster extends CombatActor {
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

class CombatActorPlayer extends CombatActor {
    // constructor(props) {
    //     super(props);
    //
    //     this.handleMoveUp = this.handleMoveUp(this);
    //     this.handleMoveDown = this.handleMoveDown(this);
    // }

    componentDidMount() {
        this.setState((previousState) => ({
            creature_type: 'player', visible: true
        }));
    }

    render() {
        return this.baseRender(
        );
    }
}

class ActorInput extends Component {
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

class App extends Component {
    render() {
        return (
              <CombatTracker />
        );
    }
}

export default App;
