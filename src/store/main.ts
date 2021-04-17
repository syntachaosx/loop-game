import * as gameSaveUtils from '../utils/gameSave'
import moduleLoader from './moduleLoader'

interface Action {
  name: string
  payload: any
}

class Store {
  state = {}
  status = {}
  reducer
  mapper

  constructor () {
    const { state, reducer, mapper } = moduleLoader.init()
    this.state = state
    this.reducer = reducer
    this.mapper = mapper
    this.useMapper()
  }

  private useReducer (action) {
    const nextState = JSON.parse(JSON.stringify(this.state))
    this.reducer.forEach(r => {
      r({ prevState: this.state, nextState }, action)
    })
    this.state = nextState
  }

  private useMapper () {
    const nextStatus = JSON.parse(JSON.stringify(this.status))
    this.mapper.forEach(r => {
      r({ state: this.state, prevStatus: this.status, nextStatus })
    })
    this.status = nextStatus
  }

  dispatch (action: Action) {
    this.useReducer(action)
    this.useMapper()
  }

  load (game) {
    const gameState = preFlightArchvie(game)
    this.state = gameState
    this.useMapper()
  }
}

const preFlightArchvie = (a) => {
  return a
}

const initStore = () => {
  const store = new Store()
  gameSaveUtils.load().then((game) => {
    if (game) store.load(game)
  })
  return store
}

export const store = initStore()
