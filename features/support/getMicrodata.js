module.exports = function getMicrodata(element) {
  function descendToAttribute(scope, attribute) {
    return [].slice.apply(scope.children).reduce(function(props, child) {
      return props.concat(
        child.hasAttribute(attribute)
          ? [child]
          : descendToAttribute(child, attribute)
      )
    }, [])
  }

  function scopesUnder(scope) {
    return descendToAttribute(scope, 'itemscope')
  }

  function propsUnder(scope) {
    return descendToAttribute(scope, 'itemprop')
  }

  function dataAtScope(scope) {
    return propsUnder(scope).reduce(function(props, element) {
      props[element.getAttribute('itemprop')] = dataInPropElement(element)
      return props
    }, {})
  }

  function dataInPropElement(element) {
    const type = element.getAttribute('itemtype')
    switch (type) {
      case 'http://schema.org/Text':
        return element.innerHTML
      case 'http://schema.org/Integer':
        return Number(element.innerHTML)
      case 'http://schema.org/Boolean':
        return Boolean(element.innerHTML)
      case 'http://schema.org/ItemList':
        return scopesUnder(element).map(dataAtScope)
      default:
        throw new Error(
          `Unable to parse element with itemtype '${type}' (itemprop="${element.getAttribute('itemprop')}")`
        )
    }
  }

  const scope = scopesUnder(element)[0]
  if (!scope)
    throw new Error(`Found no itemscope under element: ${element.innerHTML}`)
  return dataAtScope(scope)
}
