// Copyright 2014-2015, University of Colorado Boulder

/**
 * Arrow control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of velocity and acceleration arrows.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );

  // strings
  var velocityString = require( 'string!PENDULUM_LAB/velocity' );
  var accelerationString = require( 'string!PENDULUM_LAB/acceleration' );

  // constants
  var ARROW_LENGTH = 22;
  var ARROW_HEAD_WIDTH = 12;
  var ARROW_TAIL_WIDTH = 6;
  var FONT = new PhetFont( 11 );
  var TEXT_MARGIN_RIGHT = 5;
  var PANEL_WIDTH = PendulumLabConstants.LEFT_PANELS_MIN_WIDTH;
  var MAX_TEXT_WIDTH = PANEL_WIDTH * .60;  // allows for 60% of the horizontal space in the panel for text.

  /**
   * @param {Property.<boolean>} isVelocityVisibleProperty - Property to control visibility of velocity arrows.
   * @param {Property.<boolean>} isAccelerationVisibleProperty - Property to control visibility of acceleration arrows.
   * @param {Object} [options] for tools control panel node
   * @constructor
   */
  function ArrowsPanelNode( isVelocityVisibleProperty, isAccelerationVisibleProperty, options ) {
    var textStrings = [
      new Text( velocityString, { font: FONT, centerY: 0, maxWidth: MAX_TEXT_WIDTH } ),
      new Text( accelerationString, { font: FONT, centerY: 0, maxWidth: MAX_TEXT_WIDTH } )
    ];

    var maxStringWidth = 0;
    textStrings.forEach( function( textString ) {
      maxStringWidth = Math.max( maxStringWidth, textString.width );
    } );

    PanelPendulumAbstract.call( this,
      new Node( {
        children: [
          // necessary to expand panel
          new HStrut( PANEL_WIDTH, { pickable: false } ),

          new VerticalCheckBoxGroup( [
            {
              content: new Node( {
                pickable: false,
                children: [
                  textStrings[ 0 ],
                  new ArrowNode( maxStringWidth + TEXT_MARGIN_RIGHT, 0, maxStringWidth + TEXT_MARGIN_RIGHT + ARROW_LENGTH, 0, {
                    fill: PendulumLabConstants.VELOCITY_ARROW_COLOR,
                    centerY: 0,
                    tailWidth: ARROW_TAIL_WIDTH,
                    headWidth: ARROW_HEAD_WIDTH
                  } )
                ]
              } ),
              property: isVelocityVisibleProperty
            },
            {
              content: new Node( {
                pickable: false,
                children: [
                  textStrings[ 1 ],
                  new ArrowNode( maxStringWidth + TEXT_MARGIN_RIGHT, 0, maxStringWidth + TEXT_MARGIN_RIGHT + ARROW_LENGTH, 0, {
                    fill: PendulumLabConstants.ACCELERATION_ARROW_COLOR,
                    centerY: 0,
                    tailWidth: ARROW_TAIL_WIDTH,
                    headWidth: ARROW_HEAD_WIDTH
                  } )
                ]
              } ),
              property: isAccelerationVisibleProperty
            }
          ], { spacing: 5, boxWidth: 15 } )
        ]
      } ),
      _.extend( { yMargin: 7 }, options )
    );
  }

  pendulumLab.register( 'ArrowsPanelNode', ArrowsPanelNode );

  return inherit( PanelPendulumAbstract, ArrowsPanelNode );
} );