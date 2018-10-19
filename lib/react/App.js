const React = require('react')
const {BrowserRouter, Link, Route} = require('react-router-dom')

module.exports = class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: []
    }
  }

  render() {
    return React.createElement(BrowserRouter, null,
      React.createElement('div', {itemScope: true},
        [
          React.createElement('div', {key: 'sidebar'}, // sidebar
            React.createElement('ul', {itemScope: true, itemProp: "games", itemType: "http://schema.org/ItemList"},
              this.state.games.map(game =>
                React.createElement('li', {key: game.id, itemScope: true},
                  React.createElement(Link, {to: `/games/${game.id}`, 'data-maker': game.makerName},
                    [
                      React.createElement('span', {
                        key: 'makerName',
                        itemProp: "makerName",
                        itemType: "http://schema.org/Text"
                      }, game.makerName),
                      ': ',
                      React.createElement('span', {
                        key: 'letterCount',
                        itemProp: "letterCount",
                        itemType: "http://schema.org/Integer"
                      }, game.letterCount)
                    ]
                  )
                )
              )
            )
          ),
          React.createElement('div', {key: 'main'},
            React.createElement(Route, {
              path: '/games/:gameId', render: ({match}) => {
                const game = this.state.games.find(game => game.id === match.params.gameId)
                return React.createElement(Game, {game})
              }
            })
          )
        ]
      )
    )
  }

  async componentDidMount() {
    // Subscribe for server side state changes
    await this.props.sub.subscribe('version', async () => {
      const games = await this.props.codebreaker.getGames()
      this.setState({games})
    })
  }
}

const Game = ({game}) => {
  return React.createElement(`div`, {className: 'game'}, // TODO: Hack for Selenium. Implement Microdata
    [
      React.createElement('h1', {key: 'title'},
        [
          React.createElement('span', {
              key: 'letterCount',
              itemScope: true,
              itemProp: 'letterCount',
              itemType: 'http://schema.org/Integer'
            },
            game.letterCount
          ),
          ` letter game`
        ]
      ),
      React.createElement('div', {key: 'maker'}, `Maker: ${game.makerName}`),
      React.createElement('div', {key: 'breaker'}, `Breaker: ${game.breakerName}`)
    ]
  )
}
