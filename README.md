## Domain Controllers

A domain controller is a controller (in the MVC sense) that is
decoupled from any infrastructure or frameworks.

Controller methods either represent *commands*, i.e. they trigger
a change to the system, or they represent *queries*, i.e. they
return system state.

### Commands

A command must return an object with a single `nextQuery` property:

```javascript
return {
  nextQuery: {
    name: 'showGame', 
    params: {
      id: 'game-56'
    }
  }
}
```

The `nextQuery` object has a `name` and a `params` object. The concept is
similar to a HTTP redirect, except that there is no HTTP involved.

### Queries

A query must return an object with a `data` property, and optionally
a `subscribe` property for streaming updates.

```javascript
return {
  data: {
    
  },
  subscribe: fn
}
```
