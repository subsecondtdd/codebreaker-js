const React = require('react')

module.exports = class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: []
    }
  }

  render() {

    return React.createElement('div', {},
      this.state.games.map(game =>
        React.createElement('form', {
            'data-game': 'Molly',
            key: game.id,
          },
          React.createElement('input', {
            type: 'submit',
            'data-maker': game.makerName,
            value: `${game.makerName}: ${game.letterCount}`,
            onClick: () => this.joinGame.bind(this)
          })
        )
      )
    )
  }

  async componentDidMount() {
    // Subscribe for server side state changes
    const subscriber = await this.props.pubSub.makeSubscriber()
    await subscriber.subscribe('version', async (version) => {
      const games = await this.props.codebreaker.getGames()
      this.setState({games})
    })
  }

  joinGame(evt) {
    console.log("EVT", evt)
    //this.props.codebreaker.joinGame(breakerName, makerName)
  }
}
