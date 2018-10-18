const React = require('react')

module.exports = class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      games: []
    }
  }

  render() {
    return React.createElement('ul', {},
      this.state.games.map(game =>
        React.createElement('li', {key: game.id},
          React.createElement('button', {
            'data-maker': game.makerName,
            onClick: () => {
              console.log('CLICK')
              this.joinGame()
            }
          }, `${game.makerName}: ${game.letterCount}`)
        )
      )
    )
  }

  async componentDidMount() {
    // Subscribe for server side state changes
    const subscriber = await this.props.pubSub.makeSubscriber()
    await subscriber.subscribe('version', async () => {
      const games = await this.props.codebreaker.getGames()
      this.setState({games})
    })
  }

  joinGame(evt) {
    console.log("EVT", evt)
    //this.props.codebreaker.joinGame(breakerName, makerName)
  }
}
