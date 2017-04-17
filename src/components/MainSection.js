import React, { Component, PropTypes } from 'react'
import CombatActorPlayer from './CombatActorPlayer'
import Footer from './Footer'
import { SHOW_ALL, SHOW_DEAD, SHOW_MONSTERS, SHOW_NCPS, SHOW_PLAYERS } from '../constants/ActorFilters'

const ACTOR_FILTERS = {
    [SHOW_ALL]: () => true,
    [SHOW_PLAYERS]: actor => actor.creatureType === 'player',
    [SHOW_DEAD]: actor => actor.isDead(),
    [SHOW_MONSTERS]: actor => actor.creatureType === 'monster',
    [SHOW_NCPS]: actor => actor.creatureType === 'npc'
}

export default class MainSection extends Component {
    static propTypes = {
        playerActors: PropTypes.array.isRequired,
        monsterActors: PropTypes.array.isRequired,
        npcActors: PropTypes.array.isRequired
    }

    state = {
        filter: SHOW_ALL
    }

    handleClearDead = () => {
        this.props.actions.clearDead()
    }

    handleShow = filter => {
        this.setState({ filter })
    }

    renderToggleAll(deadCount) {
        const { actors, actions } = this.props;
        if (actors.length > 0) {
            return (
                <span>ToggleAll</span>
            )
        }
    }

    renderFooter(deadCount) {
        const { actors } = this.props;
        const { filter } = this.state;
        const activeCount = actors.length - deadCount;

        if (actors.length) {
            return (
                <Footer

                    />
            )
        }
    }

    render() {
        const { actors, actions } = this.props
        const { filter } = this.state

        const filteredActors = actors.filter(ACTOR_FILTERS[filter])
        const deadCount = actors.reduce((count, actor) =>
            actor.isDead() ? count + 1 : count, 0
        )

        return (
            <section className="main">
                {this.renderToggleAll()}

                <ul className="actor-list">
                    {filteredActors.map(actor =>
                        <CombatActorPlayer key={actor.getId()} name=""/>
                    )}
                </ul>
            </section>
        )
    }

}
