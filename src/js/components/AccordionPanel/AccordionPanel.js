import React, { Component } from 'react';
import { compose } from 'recompose';

import { Box } from '../Box';
import { Button } from '../Button';
import { Collapsible } from '../Collapsible';
import { Heading } from '../Heading';
import { withTheme, withForwardRef } from '../hocs';
import { normalizeColor } from '../../utils';

import { AccordionContext } from '../Accordion/AccordionContext';

class AccordionPanel extends Component {
  state = {
    hover: undefined,
  };

  onMouseOver = (...args) => {
    const {
      onMouseOver,
      theme: { dark },
    } = this.props;
    this.setState({ hover: dark ? 'light-4' : 'dark-6' });
    if (onMouseOver) {
      onMouseOver(args);
    }
  };

  onMouseOut = (...args) => {
    const { onMouseOut } = this.props;
    this.setState({ hover: undefined });
    if (onMouseOut) {
      onMouseOut(args);
    }
  };

  onFocus = (...args) => {
    const {
      onFocus,
      theme: { dark },
    } = this.props;
    this.setState({ hover: dark ? 'light-4' : 'dark-6' });
    if (onFocus) {
      onFocus(args);
    }
  };

  onBlur = (...args) => {
    const { onBlur } = this.props;
    this.setState({ hover: undefined });
    if (onBlur) {
      onBlur(args);
    }
  };

  render() {
    const {
      children,
      header,
      label,
      theme,
      onMouseOut,
      onMouseOver,
      onFocus,
      onBlur,
      ...rest
    } = this.props;
    const { hover } = this.state;

    const iconColor = normalizeColor(
      theme.accordion.icons.color || 'control',
      theme,
    );

    return (
      <AccordionContext.Consumer>
        {panelContext => {
          const { active, animate, onPanelChange } = panelContext;
          const AccordionIcon = active
            ? theme.accordion.icons.collapse
            : theme.accordion.icons.expand;

          return (
            <Box flex={false}>
              <Button
                role="tab"
                aria-selected={active}
                aria-expanded={active}
                onClick={onPanelChange}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
              >
                {header || (
                  <Box
                    align="center"
                    direction="row"
                    justify="between"
                    {...rest}
                  >
                    {typeof label === 'string' ? (
                      <Box pad={{ horizontal: 'xsmall' }}>
                        <Heading level={4} color={hover}>
                          {label}
                        </Heading>
                      </Box>
                    ) : (
                      label
                    )}
                    {AccordionIcon && (
                      <Box pad={{ horizontal: 'small' }}>
                        <AccordionIcon color={iconColor} />
                      </Box>
                    )}
                  </Box>
                )}
              </Button>
              <Box border={{ side: 'bottom', color: 'border' }}>
                {animate ? (
                  <Collapsible open={active}>{children}</Collapsible>
                ) : (
                  active && children
                )}
              </Box>
            </Box>
          );
        }}
      </AccordionContext.Consumer>
    );
  }
}

let AccordionPanelDoc;
if (process.env.NODE_ENV !== 'production') {
  AccordionPanelDoc = require('./doc').doc(AccordionPanel); // eslint-disable-line global-require
}
const AccordionPanelWrapper = compose(
  withTheme,
  withForwardRef,
)(AccordionPanelDoc || AccordionPanel);

export { AccordionPanelWrapper as AccordionPanel };
