// Copyright 2014-2023, University of Colorado Boulder

/**
 * Pendula system control panel node in 'Pendulum Lab' simulation.
 * Contains radio buttons to control number of pendula, play/pause and step buttons and time speed control radio buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import StepForwardButton from '../../../../scenery-phet/js/buttons/StepForwardButton.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import pendulumLab from '../../pendulumLab.js';
import PendulumLabStrings from '../../PendulumLabStrings.js';
import PendulumLabConstants from '../PendulumLabConstants.js';
import PendulaIcons from './PendulaIcons.js';
import StopButton from './StopButton.js';

const normalString = PendulumLabStrings.normal;
const slowMotionString = PendulumLabStrings.slowMotion;

// constants
const FONT = PendulumLabConstants.TITLE_FONT;
const RECTANGULAR_BUTTON_BASE_COLOR = 'rgb( 230, 231, 232 )';

class PlaybackControlsNode extends Node {
  /**
   * @param {Property.<number>} numberOfPendulaProperty - property to control number of pendula.
   * @param {Property.<boolean>} isPlayingProperty - property to control stream of time.
   * @param {Property.<number>} timeSpeedProperty - property to control speed of time.
   * @param {function} stepCallback - handler for step button.
   * @param {function} stopCallback - handler for stop button.
   * @param {Object} [options] for tools control panel node
   */
  constructor( numberOfPendulaProperty, isPlayingProperty, timeSpeedProperty, stepCallback, stopCallback, options ) {

    const stopButton = new StopButton( {
      listener: stopCallback
    } );

    const pendulaCountRadioButtonGroup = new RectangularRadioButtonGroup( numberOfPendulaProperty, [
      { createNode: () => new Node( { children: [ PendulaIcons.ONE_PENDULUM_ICON ] } ), value: 1 },
      { createNode: () => new Node( { children: [ PendulaIcons.TWO_PENDULA_ICON ] } ), value: 2 }
    ], {
      spacing: 9,
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: RECTANGULAR_BUTTON_BASE_COLOR,
        xMargin: 3,
        yMargin: 3
      },
      touchAreaXDilation: 5,
      touchAreaYDilation: 8
    } );

    const playPauseNode = new HBox( {
      spacing: 10,
      children: [
        new PlayPauseButton( isPlayingProperty, {
          radius: 20,
          touchAreaDilation: 5
        } ),
        new StepForwardButton( {
          enabledProperty: DerivedProperty.not( isPlayingProperty ),
          listener: stepCallback,
          radius: 15,
          touchAreaDilation: 5
        } )
      ]
    } );

    const timeSpeedRadioNode = new VerticalAquaRadioButtonGroup( timeSpeedProperty, [
      { value: 1, createNode: () => new Text( normalString, { font: FONT } ) },
      { value: 1 / 8, createNode: () => new Text( slowMotionString, { font: FONT } ) }
    ], {
      spacing: 9,
      touchAreaXDilation: 10,
      radioButtonOptions: {
        radius: new Text( 'test', { font: FONT } ).height / 2.2,
        xSpacing: 5
      },
      maxWidth: 150
    } );

    stopButton.centerY = pendulaCountRadioButtonGroup.centerY = playPauseNode.centerY = timeSpeedRadioNode.centerY = 0;
    stopButton.centerX = 0;
    pendulaCountRadioButtonGroup.right = stopButton.left - 80;
    playPauseNode.left = stopButton.right + 80;
    timeSpeedRadioNode.left = playPauseNode.right + 40;

    super( merge( {
      children: [
        stopButton,
        pendulaCountRadioButtonGroup,
        playPauseNode,
        timeSpeedRadioNode
      ]
    }, options ) );
  }
}

pendulumLab.register( 'PlaybackControlsNode', PlaybackControlsNode );

export default PlaybackControlsNode;