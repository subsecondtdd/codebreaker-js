# Colibri

Colibri is a Cucumber-js extension that lets you run acceptance tests in milliseconds:

* Full stack UI and back-end without HTTP
* Full stack UI and back-end with HTTP
* Just the HTTP API
* Just the domain logic

```
|           |  domain   |    dom    | dom-http  |   http    | webdriver |
| WebDriver |           |           |           |           |     X     |
| DOM       |           |     X     |     X     |           |     X     |
| HTTP      |           |           |     X     |     X     |     X     |
| Domain    |     X     |     X     |     X     |     X     |     X     |
```

Colibri is agnostic of the technology you use to build your UI. It doesn't care if you use React, Vue
or some other library or no library at all.

Your backend can be written in any platform. However, if your backend is written in Node.js, Colibri
lets you run your front-end and back-end in the same process without any I/O in milliseconds.

Colibri introduces some constraints about decoupling in your automation code as well as your application
code. These constraints allows Colibri to assemble your application and tests in many different ways.

![Animated gif showing how it works].

Colibri is designed to be used in conjunction with BDD/TDD. That means your workflow will be roughly:

* Write a scenario
* Implement the first step definition
* Write application code to make it pass
* Refactor your application code and automation code
* Repeat

If you are unable to work in this way, Colibri probably isn't for you.

Colibri is not designed to test exising browser applic

## Actors

The most important concept in Colibri is the `Actor`. When you use Colibri, your Cucumber step
definitions will interact with the application via `Actor` objects, for example:

```javascript
When("{actor} starts a new game with secret {word}", async (actor, secret) => {
  await actor.startNewGame(secret)
})
```

# Installation

First, you need to install colibri and a few other libraries into your existing Node.js application:

```
npm install --save-dev colibri cucumber cucumber-electron electron webdriverio selenium-standalone
```

Next, tell colibri to set up some basic files:

```
./node_modules/.bin/colibri init --ui=react
```

This will create a few files for you:

```
├── cucumber
├── cucumber-dom
├── cucumber-dom-http
├── cucumber-http
├── cucumber-webdriver
├── server.js
├── features
│   ├── step_definitions
│   └── support
│       ├── World.js
│       ├── actors
│       │   ├── DirectActor.js
│       │   ├── DomActor.js
│       │   └── WebdriverActor.js
│       └── parameter_types.js
└── lib
    ├── api
    │   ├── Api.js
    │   └── HttpApi.js
    └── react
        ├── App.js
        └── mountApp.js
```

# Your first scenario

At this point you can follow along with the examples provided in this guide (a word guessing game),
or if you are more adventurous, you can try to implement your own system.

We'll start with the following scenario:

```
Scenario: Anyone can create a game
  When Molly creates a game with the secret "steak"
  Then Benny can see a game with 5 letters
```

This scenario doesn't have a `Given` step, because there isn't any relevant initial state to configure
for this example.

More importantly, we've expressed the scenarios without mentioning anything
about implementation details like input fields, links or buttons. We'll come back to why
we're doing it this way later.

Let's run that scenario:

```
./cucumber
```

As expected, Cucumber will print out some snippets that we can paste into our `step_definitions.js` file.
Let's change the first one:

```javascript
When('{actor} creates a game with the secret {word}', async function (maker, secret) {
  await maker.createGame(secret)
})
```

The `{actor}` part of the step definition is an *output parameter*. Cucumber will turn the text
`Molly` into an `Actor` object and pass it into our function as the first argument, which we've
called `maker`. 

This is handled in the `parameter_types.js` file that Colibri generated for us. The secret word 
gets passed as a string to the `secret` parameter

We'll run the scenario again:

```
./cucumber
```

This time the step is red - it's thrown an exception because the `createGame` method doesn't exist yet.

At this point we have a several choices about what to do next:

* Implement some domain logic
* Implement part of the HTTP API
* Implement part of the UI

Ultimately we're going to have to tackle all of them, but we'll start with the domain logic for now.

If you take a peek inside the `./cucumber` script you'll see that we're defining an environment variable
before running Cucumber: `ACTOR=DirectActor`. This tells Colibri to instantiate a `DirectActor` object
for our `{actor}`. Let's add the `createGame` method in there:

```
async createGame(secret) {
  await this._codebreaker.createGame(this.getName(), secret)
}
```

## Implementation Agnostic


This is an important constraint. This will allow us to run the 
scenario in many different configurations (we call those configurations *assemblies*). 
You'll learn more about assembles soon.

Scenarios using Colibri can be run in many different configurations:

* Through the UI
* Through the HTTP API
* Through the server side domain logic (if using Node.js)

This imposes some important constraints on the way you write your Gherkin steps, step definitions
and `Actor` methods. They have to be *agnostic about implementation details* such as UI
fields, button and links.
