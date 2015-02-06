// Copyright 2002-2014, University of Colorado Boulder

/**
 * Pendulums system control panel node in 'Pendulum Lab' simulation.
 * Contains radio buttons to control number of pendulums, play/pause and step buttons and time speed control radio buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OnePendulumIconNode = require( 'PENDULUM_LAB/common/view/OnePendulumIconNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TwoPendulumIconNode = require( 'PENDULUM_LAB/common/view/TwoPendulumIconNode' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var normalString = require( 'string!PENDULUM_LAB/normal' );
  var slowMotionString = require( 'string!PENDULUM_LAB/slowMotion' );

  // constants
  var FONT = new PhetFont( 11 );
  var RECTANGULAR_BUTTON_BASE_COLOR = 'rgb( 230, 231, 232 )';

  /**
   * @param {Property<number>} numberOfPendulumsProperty - property to control number of pendulums.
   * @param {Property<boolean>} playProperty - property to control stream of time.
   * @param {Property<number>} timeSpeedProperty - property to control speed of time.
   * @param {Function} stepFunction - handler for step button.
   * @param {Object} [options] for tools control panel node
   * @constructor
   */
  function PendulumSystemControlPanelNode( numberOfPendulumsProperty, playProperty, timeSpeedProperty, stepFunction, options ) {
    HBox.call( this, _.extend( {
      spacing: 26, children: [
        // radio buttons to control number of pendulums
        new RadioButtonGroup( numberOfPendulumsProperty, [
          { node: new OnePendulumIconNode(), value: 1 },
          { node: new TwoPendulumIconNode(), value: 2 }
        ], {
          spacing: 9,
          orientation: 'horizontal',
          baseColor: RECTANGULAR_BUTTON_BASE_COLOR,
          disabledBaseColor: RECTANGULAR_BUTTON_BASE_COLOR,
          buttonContentXMargin: 3,
          buttonContentYMargin: 3
        } ),

        // play/pause and step buttons
        new HBox( {
          spacing: 10, children: [
            new PlayPauseButton( playProperty, { radius: 16 } ),
            new StepButton( stepFunction, playProperty, { radius: 12 } )
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
        ], { radius: 6, spacing: 9, radioButtonOptions: { xSpacing: 5 } } )
      ]
    }, options ) );
  }

  return inherit( HBox, PendulumSystemControlPanelNode );
} );