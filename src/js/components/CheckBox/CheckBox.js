import React, { Component } from 'react';
import { compose } from 'recompose';

import { Box } from '../Box';
import { withFocus, withForwardRef, withTheme } from '../hocs';
import { removeUndefined } from '../../utils/object';

import {
  StyledCheckBox,
  StyledCheckBoxBox,
  StyledCheckBoxIcon,
  StyledCheckBoxContainer,
  StyledCheckBoxInput,
  StyledCheckBoxToggle,
  StyledCheckBoxKnob,
} from './StyledCheckBox';

import { normalizeColor } from '../../utils';

class CheckBox extends Component {
  constructor(props) {
    super(props);
    const { checked, indeterminate, toggle } = props;

    if (checked && indeterminate) {
      console.warn(
        'Checkbox cannot be "checked" and "indeterminate" at the same time.',
      );
    }

    if (toggle && indeterminate) {
      console.warn(
        'Checkbox of type toggle does not have "indeterminate" state.',
      );
    }
  }

  render() {
    const {
      checked,
      disabled,
      focus,
      forwardRef,
      id,
      label,
      name,
      onChange,
      reverse,
      theme,
      toggle,
      indeterminate,
      ...rest
    } = this.props;

    let hidden;
    if (disabled && checked) {
      hidden = <input name={name} type="hidden" value="true" />;
    }

    const {
      checked: CheckedIcon,
      indeterminate: IndeterminateIcon,
    } = theme.checkBox.icons;

    let borderColor = normalizeColor(theme.checkBox.border.color, theme);
    if (checked) {
      borderColor = normalizeColor(theme.checkBox.color || 'control', theme);
    }

    const visual = toggle ? (
      <StyledCheckBoxToggle focus={focus} theme={theme} checked={checked}>
        <StyledCheckBoxKnob theme={theme} />
      </StyledCheckBoxToggle>
    ) : (
      <StyledCheckBoxBox
        as={Box}
        align="center"
        justify="center"
        width={theme.checkBox.size}
        height={theme.checkBox.size}
        border={{
          size: theme.checkBox.border.width,
          color: borderColor,
        }}
        round={theme.checkBox.check.radius}
        focus={focus}
        theme={theme}
        checked={checked}
      >
        {!indeterminate &&
          checked &&
          (CheckedIcon ? (
            <CheckedIcon as={StyledCheckBoxIcon} theme={theme} />
          ) : (
            <StyledCheckBoxIcon
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              theme={theme}
            >
              <path fill="none" d="M6,11.3 L10.3,16 L18,6.2" />
            </StyledCheckBoxIcon>
          ))}
        {!checked &&
          indeterminate &&
          (IndeterminateIcon ? (
            <IndeterminateIcon as={StyledCheckBoxIcon} theme={theme} />
          ) : (
            <StyledCheckBoxIcon
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              theme={theme}
            >
              <path fill="none" d="M6,12 L18,12" />
            </StyledCheckBoxIcon>
          ))}
      </StyledCheckBoxBox>
    );

    const checkBoxNode = (
      <StyledCheckBox as={Box} align="center" justify="center" theme={theme}>
        <StyledCheckBoxInput
          {...rest}
          ref={forwardRef}
          type="checkbox"
          {...removeUndefined({
            id,
            name,
            checked,
            disabled,
            onChange,
          })}
          theme={theme}
          checked={checked}
          disabled={disabled}
        />
        {visual}
        {hidden}
      </StyledCheckBox>
    );

    const normalizedLabel =
      typeof label === 'string' ? <span>{label}</span> : label;

    const first = reverse ? normalizedLabel : checkBoxNode;
    const second = reverse ? checkBoxNode : normalizedLabel;

    return (
      <StyledCheckBoxContainer
        direction="row"
        align="center"
        as={props => <Box as="label" {...props} />}
        reverse={reverse}
        {...removeUndefined({ htmlFor: id, disabled })}
        theme={theme}
        gap={theme.checkBox.gap || 'small'}
        checked={checked}
        onClick={event => {
          // prevents clicking on the label trigging the event twice
          // https://stackoverflow.com/questions/24501497/why-the-onclick-element-will-trigger-twice-for-label-element
          if (event.target.type !== 'checkbox') {
            event.stopPropagation();
          }
        }}
      >
        {first}
        {second}
      </StyledCheckBoxContainer>
    );
  }
}

let CheckBoxDoc;
if (process.env.NODE_ENV !== 'production') {
  CheckBoxDoc = require('./doc').doc(CheckBox); // eslint-disable-line global-require
}
const CheckBoxWrapper = compose(
  withFocus,
  withTheme,
  withForwardRef,
)(CheckBoxDoc || CheckBox);

export { CheckBoxWrapper as CheckBox };
