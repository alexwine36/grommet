import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { compose } from 'recompose';

import { getNewContainer } from '../../utils';
import { withTheme } from '../hocs';

import { LayerContainer } from './LayerContainer';

class Layer extends Component {
  static defaultProps = {
    full: false,
    margin: 'none',
    modal: true,
    position: 'center',
    responsive: true,
  };

  originalFocusedElement = document.activeElement;

  layerContainer = getNewContainer();

  componentWillUnmount() {
    if (this.originalFocusedElement) {
      if (this.originalFocusedElement.focus) {
        // wait for the fixed positioning to come back to normal
        // see layer styling for reference
        setTimeout(() => {
          this.originalFocusedElement.focus();
        }, 0);
      } else if (
        this.originalFocusedElement.parentNode &&
        this.originalFocusedElement.parentNode.focus
      ) {
        // required for IE11 and Edge
        this.originalFocusedElement.parentNode.focus();
      }
    }
    document.body.removeChild(this.layerContainer);
  }

  render() {
    const { theme, ...rest } = this.props;
    return createPortal(<LayerContainer {...rest} />, this.layerContainer);
  }
}

let LayerDoc;
if (process.env.NODE_ENV !== 'production') {
  LayerDoc = require('./doc').doc(Layer); // eslint-disable-line global-require
}
const LayerWrapper = compose(withTheme)(LayerDoc || Layer);

export { LayerWrapper as Layer };
