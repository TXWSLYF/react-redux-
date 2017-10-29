import {Component, Children} from 'react'
import PropTypes from 'prop-types'
import {storeShape, subscriptionShape} from '../utils/PropTypes'
import warning from '../utils/warning'

let didWarnAboutReceivingStore = false

function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return
  }
  didWarnAboutReceivingStore = true

  warning(
  '<Provider> does not support changing `store` on the fly. ' +
  'It is most likely that you see this error because you updated to ' +
  'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' +
  'automatically. See https://github.com/reactjs/react-redux/releases/' +
  'tag/v2.0.0 for the migration instructions.'
  )
}

export function createProvider(storeKey = 'store', subKey) {
  const subscriptionKey = subKey || `${storeKey}Subscription`

  class Provider extends Component {
    //将redux的store存放在context之中，方便子组件获取
    getChildContext() {
      return {[storeKey]: this[storeKey], [subscriptionKey]: null}
    }

    constructor(props, context) {
      super(props, context)
      this[storeKey] = props.store;
    }

    render() {
      //Children.only，react提供的方法，判断children是否为单一节点
      return Children.only(this.props.children)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    Provider.prototype.componentWillReceiveProps = function (nextProps) {
      //如果store发生了变化，则警告一遍，第二次不再警告
      if (this[storeKey] !== nextProps.store) {
        warnAboutReceivingStore()
      }
    }
  }

  Provider.propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
  }
  Provider.childContextTypes = {
    [storeKey]: storeShape.isRequired,
    [subscriptionKey]: subscriptionShape,
  }

  return Provider
}

export default createProvider()
