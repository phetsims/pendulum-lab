// Copyright 2014-2015, University of Colorado Boulder

/**
 * Pendula system control panel node in 'Pendulum Lab' simulation.
 * Contains radio buttons to control number of pendula, play/pause and step buttons and time speed control radio buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PendulaIcons = require( 'PENDULUM_LAB/common/view/PendulaIcons' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var normalString = require( 'string!PENDULUM_LAB/normal' );
  var slowMotionString = require( 'string!PENDULUM_LAB/slowMotion' );

  // constants
  var FONT = PendulumLabConstants.TITLE_FONT;
  var RECTANGULAR_BUTTON_BASE_COLOR = 'rgb( 230, 231, 232 )';

  /**
   * @constructor
   *
   * @param {Property.<number>} numberOfPendulaProperty - property to control number of pendula.
   * @param {Property.<boolean>} isPlayingProperty - property to control stream of time.
   * @param {Property.<number>} timeSpeedProperty - property to control speed of time.
   * @param {function} stepFunction - handler for step button.
   * @param {Object} [options] for tools control panel node
   */
  function PlaybackControlsNode( numberOfPendulaProperty, isPlayingProperty, timeSpeedProperty, stepFunction, options ) {
    HBox.call( this, _.extend( {
      spacing: 31,
      children: [
        // radio buttons to control number of pendula
        new RadioButtonGroup( numberOfPendulaProperty, [
          { node: PendulaIcons.ONE_PENDULUM_ICON, value: 1 },
          { node: PendulaIcons.TWO_PENDULA_ICON, value: 2 }
        ], {
          spacing: 9,
          orientation: 'horizontal',
          baseColor: RECTANGULAR_BUTTON_BASE_COLOR,
          disabledBaseColor: RECTANGULAR_BUTTON_BASE_COLOR,
          buttonContentXMargin: 3,
          buttonContentYMargin: 3,
          touchAreaXDilation: 5,
          touchAreaYDilation: 8
        } ),

        // play/pause and step buttons
        new HBox( {
          spacing: 10, children: [
            new PlayPauseButton( isPlayingProperty, {
              radius: 20,
              touchAreaDilation: 5
            } ),
            new StepForwardButton( {
              playingProperty: isPlayingProperty,
              listener: stepFunction,
              radius: 15,
              touchAreaDilation: 5
            } )
          ]
        } ),

        // time speed checkbox
        new VerticalAquaRadioButtonGroup( [ {
          property: timeSpeedProperty,
          value: 1,
          node: new Text( normalString, { font: FONT } )
        }, {
          property: timeSpeedProperty,
          value: 1 / 8,
          node: new Text( slowMotionString, { font: FONT } )
        }
        ], {
          radius: new Text( 'test', { font: FONT } ).height / 2.2, // TODO: better way?
          spacing: 9,
          touchAreaXDilation: 10,
          radioButtonOptions: { xSpacing: 5 },
          maxWidth: 150
        } )
      ]
    }, options ) );
  }

  pendulumLab.register( 'PlaybackControlsNode', PlaybackControlsNode );

  return inherit( HBox, PlaybackControlsNode );
} );
