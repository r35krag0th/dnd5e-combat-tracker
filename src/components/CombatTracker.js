import React, { Component } from 'react';
import CombatActorPlayer from './CombatActorPlayer';
import CombatActorMonster from './CombatActorMonster';
import ActorInput from './ActorInput';

export default class CombatTracker extends Component {
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
            this.handleNewPlayerActor("Valindra");
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
